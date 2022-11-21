<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import { Page } from 'runtime/functional/project/page';
import { createRenderer } from 'runtime/functional/renderer';

const projectStore = useProjectStore()
const container = ref<HTMLElement>();
const view = ref<HTMLElement>();
const renderer = createRenderer().installPlugins();
        
const renderPage = () => {
    renderer
        .parse()
        .mount(view.value!);
}

watch(() =>  projectStore.activePage, (page) => {}, { immediate: true, flush: 'post' })

</script>

<template>
    <div class="view" ref="container">
        <div class="view-canvas" ref="view"></div>
    </div>
</template>

<style lang="scss">
    $canvas-margin: 16px;
    .view {
        grid-area: middle;
        padding: 16px;
        box-sizing: border-box;
        overflow: auto;
        &-canvas {
            margin: 0 auto;
            overflow: auto;
            transform-origin: left top;
            min-height: 100vh;
        }
    }
</style>