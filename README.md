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

# for v5.9.0 v5.10.0 and later (Maybe for all)

## windows

1. delete libfiddler.dll, rename `resources\app\out\WebServer\hostpolicy.dll` to `resources\app\out\WebServer\hostpolicy.original.dll`
2. go to https://github.com/project-yukihana/Yukihana-patch/releases
3. download `libfiddler` and `hostpolicy.dll`
4. move `libfiddler.dll` to the root path of fiddler
5. move `hostpolicy.dll` to `resources\app\out\WebServer`
6. create file `resources\app\out\WebServer\patch.json`
    
    the content of `patch.json`:
    ```
    {
        "ClientApp\\dist\\main.5f4387a481528ff0.js": {
            "target": "ClientApp\\dist\\main.5f4387a481528ff0.original.js",
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
7. copy `ClientApp\\dist\\main.5f4387a481528ff0.js` to `ClientApp\\dist\\main.5f4387a481528ff0.original.js`
8. copy `resources\app\out\main.js` to `resources\app\out\main.original.js`
9. modify file `main.5f4387a481528ff0.js` and file `main.js` as usual.
10. copy `server/file` -> `Fiddler/resources/app/out/file`

## Linux

1. delete `libfiddler.so`.
2. go to https://github.com/project-yukihana/Yukihana-patch/releases
3. download `libfiddler.so` and `libopen.so`
4. move `libfiddler.so` to the root path of fiddler.
5. move `libopen.so` to `resources/app/out/WebServer`
6. rename `resources/app/out/WebServer/Fiddler.WebUi` to `resources/app/out/WebServer/Fiddler.WebUi1`
7. create file `resources/app/out/WebServer/Fiddler.WebUi`
    
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
        "ClientApp/dist/main-XSH4ELY7.js": {
            "target": "ClientApp/dist/main-XSH4ELY7.original.js",
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
10. copy `ClientApp/dist/main-XSH4ELY7.js` to `ClientApp/dist/main-XSH4ELY7.original.js`
11. copy `resources/app/out/main.js` to `resources/app/out/main.original.js`
12. modify file `main-XSH4ELY7.js` and file `main.js` as usual.
13. copy `server/file` -> `Fiddler/resources/app/out/file`

> You may need to recompile `libfiddler` and `libopen` by yourself.

## Mac 

1. delete `libfiddler.dylib`. (`Contents/Frameworks`)
2. go to https://github.com/project-yukihana/Yukihana-patch/releases
3. download `libfiddler.dylib` and `libopen.dylib`
4. move `libfiddler.dylib` to `Contents/Frameworks`.
5. move `libopen.dylib` to `Resources/app/out/WebServer`
6. rename `Resources/app/out/WebServer/Fiddler.WebUi` to `Resources/app/out/WebServer/Fiddler.WebUi1`
7. create file `Resources/app/out/WebServer/Fiddler.WebUi`
    
    the content of `Fiddler.WebUi`:
    ```shell
    #!/bin/bash
    # export DYLD_PRINT_LIBRARIES=1
    # export X=1
    export DYLD_INSERT_LIBRARIES=./libopen.dylib
    ./Fiddler.WebUi1 $@
    ```
8. open directory `Resources/app/out/WebServer` and execute `chmod +x Fiddler.WebUi`
9. create file `Resources/app/out/WebServer/patch.json`
    
    the content of `patch.json`:
    ```json
    {
        "ClientApp/dist/main-XSH4ELY7.js": {
            "target": "ClientApp/dist/main-XSH4ELY7.original.js",
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
10. copy `ClientApp/dist/main-XSH4ELY7.js` to `ClientApp/dist/main-XSH4ELY7.original.js`
11. copy `Resources/app/out/main.js` to `Resources/app/out/main.original.js`
12. modify file `main-XSH4ELY7.js` and file `main.js` as usual.
13. copy `server/file` -> `Contents/Resources/app/out/file`

> You may need to recompile `libfiddler` and `libopen` by yourself.

# for xxx.js

## 修改 main.js

1. 打开 `resources/app/out/main.js`
2. `server/index.js` 的内容添加到 `resources/app/out/main.js` 开头

## 修改 main.xxx.js

1. 打开 `resources/app/out/WebServer/ClientApp/dist/main.xxx.js`
2. 替换所有 `https://api.getfiddler.com` 为 `http://127.0.0.1:5678/api.getfiddler.com`
3. 替换所有 `https://identity.getfiddler.com` 为 `http://127.0.0.1:5678/identity.getfiddler.com`

# Some Detail

[Let me see old](./v4.6.2/readme.md)

[Let me see old old](./old/DETAIL.MD)

## 免责声明
	
本仓库仅供技术学习交流使用，如有下载相关文件，请在学习后24小时内删除相关内容。

如果你觉得软件很好用，请购买官方正版：https://www.telerik.com/purchase/fiddler

切勿在 tb/pdd 等商城的非法渠道付费此软件。

如将本仓库教程/文件用于获利，那么：你妈死了。

请勿将本项目内容用于非法用途，使用者在使用时即视为对行为可能产生的任何不良后果负责。
	
由于传播、利用此工具所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。
