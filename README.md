# Get Latest Version

api(dot)getfiddler(dot)com/linux/latest-linux

## get ilasm (ildasm)

1. dotnet new console -n test
2. cd test
3. dotnet add package Microsoft.NETCore.ILAsm (ILDAsm)
4. dotnet publish -c Release --self-contained --runtime linux-x64
5. export PATH=$(pwd)/bin/Release/netcoreapp3.1/linux-x64/publish:$PATH
6. ilasm (ildasm)

## main.xxxx.js

打开 `fiddler/resources/app/out/WebServer/ClientApp/dist/main.xxx.js` 搜索 `updateUserLicense` 

函数开始处添加：（请将 `Ie` 替换为参数名称）

```javascript
Ie.licenseInfo.currentLicense = "Pro"
Ie.licenseInfo.hasExpiredTrial = false
Ie.licenseInfo.isTrialAvailable = false
Ie.licenseInfo.hasValidLicense = true
```

## Fiddler.WebUi.il

> 修改此文件去除文件校验

对两个函数 `TryOpenClientMainScript` 与 `TryOpenElectronMainScript` 做相同操作

删除函数内以下代码之前的所有代码
```
IL_0208:  /* 17   |                  */ ldc.i4.1
IL_0209:  /* 2A   |                  */ ret
```

## FiddlerBackendSDK.il

### method FiddlerBackendSDK.User.UserClient::GetBestAccount

删除 IL_000d - IL_0020 对应 if 语句
删除 IL_003f - IL_0040 对应 `return null;` 语句

### method '<>c__DisplayClass18_0'::'<GetBestAccount>b__0'

删除 IL_0000 - IL_0019 , 在 IL_001e 前插入 `ldc.i4.1`  (即函数体直接返回 `true` )