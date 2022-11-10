import path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
    root: path.join(__dirname, '.'),
    publicDir: path.join(__dirname, 'public'),
    server: {
        port: 1337
    }
})
