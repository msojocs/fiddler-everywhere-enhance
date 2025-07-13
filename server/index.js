
const port = 5678;
(() => {
  console.info('========== Fiddler-everywhere-enhance start ==========')
  const { app, BrowserWindow } = require('electron')
  const path = require('path')
  const fs = require('fs')
  const sp = require('child_process')
  const originalSpwan = sp.spawn
  sp.spawn = function(...args) {
    console.info('Call spwan:', args[0])
    if (args[0].includes('Fiddler.WebUi'))
    {
      // 启动后端服务前指向原始的main.js文件
      const pkg = path.resolve(__dirname, '../package.json')
      console.info('Modify package.json', pkg)
      const data = JSON.parse(fs.readFileSync(pkg).toString())
      data.main = "out/main.original.js"
      fs.writeFileSync(pkg, JSON.stringify(data, null, 4))
      // 还原mian-xxx.js文件
      console.info('Recover main-XXXXXXX.js (Or main.XXXXXXXXXXXXX.js in old versions)')
      const index = fs.readFileSync(path.resolve(__dirname, './WebServer/ClientApp/dist/index.html')).toString()
      const match = index.match(/main.*?\.js/)
      console.info('Match result:', match)
      const mainXJsPath = path.resolve(__dirname, `./WebServer/ClientApp/dist/${match}`)
      let mainXJs = fs.readFileSync(mainXJsPath).toString()
      const exp = new RegExp(`http://127\\.0\\.0\\.1:\\d+/`, 'g')
      mainXJs = mainXJs.replace(exp, 'https://')
      fs.writeFileSync(mainXJsPath, mainXJs)
    }
    /**@type {dV.ChildProcessWithoutNullStreams} */
    const result = originalSpwan.apply(this, args)
    return result
  }

  app.on('quit', () => {
    console.info('Call quit.')
    const pkg = path.resolve(__dirname, '../package.json')
    const data = JSON.parse(fs.readFileSync(pkg).toString())
    data.main = "out/main.js"
    fs.writeFileSync(pkg, JSON.stringify(data, null, 4))
  })

  const originalBrowserWindow = BrowserWindow;

  const hookBrowserWindow = (OriginalBrowserWindow) => {
    function HookedBrowserWindow(options) {
      // 修改或增加构造函数的选项
      try {
        if (options) {
          options.frame = false
          if (options.webPreferences) {
            options.webPreferences.devTools = true
            const p = path.resolve(__dirname, './translate.js')
            if (fs.existsSync(p)) {
              // 如果存在translate.js文件，则使用它
              options.webPreferences.preload = p
            }
          }
        }
        console.info('HookedBrowserWindow:', options)
      }catch(e) {

      }
      // 使用修改后的选项调用原始构造函数
      return new OriginalBrowserWindow(options);
    }

    // 复制原始构造函数的原型链并进行替换
    HookedBrowserWindow.prototype = Object.create(OriginalBrowserWindow.prototype);
    HookedBrowserWindow.prototype.constructor = HookedBrowserWindow;
    Object.setPrototypeOf(HookedBrowserWindow, OriginalBrowserWindow);

    return HookedBrowserWindow;
  };

  // 使用替换的构造函数
  const HookedBrowserWindow = hookBrowserWindow(originalBrowserWindow);

  const ModuleLoadHook = {
    electron: (module) => {
      return {
        ...module,
        BrowserWindow: HookedBrowserWindow
      }
    },
  }
  const { Module } = require("module");
  const original_load = Module._load;
  // console.log('Module:', Module)
  Module._load = (...args) => {
    const loaded_module = original_load(...args);
    // console.log('load', args[0])
    if (ModuleLoadHook[args[0]]) {
      return ModuleLoadHook[args[0]](loaded_module)
    }
    else {
      return loaded_module;
    }
  }
  
  // hook loadURL
  const originloadURL = BrowserWindow.prototype.loadURL;
  BrowserWindow.prototype.loadURL = function(...args){
    this.setMinimumSize(300, 300);
    // 设置UA，有些番剧播放链接Windows会403
    this.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) bilibili_pc/1.9.1 Chrome/98.0.4758.141 Electron/17.4.11 Safari/537.36')
    console.info('Call loadURL', args)
    // DevTools切换
    this.webContents.on("before-input-event", (event, input) => {
      if (input.key === "F12" && input.type === "keyUp") {
        this.webContents.toggleDevTools();
      }
    });
    if (args[0].includes('index.html'))
    {
      // 修改mian-xxx.js文件
      console.info('Modify main-XXXXXXX.js (Or main.XXXXXXXXXXXXX.js in old versions)')
      const index = fs.readFileSync(path.resolve(__dirname, './WebServer/ClientApp/dist/index.html')).toString()
      const match = index.match(/main.*?\.js/)
      const mainXJsPath = path.resolve(__dirname, `./WebServer/ClientApp/dist/${match}`)
      let mainXJs = fs.readFileSync(mainXJsPath).toString()
      mainXJs = mainXJs.replace(/https:\/\/api\.getfiddler\.com/g, `http://127.0.0.1:${port}/api.getfiddler.com`)
      mainXJs = mainXJs.replace(/https:\/\/identity\.getfiddler\.com/g, `http://127.0.0.1:${port}/identity.getfiddler.com`)
      fs.writeFileSync(mainXJsPath, mainXJs)
    }
    return originloadURL.apply(this, args)
  };
})();
// Server
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
    const url = new URL(fullPath, `http://127.0.0.1:${port}`)
    console.log(req.method, req.headers.host, url.pathname)
    if (req.headers.host.includes('getfiddler.com')) {
      url.pathname = `/${req.headers.host}${url.pathname}`
    }
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
  }).listen(port)
})();