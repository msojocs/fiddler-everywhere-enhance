# Fiddler Everywhere Enhance

**简体中文** | [English](./README.en.md)

[耻辱柱](./shame.md)

## 下载地址

### 最新版本

| 平台 | 下载地址 |
|------|----------|
| Linux | https://api.getfiddler.com/linux/latest-linux |
| Windows | https://api.getfiddler.com/win/latest |
| macOS（Intel） | https://api.getfiddler.com/mac/latest-mac |
| macOS（Arm64） | https://api.getfiddler.com/mac-arm64/latest-mac |

### 历史版本

| 平台 | 下载地址 |
|------|----------|
| Linux | https://downloads.getfiddler.com/linux/fiddler-everywhere-[version].AppImage |
| Windows | https://downloads.getfiddler.com/win/Fiddler%20Everywhere%20[version].exe |
| macOS（Intel） | https://downloads.getfiddler.com/mac/Fiddler%20Everywhere%20[version].dmg |
| macOS（Arm64） | https://downloads.getfiddler.com/mac-arm64/Fiddler%20Everywhere%20[version].dmg |

> [!NOTE]
> 将上述链接中的 `[version]` 替换为需要下载的版本号。
> 例如，Windows 版 `5.19.0` 的下载地址为 https://downloads.getfiddler.com/win/Fiddler%20Everywhere%205.19.0.exe 。

> [!TIP]
> 可用版本列表见[版本历史](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history)。

## 工作原理与时序图

项目分为安装准备和应用运行两个阶段：

- **安装准备**：[fe-tool/main.go](./fe-tool/main.go) 在 Windows / Linux 上并行准备 Fiddler 安装包、仓库中的 `server` 资源和补丁文件，等待全部完成后调用 [patch.Apply](./fe-tool/patch/patch.go)。它解包 `app.asar`，将 `server/file` 放入 `resources/app/out/file`，备份原入口为 `main.original.js`，再将 `server/index.js` 与原入口拼接成新的 `main.js`，并替换原生库及存在的 `System.Linq.dll`。
- **启动增强**：[server/index.js](./server/index.js) 随 Electron 主进程执行，挂钩进程启动、窗口创建和页面加载，同时异步启动端口为 `5678` 的本地 HTTP 服务。原程序启动 `Fiddler.WebUi` 前，挂钩会将 `package.json` 的入口临时指向 `out/main.original.js`，并恢复磁盘上的前端接口地址；加载 `index.html` 前再将接口地址改到本地，页面加载完成后恢复磁盘文件。
- **原程序后端**：`Fiddler.WebUi` 是独立的 .NET 子进程，负责启动脚本完整性检查、提供本地业务 API 和实时通信，并在运行期间重复检查脚本。Electron 通过 `--port` 传入后端端口，等待它输出 `Server ready`，再请求 `/api/ControlPanel/Status` 确认就绪后加载主窗口。
- **后端公钥匹配补丁**：替换到 `WebServer/System.Linq.dll` 的库修改了 `Enumerable.Any(source, predicate)` 的行为，使特定公钥字节前缀直接命中。`FiddlerBackendSDK` 使用它检查响应签名公钥是否在预置白名单中；通过该检查后，后端仍使用响应中的公钥验证 ECDSA 签名。
- **本地响应**：HTTP 服务将请求映射到 [server/file](./server/file) 中的文件，优先读取追加 `.json` 后缀的路径，并为该分支的响应生成签名。用户、令牌、配额等数据来自这些预置文件。

下面展示安装准备完成后的主要运行时序。后端行为依据 Fiddler Everywhere **8.1.0** 的原始入口、`Fiddler.WebUi.dll` 与 `FiddlerBackendSDK.dll` 核对。本地 HTTP 服务与挂钩代码运行在同一个 Electron 主进程中；`System.Linq.dll` 则是后端进程内调用的库，图中分别列出以说明职责。原程序会等待 `Fiddler.WebUi` 就绪，但注入代码没有等待 `5678` 服务就绪后再加载窗口。

```mermaid
sequenceDiagram
    autonumber
    actor User as 用户
    participant Main as Electron 主进程
    participant Backend as Fiddler.WebUi 后端
    participant Linq as System.Linq.dll 补丁
    participant UI as 前端页面
    participant Server as 本地 HTTP 服务

    User->>Main: 启动应用
    Main->>Main: 执行注入代码<br/>注册启动及窗口挂钩
    par 异步初始化本地服务
        Main-)Server: 启动 HTTP 服务初始化
        Server->>Server: 生成 ECDSA P-256 密钥对
        Server->>Server: 监听 5678 端口
    and 执行原入口并加载窗口
        Main->>Main: 继续执行原入口代码
        Main->>Main: spawn 前将 package.json 的 main<br/>设为 out/main.original.js，并恢复前端脚本
        Main->>Backend: 原 spawn 启动子进程<br/>传入 --port 等参数
        Backend->>Backend: 校验 Electron 入口与前端主脚本
        Note over Main,Backend: 校验读取磁盘内容<br/>必须先恢复，再启动后端
        Backend->>Backend: 初始化本地业务服务<br/>启动完整性检查后台任务
        Backend-->>Main: stdout 输出 Server ready
        Main->>Backend: GET /api/ControlPanel/Status
        Backend-->>Main: HTTP 200<br/>fiddler-orchestra-generated 响应头为 *
        Main->>Main: loadURL(index.html) 前<br/>将前端接口地址改到本地
        Note over UI,Server: api / identity 接口改到本地 5678 端口
        Main->>UI: 从本地 index.html 加载页面<br/>执行改写后的前端脚本
        UI-->>Main: did-finish-load
        Main->>Main: 恢复磁盘上的前端接口地址
        Note over Main,UI: 内存中的脚本继续使用本地地址<br/>磁盘恢复供后续完整性检查使用
        Main->>UI: 注入响应签名公钥匹配相关逻辑
    end

    UI->>Backend: 调用本地业务 API<br/>建立 SignalR 实时连接
    Backend-->>UI: 返回业务结果，推送事件

    Note over UI,Server: 以下请求以本地服务已开始监听为前提
    UI->>Server: 请求接口，例如<br/>/api.getfiddler.com/users
    Server->>Server: 规范化 Host 和路径<br/>将 .be 映射为 .com
    Server->>Server: 查找 file 下的对应路径
    alt 存在追加 .json 后缀的文件
        Server->>Server: 读取 JSON 内容
        opt 请求带有 x-request-nonce
            Server->>Server: 设置同值的 x-response-nonce
        end
        Server->>Server: 序列化 JSON，加入时间戳<br/>并生成 ECDSA 签名
        Server-->>UI: JSON + Signature + 时间戳响应头
    else 仅存在原路径文件
        Server->>Server: 读取原文件内容
        Server-->>UI: 文件内容，例如授权跳转 HTML
    else 未找到文件
        Server-->>UI: not implement（默认 HTTP 200）
    end

    opt 后端收到带 Signature 的接口响应
        Backend->>Backend: SignedResponseHelper<br/>解析响应中的公钥与签名
        Backend->>Linq: Any(预置公钥列表, 与响应公钥比较)
        Linq->>Linq: 遍历列表，检查 byte[] 元素前缀
        alt 命中补丁指定的公钥前缀
            Linq-->>Backend: 直接返回 true，公钥白名单检查通过
        else 未命中特定前缀
            Linq-->>Backend: 按原 predicate 判断并返回结果
        end
        opt 公钥检查通过
            Backend->>Backend: 导入响应公钥<br/>执行 ECDSA / SHA-256 验签
        end
    end

    loop 运行期间每 15 分钟（8.1.0）
        Backend->>Backend: IntegrityCheckService<br/>重新校验磁盘上的两类脚本
        Note over Main,Backend: 校验失败会触发后端关闭<br/>主进程检测到后端退出后退出应用
    end

    User->>Main: 正常退出应用
    Main->>Backend: POST /api/ControlPanel/Shutdown
    Main->>Main: quit 时将 package.json 的 main<br/>恢复为 out/main.js
```

**启动前恢复用于通过启动检查。** `Fiddler.WebUi` 的启动代码会调用 `ScriptHelper.TryOpenElectronMainScript` 和 `TryOpenClientMainScript`，读取脚本并核对哈希。前者根据 `package.json` 的 `main` 定位 Electron 入口，因此挂钩将它指向保留原始内容的 `main.original.js`；后者检查前端主脚本，因此 `mainXHandle.reset()` 要先撤销其中的接口地址改写。这些操作发生在调用原 `spawn` 之前，让新启动的后端读到原始脚本。此时 Electron 已经执行了增强入口，修改磁盘上的 `package.json` 不会撤销当前进程中已安装的挂钩。

**加载后恢复用于通过周期检查。** 后端的 `IntegrityCheckService` 在 8.1.0 中每 15 分钟重新检查上述脚本，检查失败会请求关闭后端。因此只在 `loadURL(index.html)` 前临时改写前端脚本，让页面将改写后的内容加载到内存，然后在 `did-finish-load` 时恢复磁盘内容。恢复文件不会替换当前页面已经执行的 JavaScript，所以后续接口仍指向本地服务。仓库提交 [a21aa8b](https://github.com/msojocs/fiddler-everywhere-enhance/commit/a21aa8b2f30dd554df7069fa5c920812c8e836d4) 正是为修复“15 分钟间隔检测导致退出”加入这次恢复。这里恢复的是接口地址替换；其他手动修改的脚本内容不会自动还原。

**`System.Linq.dll` 补丁用于后端响应签名的公钥白名单匹配。** 自动工具通过 `DownloadCommon()` 下载 [v10.0.9-1 的补丁库](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1)，再由 `replaceSystemLinq()` 替换 `WebServer` 下已有的同名 DLL。该补丁在带 predicate 的 `Enumerable.Any` 中加入 `HasAnyByteArrayPrefix`：遍历到以 `30 59 30 13 06 07 2A 86 48 CE` 开头的 `byte[]` 时直接返回 `true`，其余元素仍按原 predicate 判断。

8.1.0 的 `SignedResponseHelper` 原本通过 `Any` 遍历预置公钥，并用 `SequenceEqual` 与响应公钥比较；补丁使该白名单检查在命中前缀时通过，随后仍调用 `ImportSubjectPublicKeyInfo` 和 `ECDsa.VerifyData` 验证响应。因此本地服务仍需生成与响应内容匹配的签名，前述脚本文件的哈希检查也仍需通过。前端对应的公钥匹配处理由 `server/index.js` 注入的 `Array.prototype.some` 挂钩完成。

接口地址有两种改写形式：完整 URL 改为 `http://127.0.0.1:5678/<原域名>/...`；分段拼接的域名改为 `http://api.getfiddler.be:5678` 或 `http://identity.getfiddler.be:5678`，因此需要按下文配置 hosts。服务根据 Host 补齐原域名目录，例如 `/api.getfiddler.com/users` 最终读取 `file/api.getfiddler.com/users.json`。未命中文件的请求返回 `not implement`，不会转发到远程接口。

窗口挂钩还会启用开发者工具（`F12` 切换）；若存在 `out/translate.js`，则将其设置为 preload 脚本以提供多语言支持。上图使用 GitHub 原生支持的 Mermaid `sequenceDiagram`，在 README 页面即可查看。

## 快速开始：为 v5.9.0 及后续版本打补丁或增强

这些步骤也可能适用于其他版本。

> [!IMPORTANT]
> Windows 版 Fiddler Everywhere 5.16.0 及更早版本使用 `libfiddler.dll`；从 5.17.0 开始，该文件更名为 `fiddler.dll`。

> [!TIP]
>
> - [本项目自动补丁工具](https://github.com/msojocs/fiddler-everywhere-enhance/releases)
> - [另一个适用于 Windows 和 Linux 的自动补丁项目](https://github.com/auto-yui-patch/fiddler-everywhere-patch-automated)

### 自动工具

1. 从 [Releases](https://github.com/msojocs/fiddler-everywhere-enhance/releases) 下载自动工具。
2. Windows 运行 `fe-tool.exe -version latest`；Linux 运行 `fe-tool -version latest`。
3. 工具执行完成后，处理后的应用位于 `FiddlerEverywhere` 目录。

### Windows

1. 删除 `libfiddler.dll`（5.17.0 及后续版本为 `fiddler.dll`）。
2. 从 [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases) 下载 `yui-fiddler-win32-x86_64-vx.x.x.dll`。
3. 5.16.0 及更早版本将其重命名为 `libfiddler.dll`；5.17.0 及后续版本重命名为 `fiddler.dll`。
4. 将重命名后的 DLL 放入 Fiddler Everywhere 的根目录。
5. 从 [v10.0.9-1 发布页](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1) 下载 `System.Linq.dll`。
6. 替换 `Fiddler/resources/app/out/WebServer/System.Linq.dll`。
7. 按[下文步骤](#解包-appasar)解包 `app.asar`。
8. 将 `resources/app/out/main.js` 复制为 `resources/app/out/main.original.js`。
9. 按[下文步骤](#修改-mainjs)修改 `main.js`。
10. 将仓库的 `server/file` 复制到 `Fiddler/resources/app/out/file`。
11. 以管理员权限打开 `C:\Windows\System32\drivers\etc\hosts`，在末尾添加：

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

### Linux

1. 删除 `libfiddler.so`。
2. 从 [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases) 下载 `yui-libfiddler-linux-x86_64-vx.x.x.so`。
3. 将其重命名为 `libfiddler.so`，放入 Fiddler Everywhere 的根目录。
4. 从 [v10.0.9-1 发布页](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1) 下载 `System.Linq.dll`。
5. 替换 `Fiddler/resources/app/out/WebServer/System.Linq.dll`。
6. 按[下文步骤](#解包-appasar)解包 `app.asar`。
7. 将 `resources/app/out/main.js` 复制为 `resources/app/out/main.original.js`。
8. 按[下文步骤](#修改-mainjs)修改 `main.js`。
9. 将仓库的 `server/file` 复制到 `Fiddler/resources/app/out/file`。
10. 以 root 权限打开 `/etc/hosts`，在末尾添加：

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

> [!NOTE]
> 你可能需要自行重新编译 `libfiddler.so`。

### macOS

以下应用内部路径均相对于 Fiddler Everywhere 的 `.app` 应用包；包内的 `Resources` 位于 `Contents/Resources`。

1. 删除 `Contents/Frameworks` 下的 `libfiddler.dylib`（5.17.0 及后续版本为 `fiddler.dylib`）。
2. 从 [Yui-patch Releases](https://github.com/project-yui/Yui-patch/releases) 下载对应架构的 `yui-fiddler-mac-[arch]-vx.x.x.dylib`。
3. 5.16.0 及更早版本将其重命名为 `libfiddler.dylib`；5.17.0 及后续版本重命名为 `fiddler.dylib`。
4. 将重命名后的文件放入 `Contents/Frameworks`。
5. 从 [v10.0.9-1 发布页](https://github.com/msojocs/dotnet-runtime-for-fildder/releases/tag/v10.0.9-1) 下载 `System.Linq.dll`。
6. 替换 `Contents/Resources/app/out/WebServer/System.Linq.dll`。
7. 按[下文步骤](#解包-appasar)解包 `app.asar`，将步骤中的 `resources` 对应为 `Contents/Resources`。
8. 将 `Contents/Resources/app/out/main.js` 复制为 `Contents/Resources/app/out/main.original.js`。
9. 按[下文步骤](#修改-mainjs)修改 `main.js`。
10. 将仓库的 `server/file` 复制到 `Contents/Resources/app/out/file`。
11. 以 root 权限打开 `/etc/hosts`，在末尾添加：

    ```text
    127.0.0.1 api.getfiddler.be
    127.0.0.1 identity.getfiddler.be
    ```

> [!NOTE]
> 你可能需要自行重新编译 `fiddler.dylib`（5.16.0 及更早版本为 `libfiddler.dylib`）。
>
> 你也可能需要执行 `sudo codesign -s "-" --deep --force --verbose "/Applications/Fiddler Everywhere.app"`，参见 [issue #96](https://github.com/msojocs/fiddler-everywhere-enhance/issues/96#issuecomment-2814035393)。

## 解包 `app.asar`

1. 打开 `resources/app.asar.unpacked` 目录，创建空文件 `NOTICES-reporter.txt`。
2. 在 `resources` 目录中使用 [asar](https://www.npmjs.com/package/asar) 执行 `asar e app.asar app`，将 `app.asar` 解包到 `app` 目录。
3. 删除 `app.asar` 文件。

## 修改 `main.js`

1. 使用文本编辑器打开 `resources/app/out/main.js`。
2. 将本仓库 [server/index.js](./server/index.js) 的全部内容插入 `main.js` 的最前面，保留后面的原始代码。

## 修改姓名和邮箱（可选）

如需修改默认姓名和邮箱，请编辑 `resources/app/out/file/identity.getfiddler.com/oauth/token.json`。文件内容示例：

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

修改 `user_info` 中的 `email`、`firstName` 和 `lastName` 即可更换邮箱和姓名，也可以修改 `country` 和 `identities` 中的 `providerName`。

> [!TIP]
> 修改后可能需要退出登录并重新登录。

> [!CAUTION]
>
> - 修改 `token.json` 中的邮箱后，Fiddler Everywhere 会将其视为新用户，原用户的“已保存快照”将不可用。
> - 如需重新访问原有快照，请将邮箱改回原值。
> - 修改姓名、国家或身份提供方不会影响已有快照。

## 多语言支持

默认不启用中文翻译。如需启用，请将 [server/translate.js](./server/translate.js) 复制到 `resources/app/out/translate.js`（macOS 为 `Contents/Resources/app/out/translate.js`）。

按 <kbd>Ctrl+T</kbd> 切换语言。

## 历史文档

以下链接指向仓库历史提交中保留的旧版说明：

- [v4.6.2 说明](https://github.com/msojocs/fiddler-everywhere-enhance/blob/6cb1e9b30f5c0dddcd1f181247ad8aab553fa097/v4.6.2/readme.md)
- [更早版本的详细说明](https://github.com/msojocs/fiddler-everywhere-enhance/blob/6cb1e9b30f5c0dddcd1f181247ad8aab553fa097/old/DETAIL.MD)

## 赞助

本项目 CDN 加速及安全防护由 Tencent EdgeOne 赞助。EdgeOne 提供长期有效的免费套餐，包含不限量的流量和请求，覆盖中国大陆节点，且无任何超额收费。感兴趣的朋友可以点击下面的链接领取。

[亚洲最佳 CDN、边缘和安全解决方案 - Tencent EdgeOne](https://edgeone.ai/zh?from=github)

[![Tencent EdgeOne](https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png)](https://edgeone.ai/zh?from=github)

## 免责声明

- 本仓库仅供技术学习交流使用，如有下载相关文件，请在学习后 24 小时内删除相关内容。
- 如果你觉得软件很好用，请购买[官方正版](https://www.telerik.com/purchase/fiddler)。
- 切勿在 tb/pdd 等商城的非法渠道付费此软件。
- 如将本仓库教程/文件用于获利，那么：你妈死了。
- 请勿将本项目内容用于非法用途，使用者在使用时即视为对行为可能产生的任何不良后果负责。
- 由于传播、利用此工具所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。
