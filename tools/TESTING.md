## Translation regression

Run `test-translation.cjs` with a real Electron runtime and an unmodified preload
from the target Fiddler installation. No npm dependencies are needed. The test
executes the repository's actual BrowserWindow hook with startup side effects
stubbed, then creates real windows and exercises renderer/main IPC. It does not
run the local API server or patch backend or license code.

For 8.2.0, also supply the original frontend bundle. The test extracts its exact
shell guard; only the subsequent configuration callback is stubbed.

```sh
FE_TEST_PRELOAD=/path/to/official/out/services/lib/preload.js \
FE_TEST_BUNDLE=/path/to/official/out/WebServer/ClientApp/dist/main-A4XC5VKN.js \
electron tools/test-translation.cjs
```

For 8.1.0, use its original preload and its `contextIsolation: false` preference:

```sh
FE_TEST_PRELOAD=/path/to/8.1/out/services/lib/preload.js \
FE_TEST_LEGACY=1 electron tools/test-translation.cjs
```

Obtain the original files and runtime from the official installers:
[8.2.0 Linux](https://downloads.getfiddler.com/linux/fiddler-everywhere-8.2.0.AppImage),
[8.1.0 Linux](https://downloads.getfiddler.com/linux/fiddler-everywhere-8.1.0.AppImage).
The preload is packed in `resources/app.asar`; the frontend is under
`resources/app.asar.unpacked`. Use an ASAR extractor. An extracted application
runtime can also run the test by pointing its temporary `resources/app/package.json`
main entry at the test using a relative path, with the original ASAR outside that
runtime's `resources` directory. Use a separate runtime copy and profile.

Assertions cover translation enabled/disabled, installed preload and zoom,
send/invoke, duplicate subscriptions, once/off/removeListener/removeAllListeners,
initial labels/attributes, namespaced SVG exclusion, appended elements and bare
text, nodeValue/data and attribute updates, repeated Ctrl+T English/Chinese switching, regex restoration,
retained click listeners, reload, popouts, and exclusion of auxiliary pages.
The fixture's CSP forbids ordinary inline scripts without a nonce.

IPC listener results must match the translation-disabled baseline. In the tested
official 8.2.0 preload/Electron 42.7.1, off/removeListener do not remove the
bridged callback; the cumulative hit counts are `[2,4,6,9,11,11]`. The original
8.1.0 preload correctly removes it, yielding `[2,3,3,4,4,4]`. Translation preserves
each version's behavior. This test does not replace or repair the official bridge.

To check the regression against old source, set `FE_TEST_SOURCE_ROOT` to a
directory containing the old `server/index.js` and `server/translate.js`.
The 8.2.0 run must fail when translation is enabled because the shell guard never
sends `get-config-data`.

Linux GUI tests require a working display (X11 was used for these tests).
Chromium startup flags needed by a container, such as `--no-sandbox`, are test
environment options, not changes to the application's WebPreferences. Windows,
macOS and older Fiddler releases require their own installation smoke tests.
