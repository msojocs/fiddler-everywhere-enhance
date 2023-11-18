## 签名生成

1. 将请求头和请求体按如下规则拼接：

    ```
    header1:value1
    header2:value2
    ...
    body
    ```
2. 送去签名得到signature
3. 请求头中 signature 的格式：`SignedHeaders={header1;header2...}, Signature={keyLength}{signKey}{signature}`