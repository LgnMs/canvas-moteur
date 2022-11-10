// import { createServer } from 'vite'

const { createServer } = require('vite')

async function startDevScriptServer() {
    const arg = process.argv;
    const devPath = arg[2];
    const port = arg[3];

    const options = {
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: devPath + '/vite.config.js',
    }

    if (port) {
        options.server = {
            port
        }
    }

    const server = await createServer(options)
    await server.listen()


    server.printUrls()
    console.log('Server started')
}

startDevScriptServer();