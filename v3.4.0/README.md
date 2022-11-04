# Crack

> **重要：替换文件前，先打开 `Fiddler Everywhere` 选择试用，然后关闭再 Crack !!!**

1、替换两个 `dll` 文件

> /Applications/Fiddler\ Everywhere.app/Contents/Resources/app/out/WebServer

- FiddlerBackendSDK.dll
- Fiddler.WebUi.dll

2、将 `main.8a2e352fe4ea9310.js` 复制到下面路径，复制原始 `main.xxxx.js` 的文件名再删除，然后把 `main.8a2e352fe4ea9310.js` 改名为原始的 `main.xxxx.js`

> /Applications/Fiddler\ Everywhere.app/Contents/Resources/app/out/WebServer/ClientApp/dist

- main.8a2e352fe4ea9310.js

3、将 `main.js` 复制到下面路径，替换原文件

> /Applications/Fiddler\ Everywhere.app/Contents/Resources/app/out

- main.js

4、重启即可。

注意：[具体操作详见](https://github.com/msojocs/fiddler-everywhere-crack/issues/8#issuecomment-1303012900)