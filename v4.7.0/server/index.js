(() => {
  const http = require('http')
  const path = require('path')
  const fs = require('fs')
  http.createServer((req, res) => {
    res.setHeader('Signature', 'SignedHeaders=content-type, Signature=AAAAWzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNsAzGwa7Q3iTZFqv3xYHemw/qxkwk0sIC/usJVi7713VJv0B1JbfuiDXxHfScNyyQjkuaHKtwbn5qUeHjFwpGbEwT7g2t3hdiBTpJ+406wmIST7bK+eY/HU283penaNN9dDWv/ndsvDHCEcckxvSb7XwFBcdy0/Nq3RC9FKAPug')
    
    const fullPath = req.url
    const url = new URL(fullPath, 'http://127.0.0.1:5678')
    console.log(url.pathname)
    let data = ''
    if (url != null) {
      try {
        const loc = path.resolve(__dirname, `./file/${url.pathname}`)
        if (fs.existsSync(loc + '.json')) { // 在后面加上.json后缀，存在就用这个
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          data = fs.readFileSync(loc + '.json').toString()
        }
        else if (fs.existsSync(loc)) { // 直接使用原始路径
          data = fs.readFileSync(loc).toString()
        }
        else {
          data = 'not implement'
        }
      }catch(e) {
        console.error(e)
      }
    }
    
    res.end(data)
  }).listen(5678)
})();