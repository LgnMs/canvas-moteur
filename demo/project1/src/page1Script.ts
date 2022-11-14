import { definePageScript } from "canvas-moteur//src/runtime/functional/script/defineScript";

definePageScript((page) => {
    const a = 1;

    page.addEventListener('click', () => {
        console.log('page.click1')
    })
    const del = () => {
        console.log('del')
    }
    const onCreated = () => {
        console.log('onCreated')
    }

    const onMounted = () => {
        console.log('onMounted')
    }

    const onUnMounted = () => {
        console.log('onUnMounted')
    }

    return {
        a,
        del,
        onCreated,
        onMounted,
        onUnMounted,
    }
}, '16659732138761_page')