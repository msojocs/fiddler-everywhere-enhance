Screenshots for [PR #130](https://github.com/msojocs/fiddler-everywhere-enhance/pull/130).

Both images are direct Electron `webContents.capturePage()` PNGs of the actual
Fiddler Everywhere 8.2.0 Linux application, using separate unsigned-in test
profiles, Chinese translation enabled, a 1360 x 900 viewport, and scale factor 1.
No image compositing or text replacement was applied to the screenshots.

- Installer: `https://downloads.getfiddler.com/linux/fiddler-everywhere-8.2.0.AppImage`
- Installer SHA-256: `70ff431270d48f49b70c9ef50127b76f7007ee58d41ce770e1b910ac791ecba2`
- Before source: `5e53fe4faefa2fcf081dd708910e31d767edfcbd`
- After source: `5ec8ba6c4469a1f53e41fe38575a6d5a58a00844`
- Capture date: 2026-10-18

For each version, the matching `server/index.js`, `server/translate.js`, and
`server/file` were installed into a separate unpacked copy of the official app,
following the repository's manual installation layout. The original main module
was retained as `out/main.original.js`. A test-only monitor resized the window,
observed IPC, and captured the rendered page. The official frontend, preload, and
.NET backend were used. Both launches logged a successful connection to the
.NET Core server.

`before.png` reproduces the Electron application shell error: `window.ipc` is
absent and the page never requests `get-config-data`. `after.png` shows the real
welcome/login page: IPC is present, configuration is requested, and the existing
dictionary translates the welcome heading and the Learn More / Report Issue
links. Some text is still English.

This verifies startup through the signed-out welcome screen. Authentication,
traffic capture, Windows, and macOS were not exercised.
