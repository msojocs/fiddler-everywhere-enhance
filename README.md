# 耻辱柱（Hall Of Shame）

[Hall Of Shame](./shame.md)

# Get Latest Version

## Linux

api(dot)getfiddler(dot)com/linux/latest-linux

## Windows

api(dot)getfiddler(dot)com/win/latest

## Mac

### Intel

api(dot)getfiddler(dot)com/mac/latest-mac

### Arm64

api(dot)getfiddler(dot)com/mac-arm64/latest-mac


# How to Download Old Versiond of Fiddler Everywhere for *Windows*

https://downloads.getfiddler.com/win/Fiddler%20Everywhere%20`(version)`.exe

In the above link replace `(version)` with the versioon you want to download

Ex: https://downloads.getfiddler.com/win/Fiddler%20Everywhere%205.17.0.exe to download `5.17.0`

You can find a list of available versions here: [Version History](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history)


# Get Started - Patch / Enhance For v5.9.0 v5.10.0 and later (Maybe for all)
  > Note: For 5.17.0, `libfiddler.dll` is now renamed to `fiddler.dll`.

## Windows

### Special: Now you can Patch Fiddler Everywhere Automatically Too! - [Patch Automatically](https://github.com/sipsuru/fiddler-everywhere-patch-automated)

### Patcch Manually: 

1. Delete libfiddler.dll, (or fiddler.dll in 5.17.0+) & Rename `resources\app\out\WebServer\hostpolicy.dll` to `resources\app\out\WebServer\hostpolicy.original.dll`
2. Go to https://github.com/project-yukihana/Yukihana-patch/releases
3. Download `libfiddler` (or fiddler.dll in 5.17.0+) and `hostpolicy.dll`
4. Move `libfiddler.dll` to the root path of fiddler
5. Move `hostpolicy.dll` to `resources\app\out\WebServer`
6. Create file `resources\app\out\WebServer\patch.json`
    
    the content of `patch.json`:
    ```json
    {
        "ClientApp\\dist\\main.XXXXXXXXXX.js": {
            "target": "ClientApp\\dist\\main.XXXXXXXXXX.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        },
        "..\\main.js": {
            "target": "..\\main.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        }
    }
    ```

    > Note: XXXXXXXXXX is a random letters combination that differs from version to version.

    
7. Copy `ClientApp\\dist\\main.XXXXXXXXXX.js` to `ClientApp\\dist\\main.XXXXXXXXXX.original.js`
8. Copy `resources\app\out\main.js` to `resources\app\out\main.original.js`
9. Modify file `main.XXXXXXXXXX.js` and file `main.js` as instructed bellow.
10. Copy `server/file` -> `Fiddler/resources/app/out/file`

> For windows, for more detailed info for noobs: [Windows Patch for Noobs](https://github.com/sipsuru/fiddler-everywhere-patch-manual)

## Linux

1. Delete `libfiddler.so`.
2. Go to https://github.com/project-yukihana/Yukihana-patch/releases
3. Download `libfiddler.so` and `libopen.so`
4. Move `libfiddler.so` to the root path of fiddler.
5. Nove `libopen.so` to `resources/app/out/WebServer`
6. Rename `resources/app/out/WebServer/Fiddler.WebUi` to `resources/app/out/WebServer/Fiddler.WebUi1`
7. Create file `resources/app/out/WebServer/Fiddler.WebUi`
    
    the content of `Fiddler.WebUi`:
    ```shell
    #!/bin/bash
    export LD_PRELOAD=./libopen.so
    ./Fiddler.WebUi1 $@
    ```
8. open directory `resources/app/out/WebServer` and execute `chmod +x Fiddler.WebUi`
9. create file `resources/app/out/WebServer/patch.json`
    
    the content of `patch.json`:
    ```json
    {
        "ClientApp/dist/main-XXXXXXXXXX.js": {
            "target": "ClientApp/dist/main-XXXXXXXXXX.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        },
        "../main.js": {
            "target": "../main.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        }
    }
    ```
    > Note: XXXXXXXXXX is a random letters combination that differs from version to version.

    
10. Copy `ClientApp/dist/main-XXXXXXXXXX.js` to `ClientApp/dist/main-XXXXXXXXXX.original.js`
11. Copy `resources/app/out/main.js` to `resources/app/out/main.original.js`
12. Modify file `main-XXXXXXXXXX.js` and file `main.js` as instructed bellow.
13. Copy `server/file` -> `Fiddler/resources/app/out/file`

> You may need to recompile `libfiddler`(or fiddler.dll in 5.17.0+) and `libopen` by yourself.

## Mac 

1. Delete `libfiddler.dylib`. (or fiddler.dll in 5.17.0+) which's in (`Contents/Frameworks`)
2. Go to https://github.com/project-yukihana/Yukihana-patch/releases
3. Download `libfiddler.dylib` (or fiddler.dll in 5.17.0+) and `libopen.dylib` 
4. Move `libfiddler.dylib` to `Contents/Frameworks`.
5. Move `libopen.dylib` to `Resources/app/out/WebServer`
6. Rename `Resources/app/out/WebServer/Fiddler.WebUi` to `Resources/app/out/WebServer/Fiddler.WebUi1`
7. Create file `Resources/app/out/WebServer/Fiddler.WebUi`
    
    the content of `Fiddler.WebUi`:
    ```shell
    #!/bin/bash
    # export DYLD_PRINT_LIBRARIES=1
    # export X=1
    export DYLD_INSERT_LIBRARIES=./libopen.dylib
    ./Fiddler.WebUi1 $@
    ```
8. Open directory `Resources/app/out/WebServer` and execute `chmod +x Fiddler.WebUi`
9. Create file `Resources/app/out/WebServer/patch.json`
    
    the content of `patch.json`:
    ```json
    {
        "ClientApp/dist/main-XXXXXXXXXX.js": {
            "target": "ClientApp/dist/main-XXXXXXXXXX.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        },
        "../main.js": {
            "target": "../main.original.js",
            "content": "",
            "cur": 0,
            "start": 0,
            "end": 1
        }
    }
    ```
10. Copy `ClientApp/dist/main-XXXXXXXXX.js` to `ClientApp/dist/main-XSH4ELY7.original.js`
11. Copy `Resources/app/out/main.js` to `Resources/app/out/main.original.js`
12. Modify file `main-XXXXXXXXXX.js` and file `main.js` as instructed bellow.
13. Copy `server/file` -> `Contents/Resources/app/out/file`

> You may need to recompile `libfiddler` (or fiddler.dll in 5.17.0+) and `libopen` by yourself.

# How to Modity main.XXXXXXXXXX.js & main.js

## For main.js

1. Open `resources/app/out/main.js` in a text editor
2. Open & copy content of `server/index.js` & append to `resources/app/out/main.js` at the begining.

## For main.XXXXXXXXXX.js

1. Open `resources/app/out/WebServer/ClientApp/dist/main.XXXXXXXXXX.js` in a text editor
2. Find & Replace all - `https://api.getfiddler.com` with `http://127.0.0.1:5678/api.getfiddler.com`
3. Find & Replace all - `https://identity.getfiddler.com` with `http://127.0.0.1:5678/identity.getfiddler.com`

# Some Extra Details

[Let me see old](./v4.6.2/readme.md)

[Let me see old old](./old/DETAIL.MD)

## 免责声明
	
* 本仓库仅供技术学习交流使用，如有下载相关文件，请在学习后24小时内删除相关内容。
* 如果你觉得软件很好用，请购买官方正版：https://www.telerik.com/purchase/fiddler
* 切勿在 tb/pdd 等商城的非法渠道付费此软件。
* 如将本仓库教程/文件用于获利，那么：你妈死了。
* 请勿将本项目内容用于非法用途，使用者在使用时即视为对行为可能产生的任何不良后果负责。
* 由于传播、利用此工具所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。

## Disclaimer

* This repository is only for technical learning and communication. If you download related files, please delete the related content within 24 hours after learning.
* If you think the software is useful, please buy the official version: https://www.telerik.com/purchase/fiddler
* Do not pay for this software through illegal channels such as tb/pdd.
* If you use this repository tutorial/file for profit, then: your mother is dead.
* Please do not use the content of this project for illegal purposes. When using it, the user is deemed to be responsible for any adverse consequences that may arise from the behavior.
* Any direct or indirect consequences and losses caused by the dissemination and use of the information provided by this tool are the responsibility of the user himself, and the author does not assume any responsibility for this.
