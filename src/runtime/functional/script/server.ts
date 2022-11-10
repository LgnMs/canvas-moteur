import { Command } from '@tauri-apps/api/shell';
import { log, error } from 'runtime/core/log';


export class ScriptServer {

    static async start(workSpacePath: string, port?: number) {
        const pid =  localStorage.getItem('devServerPid');
        if (pid) {
            await this.stop();
        }

        const args = ['bin/startDevScriptServer.js', workSpacePath]
        if (port) {
            args.push(port?.toString())
        }

        const command = new Command('node', args);

        log('启动脚本服务器中...')
        const child = await command.spawn();

        await new Promise<void>((resolve) => {
            command.on('close', data => {
                log(`command finished with code ${data.code} and signal ${data.signal}`)
            });
            command.on('error', msg => {
                error(`command error: "${msg}"`)
            });
            command.stdout.on('data', async line => {
                log(`command stdout: "${line}"`);
                if (line === 'Server started') {
                    await this.appedScript()
                    resolve();
                }
            });
            command.stderr.on('data', line => log(`command stderr: "${line}"`));
        })

        localStorage.setItem('devServerPid', child.pid.toString())

    }

    static async stop() {
        const pid =  localStorage.getItem('devServerPid');

        const command = new Command('kill', [pid!]);

        command.on('close', data => {
            log(`command finished with code ${data.code} and signal ${data.signal}`)
        });
        command.on('error', msg => error(`command error: "${msg}"`));
        command.stdout.on('data', line => log(`command stdout: "${line}"`));
        command.stderr.on('data', line => log(`command stderr: "${line}"`));

        await command.execute();
        localStorage.removeItem('devServerPid')
    }

    static appedScript() {
        return new Promise<void>((resolve) => {
            const node = document.createElement('script') as HTMLScriptElement;
            node.setAttribute('type', 'module');
            node.setAttribute('src', 'http://localhost:1337/src/index.ts')
            document.body.appendChild(node);
    
            node.onload = () => {
                resolve();
            }
        })
    }

}
