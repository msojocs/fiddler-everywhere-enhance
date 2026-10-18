// Run with Electron; supply unmodified official files as documented in TESTING.md.
const { app, BrowserWindow, ipcMain } = require('electron');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fe-translation-'));
app.setPath('userData', path.join(root, 'profile'));
app.disableHardwareAcceleration();
app.on('window-all-closed', () => {});
const watchdog = setTimeout(() => app.exit(2), 60000);
const sourceRoot = process.env.FE_TEST_SOURCE_ROOT || path.join(__dirname, '..');
const source = fs.readFileSync(path.join(sourceRoot, 'server/index.js'), 'utf8');
const translator = fs.readFileSync(path.join(sourceRoot, 'server/translate.js'), 'utf8');
const configRequests = new Set();
const sends = new Set();
ipcMain.on('get-config-data', (event) => configRequests.add(event.sender.id));
ipcMain.on('translation-test-send', (event) => sends.add(event.sender.id));
ipcMain.handle('translation-test-invoke', (_event, value) => value);
ipcMain.handle('translation-test-emit', (event, channel) => event.sender.send(channel, 'payload'));

// Execute the real window hook, excluding the unrelated local API server. The
// harness stubs startup side effects; windows, preloads and renderer IPC are real.
function createHook(directory) {
  const moduleStub = { _load: () => ({ BrowserWindow }) };
  function TestWindow(options) { return new BrowserWindow(options); }
  TestWindow.prototype = Object.create(BrowserWindow.prototype);
  const electron = { app: new EventEmitter(), BrowserWindow: TestWindow };
  const fakeFs = Object.create(fs);
  fakeFs.readFileSync = (file, ...args) => file === path.resolve(directory, '../package.json')
    ? '{"version":"7.0.0"}' : fs.readFileSync(file, ...args);
  vm.runInNewContext(source.slice(0, source.indexOf('// Server')), {
    __dirname: directory, global: {},
    console: { info() {}, error: console.error },
    require: (name) => {
      if (name === 'electron') return electron;
      if (name === 'module') return { Module: moduleStub };
      if (name === 'fs') return fakeFs;
      if (name === 'child_process') return { spawn() { throw Error('Unexpected backend launch'); } };
      return require(name);
    },
  });
  return moduleStub._load('electron').BrowserWindow;
}

async function waitFor(win, expression) {
  await win.webContents.executeJavaScript(`new Promise((resolve, reject) => {
    const timer = setTimeout(() => { clearInterval(poll); reject(Error('Timed out: ' + ${JSON.stringify(expression)})); }, 3000);
    const poll = setInterval(() => { if (${expression}) { clearInterval(poll); clearTimeout(timer); resolve(); } }, 10);
  })`);
}

async function checkIpc(win) {
  const result = await win.webContents.executeJavaScript(`(async () => {
    const ipc = window.ipc;
    ipc.send('translation-test-send');
    const invoked = await ipc.invoke('translation-test-invoke', { value: 42 });
    const hits = [];
    const phases = [];
    const listener = (_event, value) => hits.push(value);
    const emit = async () => {
      await ipc.invoke('translation-test-emit', 'translation-test-event');
      await new Promise(resolve => setTimeout(resolve, 10));
      phases.push(hits.length);
    };
    ipc.on('translation-test-event', listener);
    ipc.on('translation-test-event', listener);
    await emit();
    ipc.off('translation-test-event', listener);
    await emit();
    ipc.removeListener('translation-test-event', listener);
    await emit();
    ipc.once('translation-test-event', listener);
    await emit();
    await emit();
    ipc.on('translation-test-event', listener);
    ipc.removeAllListeners('translation-test-event');
    await emit();
    return { invoked, hits, phases };
  })()`);
  assert.deepEqual(result.invoked, { value: 42 });
  assert(result.hits.every(value => value === 'payload'));
  assert.equal(result.phases[0], 2, 'on registers both listeners');
  assert.equal(result.phases[3] - result.phases[2], result.phases[4] - result.phases[3] + 1, 'once fires only once');
  assert.equal(result.phases[5], result.phases[4], 'removeAllListeners removes all listeners');
  assert(sends.has(win.webContents.id), 'send reaches the main process');
  return result;
}

async function checkTranslation(win) {
  await waitFor(win, "document.body.lang === 'zhCn'");
  const read = () => win.webContents.executeJavaScript(`({
    text: document.querySelector('#label').textContent,
    title: document.querySelector('#label').title,
    placeholder: document.querySelector('input').placeholder,
    zoom: document.querySelector('#zoom').textContent,
    userText: document.querySelector('.rule-title').textContent,
    pageGlobal: typeof window.switchLanguage,
    textFactoryUnchanged: document.createTextNode === window.originalCreateTextNode
  })`);
  assert.deepEqual(await read(), {
    text: '设置', title: '设置', placeholder: '设置', zoom: '缩放: 50%',
    userText: 'Settings', pageGlobal: 'undefined', textFactoryUnchanged: true,
  });
  assert.equal(await win.webContents.executeJavaScript("document.querySelector('#namespaced-logo').textContent"), 'Settings', 'namespaced SVG content is left unchanged');
  await win.webContents.executeJavaScript(`{
    const item = document.createElement('button');
    item.id = 'dynamic'; item.title = 'Settings';
    item.appendChild(document.createTextNode('Settings'));
    item.addEventListener('click', () => window.buttonClicked = true);
    document.body.appendChild(item);
    const bare = document.createTextNode('Settings');
    document.querySelector('#bare').appendChild(bare);
  }`);
  await waitFor(win, "document.querySelector('#dynamic').textContent === '设置' && document.querySelector('#bare').textContent === '设置'");
  await win.webContents.executeJavaScript(`{
    document.querySelector('#dynamic').firstChild.nodeValue = 'Save';
    document.querySelector('#dynamic').title = 'Save';
    document.querySelector('input').placeholder = 'Save';
    document.querySelector('#zoom').firstChild.data = 'Zoom: 75%';
  }`);
  await waitFor(win, "document.querySelector('#dynamic').textContent === '保存' && document.querySelector('#dynamic').title === '保存' && document.querySelector('input').placeholder === '保存' && document.querySelector('#zoom').textContent === '缩放: 75%'");
  // Use the actual keyboard/panel flow, twice, including regex restoration.
  for (const language of ['en', 'zhCn', 'en', 'zhCn']) {
    // Dispatch through the DOM so hidden-window focus cannot drop native input.
    await win.webContents.executeJavaScript("document.dispatchEvent(new KeyboardEvent('keyup', { key: 'T', ctrlKey: true, bubbles: true }))");
    await waitFor(win, "!!document.querySelector('#languageChangePanel')");
    await win.webContents.executeJavaScript(`{
      document.querySelector('#languageSelect').value = ${JSON.stringify(language)};
      document.querySelector('#languageChangeButton').click();
    }`);
    const english = language === 'en';
    await waitFor(win, `document.querySelector('#label').textContent === '${english ? 'Settings' : '设置'}'`);
    assert.deepEqual(await win.webContents.executeJavaScript(`[
      document.querySelector('#dynamic').textContent, document.querySelector('#dynamic').title,
      document.querySelector('input').placeholder, document.querySelector('#zoom').textContent,
      document.querySelector('#bare').textContent
    ]`), english ? ['Save', 'Save', 'Save', 'Zoom: 75%', 'Settings'] : ['保存', '保存', '保存', '缩放: 75%', '设置']);
    await win.webContents.executeJavaScript("document.querySelector('#closeLanguageChangePanel').click()");
  }
  await win.webContents.executeJavaScript("document.querySelector('#dynamic').click()");
  assert.equal(await win.webContents.executeJavaScript('window.buttonClicked'), true);
}

app.whenReady().then(async () => {
  const preload = process.env.FE_TEST_PRELOAD;
  assert(preload && fs.existsSync(preload), 'FE_TEST_PRELOAD must name an original installed preload');
  const bundle = process.env.FE_TEST_BUNDLE;
  let guard;
  if (bundle) {
    const frontend = fs.readFileSync(bundle, 'utf8');
    // Extract the exact 8.2.0 guard and stub only the subsequent config callback.
    guard = frontend.match(/f_1=\(\)=>\{if\(window\.removeEventListener\("load",f_1\)[\s\S]*?\};window\.addEventListener\("load",f_1\);/);
    assert(guard, 'Expected the official 8.2.0 bootstrap guard');
  }
  const bootstrap = guard ? 'var QCt=function(){};var ' + guard[0]
    : 'window.addEventListener("load", () => window.ipc.send("get-config-data"))';
  const html = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="script-src 'nonce-bootstrap'; style-src 'unsafe-inline'"></head><body>
    <button id="label" title="Settings">Settings</button><input placeholder="Settings">
    <span id="zoom">Zoom: 50%</span><div id="bare"></div><div class="rule-title">Settings</div>
    <script nonce="bootstrap">
      window.originalCreateTextNode = document.createTextNode;
      const logo = document.createElementNS('http://www.w3.org/2000/svg', 'svg:svg');
      logo.id = 'namespaced-logo';
      const logoText = document.createElementNS('http://www.w3.org/2000/svg', 'svg:text');
      logoText.textContent = 'Settings';
      logo.appendChild(logoText);
      document.body.prepend(logo);
      ${bootstrap}
    </script>
    </body></html>`;
  const results = [];
  let baselineIpc;
  for (const enabled of [false, true]) {
    const directory = path.join(root, enabled ? 'enabled' : 'disabled', 'out');
    const page = path.join(directory, 'WebServer/ClientApp/dist/index.html');
    fs.mkdirSync(path.dirname(page), { recursive: true });
    fs.writeFileSync(page, html);
    if (enabled) fs.writeFileSync(path.join(directory, 'translate.js'), translator);
    const Window = createHook(directory);
    // Legacy versions assign IPC directly and use contextIsolation: false.
    const legacy = process.env.FE_TEST_LEGACY === '1';
    const options = { show: false, webPreferences: {
      preload: path.resolve(preload), additionalArguments: ['--fiddler-zoom-factor=1.25'],
      ...(legacy ? { contextIsolation: false } : {}),
    } };
    const win = new Window(options);
    const errors = [];
    win.webContents.on('preload-error', (_event, _file, error) => errors.push(error.message));
    win.webContents.on('console-message', (...args) => {
      const message = typeof args[1] === 'object' ? args[1].message : args[2];
      if (message?.includes('Uncaught')) errors.push(message);
    });
    await win.loadFile(page);
    assert(configRequests.has(win.webContents.id), 'frontend sends get-config-data');
    assert.equal(options.webPreferences.preload, path.resolve(preload), 'installed preload is preserved');
    const ipc = await checkIpc(win);
    if (!enabled) baselineIpc = ipc;
    else assert.deepEqual(ipc, baselineIpc, 'translation preserves all installed IPC listener semantics');
    if (enabled) await checkTranslation(win);
    else assert.equal(await win.webContents.executeJavaScript("document.querySelector('#label').textContent"), 'Settings');
    assert.deepEqual(errors, []);
    assert.equal(win.webContents.getZoomFactor(), 1.25, 'installed zoom initialization is preserved');
    const prefs = win.webContents.getLastWebPreferences();
    results.push({ enabled, electron: process.versions.electron,
      contextIsolation: prefs.contextIsolation, sandbox: prefs.sandbox,
      officialBootstrapGuard: !!guard, ipcCallsAndListeners: 'passed', listenerHitCounts: ipc.phases,
      translation: enabled ? 'passed' : 'disabled' });
    if (enabled) {
      await win.loadFile(page);
      await checkTranslation(win);
      // Another window using the app frontend (popout) gets the same support.
      const popout = new Window({ show: false, webPreferences: { ...options.webPreferences } });
      await popout.loadFile(page);
      await checkTranslation(popout);
      popout.destroy();
      // Local auxiliary windows and external pages retain their own preload.
      const auxiliary = path.join(directory, 'splash.html');
      fs.writeFileSync(auxiliary, '<!doctype html><html><body>Settings</body></html>');
      await win.loadFile(auxiliary);
      assert.equal(await win.webContents.executeJavaScript('document.body.lang'), '');
      await win.loadURL('data:text/html,<div>Settings</div>');
      assert.equal(await win.webContents.executeJavaScript('document.body.lang'), '');
      const noPreload = new Window({ show: false });
      await noPreload.loadFile(auxiliary);
      assert.equal(await noPreload.webContents.executeJavaScript('typeof window.ipc'), 'undefined');
      noPreload.destroy();
    }
    win.destroy();
  }
  console.log(JSON.stringify(results, null, 2));
  console.log('PASS: preload/IPC, initial and dynamic translation, Ctrl+T, reload, popout and auxiliary windows.');
  clearTimeout(watchdog);
  fs.rmSync(root, { recursive: true, force: true });
  app.exit(0);
}).catch((error) => { console.error(error); app.exit(1); });
