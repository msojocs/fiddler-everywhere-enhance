const { spawn } = require('child_process')
const path = require('path')

const processPath = process.argv[2]
console.log('Process path:', processPath)

const run = spawn(path.resolve(processPath, './MacOS/Fiddler Everywhere'), ['--disable-gpu'], {
    env: process.env,
    cwd: processPath
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