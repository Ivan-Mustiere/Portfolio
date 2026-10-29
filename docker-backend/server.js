const express = require('express');
const { execFile, spawn } = require('child_process');
const { promisify } = require('util');
const net = require('net');
const http = require('http');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const execFileAsync = promisify(execFile);

const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(__dirname, '..', 'projets');
const VPS_HOST = process.env.VPS_HOST || 'localhost';
// Base URL for demo service links shown in the iframe (must be HTTPS in production to avoid mixed content)
const VPS_URL_PREFIX = process.env.VPS_URL_PREFIX || `http://${VPS_HOST}`;
// Host IP demo ports are published on. Never 0.0.0.0: demos must only be reachable through nginx.
// In compose, use the docker0 gateway (172.17.0.1) so the containerized backend can reach them too.
const DEMO_BIND_IP = process.env.DEMO_BIND_IP || '127.0.0.1';
// Host to probe when checking if a port is open
const HEALTH_HOST = process.env.HEALTH_HOST || DEMO_BIND_IP;
const SECRET = process.env.DOCKER_BACKEND_SECRET;
const PORT_MIN = 20000;
const PORT_MAX = 59999;
const SESSION_TTL_MS = 15 * 60 * 1000;
const MAX_EXTENSIONS = 3;
const MAX_SESSIONS = Number(process.env.MAX_SESSIONS) || 3;
const LAUNCH_RATE_LIMIT = Number(process.env.LAUNCH_RATE_LIMIT) || 5;
const LAUNCH_RATE_WINDOW_MS = 10 * 60 * 1000;
const PROJECT_ID_RE = /^[a-z0-9][a-z0-9-]{0,62}$/;
const SESSION_ID_RE = /^[a-f0-9]{16}$/;
const DEMO_PROJECT_PREFIX = 'demo-';
const OVERRIDE_PREFIX = 'portfolio-override-';

const sessions = new Map();
const allocatedPorts = new Set();
const launchHistory = new Map(); // clientIp -> [timestamps]
const launchesToday = { day: new Date().toDateString(), count: 0 };
const STATS_CACHE_MS = 5000;
let statsCache = { at: 0, data: null };
const HISTORY_INTERVAL_MS = 10000;
const HISTORY_SIZE = 60; // 10 minutes
const history = []; // { t, cpu, mem } ratios, oldest first
const LOG_BUFFER = 400;
const LOG_LINE_MAX = 240;

function isValidProjectId(id) {
  return typeof id === 'string' && PROJECT_ID_RE.test(id);
}

function checkTcpPort(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 2000 });
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
  });
}

// Readiness = the app answers HTTP. A TCP connect alone isn't enough: Docker's port proxy
// accepts connections before the app inside listens.
function checkHttp(host, port, urlPath = '/') {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: urlPath, timeout: 3000 }, (res) => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function allocatePort() {
  for (let attempts = 0; attempts < 1000; attempts++) {
    const port = Math.floor(Math.random() * (PORT_MAX - PORT_MIN + 1)) + PORT_MIN;
    if (allocatedPorts.has(port)) continue;
    // Skip ports already used on the host by something we don't track
    if (await checkTcpPort(HEALTH_HOST, port)) continue;
    allocatedPorts.add(port);
    return port;
  }
  throw new Error('No available ports');
}

function releasePort(port) {
  allocatedPorts.delete(port);
}

// Sliding-window limit on launches per client IP
function isRateLimited(clientIp, now = Date.now()) {
  const recent = (launchHistory.get(clientIp) || []).filter((t) => now - t < LAUNCH_RATE_WINDOW_MS);
  if (recent.length >= LAUNCH_RATE_LIMIT) {
    launchHistory.set(clientIp, recent);
    return true;
  }
  recent.push(now);
  launchHistory.set(clientIp, recent);
  return false;
}

async function scanProjects() {
  const projects = [];
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || !isValidProjectId(entry.name)) continue;
      const portfolioPath = path.join(PROJECTS_DIR, entry.name, 'portfolio.json');
      try {
        const data = await fs.readFile(portfolioPath, 'utf8');
        const config = JSON.parse(data);
        projects.push({ id: entry.name, ...config });
      } catch {
        // No valid portfolio.json
      }
    }
  } catch {
    // projets dir not found
  }
  return projects;
}

function buildOverrideYaml(services, portMap, urlMap, bindIp = DEMO_BIND_IP) {
  let yaml = 'services:\n';
  for (const svc of services) {
    const ext = portMap[svc.service];
    yaml += `  ${svc.service}:\n`;
    yaml += `    ports:\n      - "${bindIp}:${ext}:${svc.internal_port}"\n`;
    yaml += `    pids_limit: 256\n`;
    yaml += `    security_opt:\n      - "no-new-privileges:true"\n`;
    if (svc.env_overrides && svc.env_overrides.length > 0) {
      const svcUrl = urlMap[svc.service];
      yaml += `    environment:\n`;
      for (const entry of svc.env_overrides) {
        // {{URL}}: public URL with trailing slash; {{BASE}}: same without it (e.g. Airflow base_url)
        const value = entry.replace(/\{\{URL\}\}/g, svcUrl).replace(/\{\{BASE\}\}/g, svcUrl.replace(/\/$/, ''));
        yaml += `      - ${JSON.stringify(value)}\n`;
      }
    }
  }
  // No NAT on the demo network: published ports still work inbound, but containers can't reach the internet
  yaml += 'networks:\n  default:\n    driver_opts:\n      com.docker.network.bridge.enable_ip_masquerade: "false"\n';
  return yaml;
}

function composeArgs(session, ...rest) {
  const composePath = path.join(session.projectDir, 'docker-compose.yml');
  return ['compose', '-p', `${DEMO_PROJECT_PREFIX}${session.sessionId}`, '-f', composePath, '-f', session.overrideFile, ...rest];
}

const TIMEOUT_ERROR = 'Timeout : le service n\'a pas démarré dans les délais';

// Message shown to visitors: never the raw command or stderr, which leak host paths
function publicError(err) {
  const detail = `${err.message}\n${err.stderr || ''}`;
  if (err.message === TIMEOUT_ERROR) return TIMEOUT_ERROR;
  if (err.code === 'ENOENT' || /docker.*(not found|could not be found)|Cannot connect to the Docker daemon/i.test(detail)) {
    return 'Docker est indisponible sur le serveur pour le moment.';
  }
  if (/pull access denied|manifest unknown|failed to resolve reference/i.test(detail)) {
    return 'L\'image de la démo est introuvable.';
  }
  if (/port is already allocated|address already in use/i.test(detail)) {
    return 'Port déjà utilisé, relance la démo.';
  }
  return 'La démo n\'a pas pu démarrer. Réessaie dans quelques minutes.';
}

// --- Startup logs streamed to the demo page ---

const ANSI_RE = /\x1b\[[0-9;?]*[ -\/]*[@-~]/g;

function pushLog(session, raw) {
  for (let line of raw.split(/\r?\n|\r/)) {
    // Same rule as publicError: never show host paths to visitors
    line = line.replace(ANSI_RE, '').split(PROJECTS_DIR).join('').split(os.tmpdir()).join('').trimEnd();
    if (!line.trim()) continue;
    if (line.length > LOG_LINE_MAX) line = `${line.slice(0, LOG_LINE_MAX)}…`;
    session.logSeq += 1;
    session.logs.push({ n: session.logSeq, text: line });
  }
  if (session.logs.length > LOG_BUFFER) session.logs.splice(0, session.logs.length - LOG_BUFFER);
}

// Like execFileAsync, but streams output into the session log as it comes
function runStreaming(session, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args);
    let stderr = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.stdout.on('data', (chunk) => pushLog(session, chunk.toString()));
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      pushLog(session, chunk.toString());
    });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve();
      reject(Object.assign(new Error(`Command failed: docker ${args.join(' ')}`), { stderr, code }));
    });
  });
}

function followLogs(session) {
  const child = spawn('docker', composeArgs(session, 'logs', '-f', '--no-color', '--no-log-prefix', '--tail', '50'));
  child.stdout.on('data', (chunk) => pushLog(session, chunk.toString()));
  child.stderr.on('data', (chunk) => pushLog(session, chunk.toString()));
  child.on('error', () => {});
  session.logProc = child;
}

function stopFollowingLogs(session) {
  if (session.logProc) {
    session.logProc.kill();
    session.logProc = null;
  }
}

// Runs docker compose up and polls for port availability
async function startContainers(session) {
  const { sessionId } = session;
  try {
    await runStreaming(session, composeArgs(session, 'up', '-d', '--pull', 'missing'), 120000);
    followLogs(session);

    const maxAttempts = 150; // 5 min max
    for (let i = 0; i < maxAttempts && !session.cancelled; i++) {
      await sleep(2000);
      const checks = await Promise.all(
        session.portChecks.map(({ port, path: urlPath }) => checkHttp(HEALTH_HOST, port, urlPath))
      );
      if (checks.every(Boolean)) break;
      if (i === maxAttempts - 1) throw new Error(TIMEOUT_ERROR);
    }
    // Stopped by the visitor while starting: stopSession left the teardown to us
    if (session.cancelled) {
      await dockerDown(session);
      return;
    }
    session.status = 'ready';
    pushLog(session, '✔ Prêt : ouverture de l’interface');
    session.ttlTimer = setTimeout(() => stopSession(session), SESSION_TTL_MS);
    // The page only shows logs while starting; keep a few seconds for the last poll
    setTimeout(() => stopFollowingLogs(session), 10000);
  } catch (err) {
    session.status = 'error';
    session.error = publicError(err);
    console.error(`[demo-${sessionId}] error:`, err.message.split('\n')[0], err.stderr ? `\n${err.stderr.trim()}` : '');
    await dockerDown(session);
    // Keep the failed session long enough for the UI to poll the error, then free the slot
    setTimeout(() => sessions.delete(sessionId), 60000);
  }
}

async function dockerDown(session) {
  stopFollowingLogs(session);
  try {
    await execFileAsync('docker', composeArgs(session, 'down', '-v', '--remove-orphans'), { timeout: 60000 });
  } catch (err) {
    console.error(`[demo-${session.sessionId}] down failed:`, err.message.split('\n')[0]);
  }
  for (const port of Object.values(session.portMap)) releasePort(port);
  try { await fs.unlink(session.overrideFile); } catch {}
}

async function stopSession(session) {
  if (session.ttlTimer) {
    clearTimeout(session.ttlTimer);
    session.ttlTimer = null;
  }
  sessions.delete(session.sessionId);
  if (session.status === 'starting') {
    // `compose up` may still be running; startContainers tears down once it returns
    session.cancelled = true;
    return;
  }
  await dockerDown(session);
}

// Removes demo containers/networks/volumes left over from a previous backend process
async function purgeOrphanDemos() {
  const listByLabel = async (kind) => {
    const args = kind === 'container'
      ? ['ps', '-a', '--filter', 'label=com.docker.compose.project', '--format', '{{.ID}} {{.Label "com.docker.compose.project"}}']
      // Volumes have no ID, only a name
      : [kind, 'ls', '--filter', 'label=com.docker.compose.project', '--format', `{{.${kind === 'volume' ? 'Name' : 'ID'}}} {{.Label "com.docker.compose.project"}}`];
    const { stdout } = await execFileAsync('docker', args);
    return stdout.split('\n').filter(Boolean)
      .map((line) => line.split(' '))
      .filter(([, project]) => project && project.startsWith(DEMO_PROJECT_PREFIX))
      .map(([id]) => id);
  };

  try {
    const containers = await listByLabel('container');
    if (containers.length) await execFileAsync('docker', ['rm', '-f', '-v', ...containers]);
    const networks = await listByLabel('network');
    if (networks.length) await execFileAsync('docker', ['network', 'rm', ...networks]);
    const volumes = await listByLabel('volume');
    if (volumes.length) await execFileAsync('docker', ['volume', 'rm', '-f', ...volumes]);
    if (containers.length) console.log(`Purged ${containers.length} orphan demo container(s)`);
  } catch (err) {
    console.error('Orphan purge failed:', err.message.split('\n')[0]);
  }

  try {
    const tmp = os.tmpdir();
    for (const file of await fs.readdir(tmp)) {
      if (file.startsWith(OVERRIDE_PREFIX)) await fs.unlink(path.join(tmp, file)).catch(() => {});
    }
  } catch {}
}

function sessionView(session) {
  return {
    sessionId: session.sessionId,
    status: session.status,
    services: session.services,
    error: session.error,
    startedAt: session.startedAt,
    extensions: session.extensions,
  };
}

function countLaunch() {
  const day = new Date().toDateString();
  if (launchesToday.day !== day) {
    launchesToday.day = day;
    launchesToday.count = 0;
  }
  launchesToday.count += 1;
}

// Public host metrics for the homepage. os.* reads /proc, which reflects the host even from a container.
async function collectStats() {
  if (statsCache.data && Date.now() - statsCache.at < STATS_CACHE_MS) return statsCache.data;

  let containersRunning = null;
  try {
    const { stdout } = await execFileAsync('docker', ['ps', '-q'], { timeout: 5000 });
    containersRunning = stdout.split('\n').filter(Boolean).length;
  } catch {}

  const today = new Date().toDateString();
  const active = [...sessions.values()].filter((s) => s.status === 'starting' || s.status === 'ready');
  const data = {
    uptimeSeconds: Math.floor(os.uptime()),
    cpuCount: os.cpus().length,
    load1: os.loadavg()[0],
    memTotal: os.totalmem(),
    memUsed: os.totalmem() - os.freemem(),
    containersRunning,
    activeDemos: active.map((s) => ({ projectId: s.projectId, status: s.status })),
    launchesToday: launchesToday.day === today ? launchesToday.count : 0,
    history: { intervalSeconds: HISTORY_INTERVAL_MS / 1000, cpu: history.map((h) => h.cpu), mem: history.map((h) => h.mem) },
  };
  statsCache = { at: Date.now(), data };
  return data;
}

function sampleHistory() {
  history.push({
    t: Date.now(),
    cpu: Math.round((os.loadavg()[0] / os.cpus().length) * 1000) / 1000,
    mem: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 1000) / 1000,
  });
  if (history.length > HISTORY_SIZE) history.shift();
}

function findActiveSession(projectId) {
  return [...sessions.values()].find(
    (s) => s.projectId === projectId && (s.status === 'starting' || s.status === 'ready')
  );
}

// --- Routes ---

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  if (req.headers['x-backend-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.param('projectId', (req, res, next, id) => {
  if (!isValidProjectId(id)) return res.status(400).json({ error: 'projectId invalide' });
  next();
});

app.param('sessionId', (req, res, next, id) => {
  if (!SESSION_ID_RE.test(id)) return res.status(400).json({ error: 'sessionId invalide' });
  next();
});

app.get('/running/:projectId', (req, res) => {
  const session = findActiveSession(req.params.projectId);
  if (!session) return res.status(404).json({ error: 'Aucune session active' });
  res.json(sessionView(session));
});

app.get('/stats', async (req, res) => {
  res.json(await collectStats());
});

app.get('/projects', async (req, res) => {
  const projects = await scanProjects();
  res.json(projects);
});

app.post('/launch/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const projectDir = path.join(PROJECTS_DIR, projectId);

  // One shared instance per project: a second visitor joins the running demo
  const existing = findActiveSession(projectId);
  if (existing) return res.json(sessionView(existing));

  const clientIp = req.headers['x-client-ip'] || req.ip;
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Trop de lancements, réessaie dans quelques minutes' });
  }
  if (sessions.size >= MAX_SESSIONS) {
    return res.status(503).json({ error: 'Trop de démos en cours, réessaie dans quelques minutes' });
  }

  let config;
  try {
    const data = await fs.readFile(path.join(projectDir, 'portfolio.json'), 'utf8');
    config = JSON.parse(data);
  } catch {
    return res.status(404).json({ error: 'Projet introuvable' });
  }

  const sessionId = crypto.randomBytes(8).toString('hex');

  const portMap = {};
  try {
    for (const svc of config.services) {
      portMap[svc.service] = await allocatePort();
    }
  } catch (err) {
    for (const port of Object.values(portMap)) releasePort(port);
    return res.status(503).json({ error: err.message });
  }

  const urlMap = {};
  for (const svc of config.services) {
    urlMap[svc.service] = `${VPS_URL_PREFIX}/demo/${portMap[svc.service]}/`;
  }

  const overrideFile = path.join(os.tmpdir(), `${OVERRIDE_PREFIX}${sessionId}.yml`);
  await fs.writeFile(overrideFile, buildOverrideYaml(config.services, portMap, urlMap));

  const services = config.services.map((svc) => ({
    name: svc.name,
    url: urlMap[svc.service],
    credentials: svc.credentials || null,
  }));

  const session = {
    sessionId,
    projectId,
    projectDir,
    overrideFile,
    portMap,
    // health_path (portfolio.json) may use {{PATH}}, the /demo/<port> prefix the app is served under
    portChecks: config.services.map((svc) => ({
      port: portMap[svc.service],
      path: (svc.health_path || '/').replace(/\{\{PATH\}\}/g, `/demo/${portMap[svc.service]}`),
    })),
    services,
    status: 'starting',
    startedAt: Date.now(),
    ttlTimer: null,
    error: null,
    extensions: 0,
    cancelled: false,
    logs: [],
    logSeq: 0,
    logProc: null,
  };
  sessions.set(sessionId, session);
  countLaunch();

  startContainers(session);

  res.json(sessionView(session));
});

// Incremental: the page passes the last line number it has as ?since=
app.get('/logs/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session introuvable' });
  const since = Number(req.query.since) || 0;
  res.json({ status: session.status, next: session.logSeq, lines: session.logs.filter((l) => l.n > since) });
});

app.get('/status/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session expirée ou introuvable' });
  res.json(sessionView(session));
});

app.post('/extend/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session introuvable' });
  if (session.status !== 'ready') return res.status(400).json({ error: 'Session non active' });
  if (session.extensions >= MAX_EXTENSIONS) {
    return res.status(403).json({ error: 'Nombre maximum d\'extensions atteint', extensions: session.extensions });
  }

  clearTimeout(session.ttlTimer);
  session.ttlTimer = setTimeout(() => stopSession(session), SESSION_TTL_MS);
  session.extensions += 1;

  res.json({ ok: true, extensions: session.extensions, remaining: MAX_EXTENSIONS - session.extensions });
});

app.delete('/session/:sessionId', async (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session introuvable' });
  await stopSession(session);
  res.json({ ok: true });
});

async function main() {
  if (!SECRET) {
    console.error('DOCKER_BACKEND_SECRET est requis : refus de démarrer sans authentification.');
    process.exit(1);
  }
  await purgeOrphanDemos();
  sampleHistory();
  setInterval(sampleHistory, HISTORY_INTERVAL_MS).unref();
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`docker-backend on :${port}`));
}

if (require.main === module) main();

module.exports = { buildOverrideYaml, isValidProjectId, isRateLimited, launchHistory, publicError, pushLog };
