<script lang="ts" setup>
import { ref, watch, toRaw } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import { createRenderer } from 'runtime/functional/renderer';

const projectStore = useProjectStore()
const container = ref<HTMLElement>();
const view = ref<HTMLElement>();
const renderer = createRenderer().installPlugins();

watch(() =>  projectStore.activePage, (page, oldPage) => {
    if (oldPage != null) {
        renderer.clear();
    }
    if (page) {
        renderer
            .parse(toRaw(page))
            .mount(view.value!);
    }
}, { immediate: true, flush: 'post' })

watch(() => projectStore.shouldRender, () => {
    if (projectStore.shouldRender && projectStore.activePage) {
        // Tips: 如果使用proxy对象传入，在three渲染的过程中会因为获取不到只读对象导致发生错误
        // 因此在进行渲染之前需要返回原始对象
        renderer.update(toRaw(projectStore.activePage));
        projectStore.setShouldRender(false);
    }
})

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