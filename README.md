## get ilasm (ildasm)

1. dotnet new console -n test
2. cd test
3. dotnet add package Microsoft.NETCore.ILAsm (ILDAsm)
4. dotnet publish -c Release --self-contained --runtime linux-x64
5. export PATH=$(pwd)/bin/Release/netcoreapp3.1/linux-x64/publish:$PATH
6. ilasm (ildasm)

## main.xxxx.js

打开 `ClientApp/dist/main.3f983221e4e1aade.js` 搜索 `updateUserLicense` 查看修改详情

## Fiddler.WebUi.il

> 修改 `main.js` 前需要先修改此处 （有文件校验）

```c#
// il line: 135843
string mainBytes = ElectronMainConstants.mainBytes;
if (mainBytes == null || !mainBytes.Equals(result, StringComparison.OrdinalIgnoreCase))
{
    // 报错点
    error = string.Format(errorTemplatePrefix, "calculating") + errorTemplateSuffix + " Support";
    // il line: 135843
    return false;
}
```

## FiddlerBackendSDK.il

### method FiddlerBackendSDK.User.UserClient::GetBestAccount

删除 IL_000d - IL_0020 对应 if 语句
删除 IL_003f - IL_0040 对应 `return null;` 语句

### method '<>c__DisplayClass18_0'::'<GetBestAccount>b__0'

删除 IL_0000 - IL_0019 , 在 IL_001e 前插入 `ldc.i4.1`  (即函数体直接返回 `true` )