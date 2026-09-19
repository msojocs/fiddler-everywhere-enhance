const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const processPath = process.argv[2]
console.log('Process path:', processPath)

if (!processPath || typeof processPath !== 'string') {
    console.error('Invalid process path')
    process.exit(1)
}

const resolvedBase = path.resolve(processPath)
const binaryPath = path.resolve(resolvedBase, './MacOS/Fiddler Everywhere')

if (!binaryPath.startsWith(resolvedBase + path.sep) || !fs.existsSync(binaryPath)) {
    console.error('Invalid or non-existent binary path')
    process.exit(1)
}

const run = spawn(binaryPath, ['--disable-gpu'], {
    env: process.env,
    cwd: resolvedBase
})

run.stdout.on('data', (data) => {
    const log = data.toString()
    process.stdout.write(log)
    if (log.includes(' 1 attempts left.'))
    {
        console.info('error')
        process.exit(3)
    }
    else if (log.includes('Displaying splash screen'))
    {
        console.info('success')
        process.exit(0)
    }
})
// run.on('exit', (code) => {
//     console.info('exit:', code)
//     process.exit(code)
// })