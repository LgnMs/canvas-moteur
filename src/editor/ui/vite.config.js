import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    root: path.join(__dirname, '.'),
    publicDir: path.join(__dirname, 'public'),
    plugins: [vue()],
    resolve: {
        alias: [
            {find: 'runtime', replacement: path.join(__dirname, '../../runtime')},
            {find: 'editor', replacement: path.join(__dirname, '../../editor')},
        ]
    },
    build: {
        outDir: path.join(__dirname, '../../../dist/'),
        emptyOutDir: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "editor/ui/src/styles/base.scss" as *;`
            }
        }
    }
})
