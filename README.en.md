# Fiddler Everywhere Enhance

[简体中文](./README.md) | **English**

[Hall of Shame](./shame.md)

## Downloads

### Latest version

| Platform | Download URL |
|----------|--------------|
| Linux | https://api.getfiddler.com/linux/latest-linux |
| Windows | https://api.getfiddler.com/win/latest |
| macOS (Intel) | https://api.getfiddler.com/mac/latest-mac |
| macOS (Arm64) | https://api.getfiddler.com/mac-arm64/latest-mac |

### Older versions

| Platform | Download URL |
|----------|--------------|
| Linux | https://downloads.getfiddler.com/linux/fiddler-everywhere-[version].AppImage |
| Windows | https://downloads.getfiddler.com/win/Fiddler%20Everywhere%20[version].exe |
| macOS (Intel) | https://downloads.getfiddler.com/mac/Fiddler%20Everywhere%20[version].dmg |
| macOS (Arm64) | https://downloads.getfiddler.com/mac-arm64/Fiddler%20Everywhere%20[version].dmg |

> [!NOTE]
> Replace `[version]` in the URLs above with the version you want to download.
> For example, download version `5.19.0` for Windows at https://downloads.getfiddler.com/win/Fiddler%20Everywhere%205.19.0.exe .

> [!TIP]
> See the [version history](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history) for available versions.

## How it works and sequence diagram

The project has two stages: installation preparation and application runtime.

- **Installation preparation**: On Windows and Linux, [fe-tool/main.go](./fe-tool/main.go) prepares the Fiddler installer, the repository's `server` resources, and the patch files in parallel. Once all tasks finish, it calls [patch.Apply](./fe-tool/patch/patch.go). This extracts `app.asar`, moves `server/file` to `resources/app/out/file`, backs up the original entry script as `main.original.js`, concatenates `server/index.js` with the original entry script to create a new `main.js`, and replaces the native library and the existing `System.Linq.dll`.
- **Startup hooks**: [server/index.js](./server/index.js) runs in the Electron main process. It hooks process spawning, window creation, and page loading while asynchronously starting a local HTTP server on port `5678`. Before the original application starts `Fiddler.WebUi`, the spawn hook temporarily changes the entry point in `package.json` to `out/main.original.js` and restores the frontend API URLs on disk. It rewrites those URLs to local addresses before loading `index.html`, then restores the file after the page finishes loading.
- **Application backend**: `Fiddler.WebUi` is a separate .NET child process. It checks script integrity at startup, provides local application APIs and real-time communication, and repeats the script checks during runtime. Electron passes its port through `--port`, waits for the `Server ready` output, and requests `/api/ControlPanel/Status` to confirm readiness before loading the main window.
- **Backend public key matching patch**: The replacement `WebServer/System.Linq.dll` changes `Enumerable.Any(source, predicate)` to accept a specific public key byte prefix. `FiddlerBackendSDK` uses this method to check whether a response signing key is in its predefined allowlist. After that check passes, the backend still verifies the ECDSA signature using the public key from the response.
- **Local responses**: The HTTP server maps requests to files in [server/file](./server/file). It first looks for the requested path with `.json` appended and signs responses from that branch. User, token, and quota data come from these predefined files.

The diagram below shows the main runtime sequence after installation preparation. Backend behavior was checked against the original entry script, `Fiddler.WebUi.dll`, and `FiddlerBackendSDK.dll` from Fiddler Everywhere **8.1.0**. The local HTTP server runs in the same Electron main process as the hooks. `System.Linq.dll` is a library called inside the backend process. Both appear as separate participants to clarify their roles. The original application waits for `Fiddler.WebUi` to become ready, but the injected code does not wait for the service on port `5678` before loading the window.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Main as Electron main process
    participant Backend as Fiddler.WebUi backend
    participant Linq as Patched System.Linq.dll
    participant UI as Frontend page
    participant Server as Local HTTP server

    User->>Main: Start the application
    Main->>Main: Run injected code<br/>Register startup and window hooks
    par Initialize the local server asynchronously
        Main-)Server: Start HTTP server initialization
        Server->>Server: Generate an ECDSA P-256 key pair
        Server->>Server: Listen on port 5678
    and Run the original entry script and load the window
        Main->>Main: Continue with the original entry script
        Main->>Main: Before spawn, set package.json main<br/>to out/main.original.js and restore the frontend script
        Main->>Backend: Spawn the child process<br/>Pass --port and other arguments
        Backend->>Backend: Check the Electron entry script<br/>and frontend main script
        Note over Main,Backend: Integrity checks read from disk<br/>Restore the scripts before starting the backend
        Backend->>Backend: Initialize local application services<br/>Start the background integrity checker
        Backend-->>Main: Write Server ready to stdout
        Main->>Backend: GET /api/ControlPanel/Status
        Backend-->>Main: HTTP 200<br/>fiddler-orchestra-generated header is *
        Main->>Main: Before loadURL(index.html),<br/>rewrite frontend API URLs to local addresses
        Note over UI,Server: api / identity requests use local port 5678
        Main->>UI: Load the local index.html<br/>Execute the rewritten frontend script
        UI-->>Main: did-finish-load
        Main->>Main: Restore frontend API URLs on disk
        Note over Main,UI: The script in memory keeps the local URLs<br/>The restored file is used by later integrity checks
        Main->>UI: Inject response signing key matching logic
    end

    UI->>Backend: Call local application APIs<br/>Establish a SignalR connection
    Backend-->>UI: Return results and push events

    Note over UI,Server: The following request assumes the local server is listening
    UI->>Server: Request an endpoint, for example<br/>/api.getfiddler.com/users
    Server->>Server: Normalize Host and path<br/>Map .be to .com
    Server->>Server: Look up the corresponding path under file
    alt A file exists with .json appended
        Server->>Server: Read JSON content
        opt The request includes x-request-nonce
            Server->>Server: Set x-response-nonce to the same value
        end
        Server->>Server: Serialize JSON, add timestamps,<br/>and generate an ECDSA signature
        Server-->>UI: JSON + Signature + timestamp headers
    else Only the original file path exists
        Server->>Server: Read the original file
        Server-->>UI: File content, such as authorization redirect HTML
    else No file is found
        Server-->>UI: not implement (HTTP 200 by default)
    end

    opt The backend receives a response with Signature
        Backend->>Backend: SignedResponseHelper parses<br/>the response public key and signature
        Backend->>Linq: Any(predefined keys, compare with response key)
        Linq->>Linq: Iterate and check byte[] element prefixes
        alt An element matches the patched key prefix
            Linq-->>Backend: Return true immediately<br/>The public key allowlist check passes
        else The specific prefix does not match
            Linq-->>Backend: Evaluate the original predicate and return its result
        end
        opt The key check passes
            Backend->>Backend: Import the response public key<br/>Verify the ECDSA / SHA-256 signature
        end
    end

    loop Every 15 minutes during runtime (8.1.0)
        Backend->>Backend: IntegrityCheckService checks<br/>both scripts on disk again
        Note over Main,Backend: A failed check triggers backend shutdown<br/>The main process exits when it detects backend exit
    end

    User->>Main: Quit the application normally
    Main->>Backend: POST /api/ControlPanel/Shutdown
    Main->>Main: On quit, restore package.json main<br/>to out/main.js
```

**Restoring scripts before startup allows the startup checks to pass.** The startup code in `Fiddler.WebUi` calls `ScriptHelper.TryOpenElectronMainScript` and `TryOpenClientMainScript` to read the scripts and check their hashes. The first locates the Electron entry script through `main` in `package.json`, so the hook points it to `main.original.js`, which retains the original content. The second checks the frontend main script, so `mainXHandle.reset()` must first undo the API URL changes. These operations run before the original `spawn`, allowing the new backend process to read the original scripts. Electron has already executed the enhanced entry script at this point, so changing `package.json` on disk does not remove the hooks installed in the current process.

**Restoring the frontend script after loading allows periodic checks to pass.** In 8.1.0, the backend's `IntegrityCheckService` checks these scripts again every 15 minutes and requests backend shutdown if a check fails. The frontend script is therefore rewritten temporarily before `loadURL(index.html)` so the page loads the modified content into memory, then restored on disk at `did-finish-load`. Restoring the file does not replace JavaScript already executed by the current page, so subsequent API requests still use the local server. Commit [a21aa8b](https://github.com/msojocs/fiddler-everywhere-enhance/commit/a21aa8b2f30dd554df7069fa5c920812c8e836d4) added this restoration to fix application exits caused by the checks at 15-minute intervals. This restoration only undoes the API URL replacements; it does not automatically undo other manual changes to the script.

**The `System.Linq.dll` patch changes the backend's response signing key allowlist check.** The automatic tool downloads the [v10.0.9-1 patched library](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1) through `DownloadCommon()`, then calls `replaceSystemLinq()` to replace the existing DLL under `WebServer`. The patch adds `HasAnyByteArrayPrefix` to the overload of `Enumerable.Any` that takes a predicate. When iteration reaches a `byte[]` beginning with `30 59 30 13 06 07 2A 86 48 CE`, it returns `true` immediately. Other elements are still evaluated using the original predicate.

In 8.1.0, `SignedResponseHelper` normally uses `Any` to iterate over predefined public keys and compares them with the response public key using `SequenceEqual`. The patch makes this allowlist check pass when the prefix matches. The backend then still calls `ImportSubjectPublicKeyInfo` and `ECDsa.VerifyData` to verify the response. The local server must therefore still generate a signature that matches the response content, and the script hash checks described above must still pass. The corresponding frontend public key matching behavior is provided by the `Array.prototype.some` hook injected by `server/index.js`.

API URLs are rewritten in two forms: complete URLs become `http://127.0.0.1:5678/<original-domain>/...`, while domains assembled from string segments become `http://api.getfiddler.be:5678` or `http://identity.getfiddler.be:5678`. The latter require the hosts entries described below. The server adds the original domain directory based on the Host header. For example, `/api.getfiddler.com/users` reads `file/api.getfiddler.com/users.json`. Requests without a matching file return `not implement` and are not forwarded to a remote endpoint.

The window hook also enables developer tools, toggled with `F12`. If `out/translate.js` exists, the hook uses it as the preload script to provide language support. The diagram uses Mermaid `sequenceDiagram`, which GitHub renders directly in the README.

## Getting started: patch or enhance v5.9.0 and later

These steps may also work with other versions.

> [!IMPORTANT]
> Fiddler Everywhere for Windows uses `libfiddler.dll` in version 5.16.0 and earlier. Starting with 5.17.0, the file is named `fiddler.dll`.

> [!TIP]
>
> - [This project's automatic patch tool](https://github.com/msojocs/fiddler-everywhere-enhance/releases)
> - [Another automatic patch project for Windows and Linux](https://github.com/auto-yui-patch/fiddler-everywhere-patch-automated)

### Automatic tool

1. Download the automatic tool from [Releases](https://github.com/msojocs/fiddler-everywhere-enhance/releases).
2. Run `fe-tool.exe -version latest` on Windows or `fe-tool -version latest` on Linux.
3. When the tool finishes, the patched application is available in the `FiddlerEverywhere` directory.

### Windows

1. Delete `libfiddler.dll`, or `fiddler.dll` for version 5.17.0 and later.
2. Download `yui-fiddler-win32-x86_64-vx.x.x.dll` from [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases).
3. For version 5.16.0 and earlier, rename it to `libfiddler.dll`. For version 5.17.0 and later, rename it to `fiddler.dll`.
4. Move the renamed DLL into the Fiddler Everywhere root directory.
5. Download `System.Linq.dll` from the [v10.0.9-1 release](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1).
6. Replace `Fiddler/resources/app/out/WebServer/System.Linq.dll`.
7. Extract `app.asar` using the [instructions below](#extracting-appasar).
8. Copy `resources/app/out/main.js` to `resources/app/out/main.original.js`.
9. Modify `main.js` using the [instructions below](#modifying-mainjs).
10. Copy this repository's `server/file` to `Fiddler/resources/app/out/file`.
11. Open `C:\Windows\System32\drivers\etc\hosts` with administrator privileges and append:

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

### Linux

1. Delete `libfiddler.so`.
2. Download `yui-libfiddler-linux-x86_64-vx.x.x.so` from [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases).
3. Rename it to `libfiddler.so` and move it into the Fiddler Everywhere root directory.
4. Download `System.Linq.dll` from the [v10.0.9-1 release](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1).
5. Replace `Fiddler/resources/app/out/WebServer/System.Linq.dll`.
6. Extract `app.asar` using the [instructions below](#extracting-appasar).
7. Copy `resources/app/out/main.js` to `resources/app/out/main.original.js`.
8. Modify `main.js` using the [instructions below](#modifying-mainjs).
9. Copy this repository's `server/file` to `Fiddler/resources/app/out/file`.
10. Open `/etc/hosts` with root privileges and append:

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

> [!NOTE]
> You may need to recompile `libfiddler.so` yourself.

### macOS

Application paths below are relative to the Fiddler Everywhere `.app` bundle. Its `Resources` directory is located at `Contents/Resources`.

1. Delete `libfiddler.dylib` from `Contents/Frameworks`, or `fiddler.dylib` for version 5.17.0 and later.
2. Download `yui-fiddler-mac-[arch]-vx.x.x.dylib` for your architecture from [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases).
3. For version 5.16.0 and earlier, rename it to `libfiddler.dylib`. For version 5.17.0 and later, rename it to `fiddler.dylib`.
4. Move the renamed file into `Contents/Frameworks`.
5. Download `System.Linq.dll` from the [v10.0.9-1 release](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1).
6. Replace `Contents/Resources/app/out/WebServer/System.Linq.dll`.
7. Extract `app.asar` using the [instructions below](#extracting-appasar), substituting `Contents/Resources` for `resources`.
8. Copy `Contents/Resources/app/out/main.js` to `Contents/Resources/app/out/main.original.js`.
9. Modify `main.js` using the [instructions below](#modifying-mainjs).
10. Copy this repository's `server/file` to `Contents/Resources/app/out/file`.
11. Open `/etc/hosts` with root privileges and append:

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

> [!NOTE]
> You may need to recompile `fiddler.dylib`, or `libfiddler.dylib` for version 5.16.0 and earlier, yourself.
>
> You may also need to run `sudo codesign -s "-" --deep --force --verbose "/Applications/Fiddler Everywhere.app"`. See [issue #96](https://github.com/msojocs/fiddler-everywhere-enhance/issues/96#issuecomment-2814035393).

## Extracting `app.asar`

1. Open `resources/app.asar.unpacked` and create an empty file named `NOTICES-reporter.txt`.
2. In the `resources` directory, use [asar](https://www.npmjs.com/package/asar) to run `asar e app.asar app`, extracting `app.asar` into the `app` directory.
3. Delete `app.asar`.

## Modifying `main.js`

1. Open `resources/app/out/main.js` in a text editor.
2. Insert the entire contents of this repository's [server/index.js](./server/index.js) at the beginning of `main.js`, keeping the original code after it.

## Changing your name and email (optional)

To change the default first name, last name, and email, edit `resources/app/out/file/identity.getfiddler.com/oauth/token.json`. Example file contents:

```json
{
  "id_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjU4MDY4OTQzLWNlYmItNDY1OS1iNjZkLWZmZjY5NTg2NzA1ZCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTU5MTE3ODcsImp0aSI6ImIwNWIxNjhiLTFiNjQtNDRlNy1iN2QzLWZiNWIzZDE3N2Y5YiIsInN1YiI6IjRmZGYzOWYzMmYyODRiMjhhMjFhYWFkMWYzNGI2OTk0IiwiZW1haWwiOiJqaXllY2FmZUBnbWFpbC5jb20iLCJpZGVudGl0aWVzIjpbeyJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiIifV0sImN1c3RvbTpmaXJzdF9uYW1lIjoiam9jcyIsImN1c3RvbTpsYXN0X25hbWUiOiJtc28iLCJjdXN0b206Y291bnRyeSI6IjgzIiwibmJmIjoxNjk1OTExNzg3LCJleHAiOjE2OTU5MTUzODcsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHkuZ2V0ZmlkZGxlci5jb20vIiwiYXVkIjoiZmlkZGxlciJ9.9sLm19DExaTaraNtdJnTWUibua3toHENsTcDwxg6022rcHHshA0esnebks7WLWBAG7svYVyWkPWKDuHbB3syTA",
  "expires_in": 3539,
  "token_type": "Bearer",
  "user_info": {
    "id": "4fdf39f32f284b28a21aaad1f34b6994",
    "email": "user@gmail.com",
    "firstName": "first",
    "lastName": "last",
    "country": "83",
    "identities": [
      {
        "providerName": "Google"
      }
    ]
  }
}
```

Update `email`, `firstName`, and `lastName` under `user_info` to change your email and name. You can also change `country` and `providerName` under `identities`.

> [!TIP]
> You may need to sign out and sign in again after changing these values.

> [!CAUTION]
>
> - Changing the email in `token.json` makes Fiddler Everywhere treat it as a new user. The previous user's Saved Snapshots will be unavailable.
> - To access those snapshots again, change the email back to its original value.
> - Changing your name, country, or identity provider does not affect existing snapshots.

## Language support

Chinese translation is not enabled by default. To enable it, copy [server/translate.js](./server/translate.js) to `resources/app/out/translate.js`, or `Contents/Resources/app/out/translate.js` on macOS.

Press <kbd>Ctrl+T</kbd> to switch languages.

## Historical documentation

These links point to older instructions preserved in the repository's history:

- [v4.6.2 instructions](https://github.com/msojocs/fiddler-everywhere-enhance/blob/6cb1e9b30f5c0dddcd1f181247ad8aab553fa097/v4.6.2/readme.md)
- [Detailed instructions for earlier versions](https://github.com/msojocs/fiddler-everywhere-enhance/blob/6cb1e9b30f5c0dddcd1f181247ad8aab553fa097/old/DETAIL.MD)

## Sponsorship

Tencent EdgeOne sponsors this project's CDN acceleration and security protection. EdgeOne offers a free plan with no expiration, unlimited traffic and requests, coverage across mainland China, and no overage charges. Follow the link below to claim the plan.

[Asia's best CDN, edge, and security solution - Tencent EdgeOne](https://edgeone.ai/zh?from=github)

[![Tencent EdgeOne](https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png)](https://edgeone.ai/zh?from=github)

## Disclaimer

- This repository is only for technical learning and communication. If you download related files, please delete the related content within 24 hours after learning.
- If you think the software is useful, please buy the [official version](https://www.telerik.com/purchase/fiddler).
- Do not pay for this software through illegal channels such as tb/pdd.
- If you use this repository tutorial/file for profit, then: your mother is dead.
- Please do not use the content of this project for illegal purposes. When using it, the user is deemed to be responsible for any adverse consequences that may arise from their behavior.
- Any direct or indirect consequences and losses caused by the dissemination and use of the information provided by this tool are the responsibility of the user, and the author does not assume any responsibility for them.
