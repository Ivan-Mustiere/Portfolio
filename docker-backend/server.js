const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const net = require('net');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const execAsync = promisify(exec);
const app = express();
app.use(express.json());

const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(__dirname, '..', 'projets');
// Host-side path used by Docker CLI for compose file references (may differ in containerized deployments)
const PROJECTS_HOST_DIR = process.env.PROJECTS_HOST_DIR || PROJECTS_DIR;
const VPS_HOST = process.env.VPS_HOST || 'localhost';
// Host to probe when checking if a port is open (use host.docker.internal when backend is containerized)
const HEALTH_HOST = process.env.HEALTH_HOST || 'localhost';
const SECRET = process.env.DOCKER_BACKEND_SECRET;
const PORT_MIN = 20000;
const PORT_MAX = 59999;
const SESSION_TTL_MS = 15 * 60 * 1000;

const sessions = new Map();
const allocatedPorts = new Set();

app.use((req, res, next) => {
  if (SECRET && req.headers['x-backend-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

function allocatePort() {
  let port;
  let attempts = 0;
  do {
    port = Math.floor(Math.random() * (PORT_MAX - PORT_MIN + 1)) + PORT_MIN;
    attempts++;
    if (attempts > 1000) throw new Error('No available ports');
  } while (allocatedPorts.has(port));
  allocatedPorts.add(port);
  return port;
}

function releasePort(port) {
  allocatedPorts.delete(port);
}

function checkTcpPort(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 2000 });
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scanProjects() {
  const projects = [];
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
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

function buildOverrideYaml(services, portMap) {
  let yaml = 'services:\n';
  for (const svc of services) {
    const ext = portMap[svc.service];
    yaml += `  ${svc.service}:\n    ports:\n      - "${ext}:${svc.internal_port}"\n`;
  }
  return yaml;
}

// Runs docker compose up and polls for port availability
async function startContainers(session, config) {
  const { sessionId, projectDir, overrideFile } = session;
  // Use container-side path for the -f flag (docker CLI runs inside this container)
  const composePath = path.join(projectDir, 'docker-compose.yml');
  try {
    const cmd = `docker compose -p "demo-${sessionId}" -f "${composePath}" -f "${overrideFile}" up -d --pull missing`;
    await execAsync(cmd, { timeout: 120000 });

    const maxAttempts = 150; // 5 min max
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(2000);
      const checks = await Promise.all(
        session.portChecks.map(({ port }) => checkTcpPort(HEALTH_HOST, port))
      );
      if (checks.every(Boolean)) {
        session.status = 'ready';
        session.ttlTimer = setTimeout(() => stopSession(session), SESSION_TTL_MS);
        return;
      }
    }
    session.status = 'error';
    session.error = 'Timeout : le service n\'a pas démarré dans les délais';
    await dockerDown(session, composePath);
  } catch (err) {
    session.status = 'error';
    session.error = err.stderr ? err.stderr.split('\n').filter(Boolean).pop() : err.message.split('\n')[0];
    console.error(`[demo-${sessionId}] error:`, session.error);
    await dockerDown(session, composePath);
  }
}

async function dockerDown(session, composePath) {
  try {
    await execAsync(
      `docker compose -p "demo-${session.sessionId}" -f "${composePath}" -f "${session.overrideFile}" down -v --remove-orphans`,
      { timeout: 30000 }
    );
  } catch {}
  for (const port of Object.values(session.portMap)) releasePort(port);
  try { await fs.unlink(session.overrideFile); } catch {}
}

async function stopSession(session) {
  if (session.ttlTimer) {
    clearTimeout(session.ttlTimer);
    session.ttlTimer = null;
  }
  const composePath = path.join(session.projectDir, 'docker-compose.yml');
  await dockerDown(session, composePath);
  sessions.delete(session.sessionId);
}

async function cleanupContainers(session) {
  await stopSession(session);
}

// --- Routes ---

app.get('/running/:projectId', (req, res) => {
  const session = [...sessions.values()].find(
    (s) => s.projectId === req.params.projectId && (s.status === 'starting' || s.status === 'ready')
  );
  if (!session) return res.status(404).json({ error: 'Aucune session active' });
  res.json({
    sessionId: session.sessionId,
    status: session.status,
    services: session.services,
    error: session.error,
    startedAt: session.startedAt,
    extensions: session.extensions,
  });
});

app.get('/projects', async (req, res) => {
  const projects = await scanProjects();
  res.json(projects);
});

app.post('/launch/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const projectDir = path.join(PROJECTS_DIR, projectId);
  const projectHostDir = path.join(PROJECTS_HOST_DIR, projectId);

  let config;
  try {
    const data = await fs.readFile(path.join(projectDir, 'portfolio.json'), 'utf8');
    config = JSON.parse(data);
  } catch {
    return res.status(404).json({ error: 'Projet introuvable' });
  }

  const sessionId = crypto.randomBytes(8).toString('hex');

  let portMap = {};
  try {
    for (const svc of config.services) {
      portMap[svc.service] = allocatePort();
    }
  } catch (err) {
    return res.status(503).json({ error: err.message });
  }

  const overrideFile = `/tmp/portfolio-override-${sessionId}.yml`;
  await fs.writeFile(overrideFile, buildOverrideYaml(config.services, portMap));

  const services = config.services.map((svc) => ({
    name: svc.name,
    url: `http://${VPS_HOST}:${portMap[svc.service]}`,
    credentials: svc.credentials || null,
  }));

  const session = {
    sessionId,
    projectId,
    projectDir,
    projectHostDir,
    overrideFile,
    portMap,
    portChecks: config.services.map((svc) => ({ port: portMap[svc.service] })),
    services,
    status: 'starting',
    startedAt: Date.now(),
    ttlTimer: null,
    error: null,
    extensions: 0,
  };
  sessions.set(sessionId, session);

  startContainers(session, config);

  res.json({ sessionId, services, status: 'starting' });
});

app.get('/status/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session expirée ou introuvable' });
  res.json({
    sessionId: session.sessionId,
    status: session.status,
    services: session.services,
    error: session.error,
    startedAt: session.startedAt,
    extensions: session.extensions,
  });
});

const MAX_EXTENSIONS = 3;

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

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`docker-backend on :${port}`));
