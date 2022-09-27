import path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
    root: path.join(__dirname, '.'),
    publicDir: path.join(__dirname, 'public'),
    resolve: {
        alias: [
            {find: 'runtime', replacement: path.join(__dirname, '../../runtime')}
        ]
    },
    build: {
        outDir: path.join(__dirname, '../../../out/'),
    }
})
