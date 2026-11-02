const test = require('node:test');
const assert = require('node:assert');
const { buildOverrideYaml, isValidProjectId, isRateLimited, launchHistory } = require('../server.js');

test('isValidProjectId rejects path traversal and odd characters', () => {
  assert.ok(isValidProjectId('grafana'));
  assert.ok(isValidProjectId('airflow-2'));
  for (const bad of ['..', '../etc', 'a/b', 'Grafana', '', '-x', 'a b', undefined]) {
    assert.ok(!isValidProjectId(bad), `should reject ${bad}`);
  }
});

test('buildOverrideYaml binds ports to the given IP and disables outbound NAT', () => {
  const yaml = buildOverrideYaml(
    [{ service: 'grafana', internal_port: 3000, env_overrides: ['GF_SERVER_ROOT_URL={{URL}}'] }],
    { grafana: 21000 },
    { grafana: 'https://example.com/demo/21000/' },
    '172.17.0.1'
  );
  assert.match(yaml, /- "172\.17\.0\.1:21000:3000"/);
  assert.match(yaml, /GF_SERVER_ROOT_URL=https:\/\/example\.com\/demo\/21000\//);
  assert.match(yaml, /enable_ip_masquerade: "false"/);
  assert.match(yaml, /pids_limit: 256/);
  assert.doesNotMatch(yaml, /0\.0\.0\.0/);
});

test('isRateLimited allows a burst then blocks, per IP', () => {
  launchHistory.clear();
  const now = Date.now();
  for (let i = 0; i < 5; i++) assert.ok(!isRateLimited('1.2.3.4', now));
  assert.ok(isRateLimited('1.2.3.4', now));
  assert.ok(!isRateLimited('5.6.7.8', now));
  // Window slides: old launches stop counting
  assert.ok(!isRateLimited('1.2.3.4', now + 11 * 60 * 1000));
});

test('publicError never leaks the command or host paths', () => {
  const { publicError } = require('../server.js');
  const cmd = 'Command failed: docker compose -p demo-x -f /home/user/projets/grafana/docker-compose.yml up -d';
  const cases = [
    { message: cmd, stderr: "The command 'docker' could not be found in this WSL 2 distro." },
    { message: cmd, stderr: 'Error response from daemon: pull access denied for foo' },
    { message: cmd, stderr: 'Bind for 172.17.0.1:21000 failed: port is already allocated' },
    { message: cmd, stderr: 'something unexpected in /tmp/portfolio-override-x.yml' },
    Object.assign(new Error('spawn docker ENOENT'), { code: 'ENOENT' }),
  ];
  for (const err of cases) {
    const msg = publicError(err);
    assert.doesNotMatch(msg, /\/home|\/tmp|docker compose/);
  }
  assert.match(publicError(cases[0]), /Docker est indisponible/);
  assert.match(publicError(cases[4]), /Docker est indisponible/);
});

test('pushLog strips ANSI codes, host paths and keeps a bounded buffer', () => {
  const { pushLog } = require('../server.js');
  const os = require('os');
  const session = { logs: [], logSeq: 0 };
  pushLog(session, `\x1b[34mINFO\x1b[0m starting\r\n\n${os.tmpdir()}/portfolio-override-x.yml loaded\n`);
  assert.deepStrictEqual(session.logs.map((l) => l.text), ['INFO starting', '/portfolio-override-x.yml loaded']);
  for (let i = 0; i < 500; i++) pushLog(session, `line ${i}`);
  assert.strictEqual(session.logs.length, 400);
  assert.strictEqual(session.logs.at(-1).n, session.logSeq);
});
