(async () => {
  const http = require('http')
  const path = require('path')
  const fs = require('fs')
  const { subtle } = require('crypto').webcrypto;

  // 准备密钥
  const key = await subtle.generateKey({
    name: 'ECDSA',
    hash: 'SHA-256',
    namedCurve: 'P-256',
    length: 256,
  }, true, ['sign', 'verify']);
  const pubKey = await subtle.exportKey('spki', key.publicKey)
  const priKey = await subtle.exportKey('pkcs8', key.privateKey)

  http.createServer(async (req, res) => {
    const fullPath = req.url
    const url = new URL(fullPath, 'http://127.0.0.1:5678')
    console.log(req.method, url.pathname)
    // let body = '';
    // req.on('data', chunk => {
    //   body += chunk.toString();
    // });
    // req.on('end', () => {
    //   console.log(`Received data: ${body}`);
    // });
    
    let data = ''
    if (url != null) {
      try {
        const loc = path.resolve(__dirname, `./file/${url.pathname}`)
        if (fs.existsSync(loc + '.json'))
        {
          // 在后面加上.json后缀，存在就用这个
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          data = fs.readFileSync(loc + '.json').toString()
          const headers = {
            'content-type': 'application/json; charset=utf-8'
          }
          const body = data
          const signData = Object.keys(headers).map(k => `${k}:${headers[k]}`).join('\n') + body
          // console.log('原始数据：', signData)
          const signPriKey = await subtle.importKey('pkcs8', priKey, { name: "ECDSA", namedCurve: "P-256" }, true, ['sign'])
          // console.log('signPriKey ok')
          const bodyBuf = Buffer.from(signData, 'binary')
          // console.log('signData length:', bodyBuf.length)
          const signature = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, signPriKey, bodyBuf)
          // console.log('signature ok')
      
          // 生成签名头数据
          const len = Buffer.from(new Uint8Array(4))
          len.writeInt32BE(pubKey.byteLength)
          // console.log('len:', pubKey.byteLength, len)
          const signatureHeader = Buffer.concat([new Uint8Array(len), new Uint8Array(pubKey), new Uint8Array(signature)])
          // console.log('signatureHeader length:', signatureHeader.length)
          res.setHeader('Signature', `SignedHeaders=content-type, Signature=${signatureHeader.toString('base64')}`)
          
        }
        else if (fs.existsSync(loc)) { // 直接使用原始路径
          data = fs.readFileSync(loc).toString()
        }
        else {
          data = 'not implement'
          console.log(`error: ${fullPath}`)
        }

      }catch(e) {
        console.error(e)
      }
    }
    
    res.end(data)
  }).listen(5678)
})();