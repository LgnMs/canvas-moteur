import { defineScript } from '../../../src/runtime/functional/script/defineScript'

export default function page1Script() {
    const a = 1;
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
}

defineScript(page1Script, '16659732138761_page')