import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                name: 'canvasMoteur',
                file: pkg.browser,
                format: 'umd'
            },
        ],
        plugins: [typescript(), resolve(), commonjs()]
    },
    {
        input: 'src/index.ts',
        external: ['lodash'],
        output: [
            {
                file: pkg.main,
                format: 'cjs'
            },
            {
                file: pkg.module,
                format: 'es'
            },
        ],
        plugins: [typescript()]
    }
]
