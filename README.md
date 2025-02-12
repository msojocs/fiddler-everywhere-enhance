# [耻辱柱（Hall of Shame)](./shame.md)

---

# Get Latest Version of Fiddler Everywhere

  - ### Linux - https://api.getfiddler.com/linux/latest-linux

  - ### Windows - https://api.getfiddler.com/win/latest

  - ### Mac
    - ### Intel - https://api.getfiddler.com/mac/latest-mac
    - ### Arm64 - https://api.getfiddler.com/mac-arm64/latest-mac

# Get Old Versions of Fiddler Everywhere
  
  - ### Linux - https://downloads.getfiddler.com/linux/fiddler-everywhere-[version].AppImage

  - ### Windows - https://downloads.getfiddler.com/win/Fiddler%20Everywhere%20[version].exe
  
  - ### Mac
     - ### Intel - <br>https://downloads.getfiddler.com/mac/Fiddler%20Everywhere%20[version].dmg
     - ### Arm64 - <br>https://downloads.getfiddler.com/mac-arm64/Fiddler%20Everywhere%20[version].dmg

  > [!NOTE]
  > In the above links replace `[version]` with the version you want to download <br>
  > Ex: https://downloads.getfiddler.com/win/Fiddler%20Everywhere%205.19.0.exe to download `5.19.0` for Windows.
  
  > [!TIP] 
  > You can find a list of available versions here: [Version History](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history)

---

# Get Started - Patch / Enhance For v5.9.0 and later (Maybe for all)
  > [!IMPORTANT]
  > **For Windows**:
  >  - If you're using Fiddler Everywhere 5.16.0 or earlier, look for `libfiddler.dll` instead of `fiddler.dll`.
  >  - In version 5.17.0 and later, it was renamed to `fiddler.dll`.

--- 

## Windows

> [!TIP]
>  ## Now you can Patch Fiddler Everywhere Automatically Too! - [Patch Automatically](https://github.com/sipsuru/fiddler-everywhere-patch-automated)

### Patch Manually: 

1. Delete libfiddler.dll, (or fiddler.dll in 5.17.0+).
2. Go to https://github.com/project-yui/Yui-patch/releases
3. Download `yui-fiddler-win32-x86_64-vx.x.x.dll`
4. - If you patch Fiddler Everywhere 5.16.0 or earlier, rename `yui-fiddler-win32-x86_64-vx.x.x.dll` to `libfiddler.dll`
   - If you patch Fiddler Everywhere 5.17.0 or later, rename `yui-fiddler-win32-x86_64-vx.x.x.dll` to `fiddler.dll`
5. Move `fiddler.dll` (or `libfiddler.dll` in `5.16.0` and erlier) to the *root folder* of Fiddler Everywhere
6. Copy `resources\app\out\main.js` to `resources\app\out\main.original.js`
7. Modify file `main.js` as instructed below.
8. Copy `server/file` -> `Fiddler/resources/app/out/file`

  ---

## Linux

1. Delete `libfiddler.so`.
2. Go to https://github.com/project-yui/Yui-patch/releases
3. Download `yui-libfiddler-linux-x86_64-vx.x.x.so` & rename it to `libfiddler.so`
4. Move `libfiddler.so` to the root path of fiddler.
5. Copy `resources/app/out/main.js` to `resources/app/out/main.original.js`
6. Modify file `main.js` as instructed below.
7. Copy `server/file` -> `Fiddler/resources/app/out/file`

> [!NOTE]
> You may need to recompile `libfiddler.so` by yourself.

  ---

## Mac 

1. Delete `libfiddler.dylib`. (or fiddler.dylib in 5.17.0+) which's in `Contents/Frameworks`
2. Go to https://github.com/project-yui/Yui-patch/releases
3. 3. Download `yui-fiddler-mac-[arch]-vx.x.x.dylib`
4. - If you patch Fiddler Everywhere 5.16.0 or earlier, rename `yui-fiddler-mac-[arch]-vx.x.x.dylib` to `libfiddler.dylib`
   - If you patch Fiddler Everywhere 5.17.0 or later, rename `yui-fiddler-mac-[arch]-vx.x.x.dylib` to `fiddler.dylib`
5. Move `fiddler.dylib` (or `libfiddler.dylib` in `5.16.0` and erlier) to `Contents/Frameworks`
6. Copy `Resources/app/out/main.js` to `Resources/app/out/main.original.js`
7. Modify file `main.js` as instructed below.
8. Copy `server/file` -> `Contents/Resources/app/out/file`

> [!NOTE]
> You may need to recompile `fiddler.dylib` (or `libfiddler.dylib` in `5.16.0` and erlier) by yourself.

  ---

# How to Modify `main.js`

1. Open `resources/app/out/main.js` in a text editor
2. Open & copy content of `server/index.js` & append to `resources/app/out/main.js` at the begining.

  ---

# Change **First Name**, **Last Name** & **Email** (Additional)
If you want to change default `first & last names` and `email`, you can edit, `resources/app/out/file/identity.getfiddler.com/oauth/token.json`. 
  - Content of `token.json`
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
  - And in the json, you can edit `email: user@gmail.com`, `firstName: first` & `lastName: last` by replacing json values.

> [!TIP]
> You may need to sign out and sign again after changing these values.

---

# Some Extra Information

[Let me see old](./v4.6.2/readme.md)

[Let me see old old](./old/DETAIL.MD)

---

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
