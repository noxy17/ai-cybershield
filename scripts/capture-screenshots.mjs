import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('.');
const outDir = join(root, 'report-assets', 'screenshots');
const profileDir = join(root, 'report-assets', 'edge-profile');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9223;
const baseUrl = 'http://127.0.0.1:5173';

await mkdir(outDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true });
await mkdir(profileDir, { recursive: true });

const edge = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore', detached: false });

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function waitForDebugger() {
  for (let i = 0; i < 60; i += 1) {
    try {
      await fetchJson(`http://127.0.0.1:${port}/json/version`);
      return;
    } catch {
      await wait(500);
    }
  }
  throw new Error('Edge remote debugger did not start.');
}

function createCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const events = [];

  ws.addEventListener('message', (message) => {
    const payload = JSON.parse(message.data);
    if (payload.id && pending.has(payload.id)) {
      const { resolve: resolvePending, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message));
      else resolvePending(payload.result);
    } else if (payload.method) {
      events.push(payload);
    }
  });

  return new Promise((resolveSocket, rejectSocket) => {
    ws.addEventListener('open', () => {
      resolveSocket({
        send(method, params = {}) {
          id += 1;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((resolvePending, reject) => pending.set(id, { resolve: resolvePending, reject }));
        },
        waitForEvent(method, timeout = 10000) {
          return new Promise((resolveEvent, rejectEvent) => {
            const existingIndex = events.findIndex((event) => event.method === method);
            if (existingIndex >= 0) {
              resolveEvent(events.splice(existingIndex, 1)[0]);
              return;
            }
            const timer = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), timeout);
            const listener = (message) => {
              const payload = JSON.parse(message.data);
              if (payload.method === method) {
                clearTimeout(timer);
                ws.removeEventListener('message', listener);
                resolveEvent(payload);
              }
            };
            ws.addEventListener('message', listener);
          });
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener('error', rejectSocket);
  });
}

async function newTab() {
  const tab = await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const cdp = await createCdp(tab.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  return cdp;
}

async function capture(route, fileName, authed = false) {
  const cdp = await newTab();
  await cdp.send('Page.navigate', { url: baseUrl });
  await cdp.waitForEvent('Page.loadEventFired');
  if (authed) {
    await cdp.send('Runtime.evaluate', {
      expression: "localStorage.setItem('cybershield.access','report-demo-token');",
      awaitPromise: true,
    });
  }
  await cdp.send('Page.navigate', { url: `${baseUrl}${route}` });
  await cdp.waitForEvent('Page.loadEventFired');
  await wait(1200);
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(join(outDir, fileName), Buffer.from(result.data, 'base64'));
  cdp.close();
}

try {
  await waitForDebugger();
  await capture('/', '01-landing.png');
  await capture('/login', '02-login.png');
  await capture('/register', '03-register.png');
  await capture('/app', '04-dashboard.png', true);
  await capture('/app/scan', '05-scan.png', true);
  await capture('/app/history', '06-history.png', true);
  await capture('/app/admin', '07-admin.png', true);
  console.log(outDir);
} finally {
  edge.kill();
}
