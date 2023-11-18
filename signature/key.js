// const {
//   generateKeyPair,
// } = require('node:crypto');

// generateKeyPair('rsa', {
//   modulusLength: 4096,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem',
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem',
//     cipher: 'aes-256-cbc',
//     passphrase: 'top secret',
//   },
// }, (err, publicKey, privateKey) => {
//   // Handle errors and use the generated key pair.
//   if (err == null) {
//     // key生成成功
//     console.log('privateKey:', privateKey)
//     console.log('publicKey:', publicKey)
//   }
// });
{
  const { subtle } = require('crypto').webcrypto;
  (async function() {
    const key = await subtle.generateKey({
      name: 'ECDSA',
      hash: 'SHA-256',
      namedCurve: 'P-256',
      length: 256,
    }, true, ['sign', 'verify']);
    console.log(key)
    const pubKey = await subtle.exportKey('spki', key.publicKey)
    console.log('publicKey:', pubKey)
    const priKey = await subtle.exportKey('pkcs8', key.privateKey)
    console.log('privateKey:', priKey)

    // 加密
    const headers = {
      'Content-Type': 'application/json'
    }
    const body = {
      msg: 'hi'
    }
    const signData = Object.keys(headers).map(k => `${k}:${headers[k]}`).join('\n') + JSON.stringify(body)
    console.log('原始数据：', signData)
    const signPriKey = await subtle.importKey('pkcs8', priKey, { name: "ECDSA", namedCurve: "P-256" }, true, ['sign'])
    console.log('signPriKey ok')
    const signature = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, signPriKey, signData)
    console.log('signature ok')

    // 生成签名头数据
    const len = Buffer.from(new Uint8Array(4))
    len.writeInt32BE(pubKey.byteLength)
    console.log('len:', pubKey.byteLength, len)
    const signatureHeader = Buffer.concat([new Uint8Array(len), new Uint8Array(pubKey), new Uint8Array(signature)])
    
    {
      const keyLength = signatureHeader.slice(0, 4).readInt32BE()
      console.log('keyLength:', keyLength)
      const signPubKey = await subtle.importKey('spki', signatureHeader.slice(4, keyLength + 4), { name: "ECDSA", namedCurve: "P-256" }, true, ['verify'])
      console.log('signPubKey ok')
      const result = await subtle.verify({ name: "ECDSA", hash: "SHA-256" }, signPubKey, signatureHeader.slice(4 + keyLength), Buffer.from(signData, 'binary'))
      console.log('verify ok')
      console.log('verify result:', result)
    }
  })();
}