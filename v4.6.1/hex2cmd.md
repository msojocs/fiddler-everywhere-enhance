## op code

/* 17   |                  */ ldc.i4.1
/* 18   |                  */ ldc.i4.2
/* 2A   |                  */ ret

## Fiddler.WebUi

D:\GitHub\fiddler-everywhere-crack\v4.6.1\Fiddler.WebUi\Fiddler.WebUi.dll

step1: 0x00105FAC 2B 05 -> 2A 00  CheckStub直接return (这里检查Fiddler.WebUi.dll自身是否被修改)

step2: 0x0006D0B2 16 -> 18 main.js检查跳过
```javascript
// 检查main.js的MD5
const isOk = calMd5('main.js')
// 把isOk当成0或1
const t = isOk == 0 // isOk的取值只能是0或1，要让t总是false，就把右边的0换成2
if (t)
{
  // error
  exit()
}
// ok
``` 