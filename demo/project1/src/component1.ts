import { defineComponentScript } from 'canvas-moteur/src/runtime/functional/script/defineScript'

export default defineComponentScript((component) => {
    component.addEventListener('click', () => {
        console.log('com1 clicked')
    })
    return {
        onCreated: () => {
            console.log('com1 created')
        },
        onMounted: () => {
            console.log('com1 onMounted')
        },
    }
}, '16659732138762_component')
