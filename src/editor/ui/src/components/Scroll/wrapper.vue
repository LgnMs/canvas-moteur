<script lang="ts" setup>
import { ref } from 'vue';
import BScroll, { Options } from '@better-scroll/core'

const el = ref<HTMLElement>()
let bs: BScroll | null = null;

const initScroll = (options?: Options) => {
    bs = new BScroll(el.value!, {
        scrollY: true,
        ...options
    })
}

defineExpose({
    el,
    bs,
    initScroll
})

</script>

<template>
    <div class="scroll-wrapper" ref="el">
        <slot></slot>
    </div>
</template>