import { defineScript } from '../../../src/runtime/functional/script/defineScript'

const fn = () => {
    return {
        onCreated: () => {
            console.log('com1 created')
        },
        onMounted: () => {
            console.log('com1 onMounted')
        },
    }
}

defineScript(fn, '16659732138762_component')