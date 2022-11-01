<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';

const projectStore = useProjectStore()
const container = ref<HTMLElement>();
const wrapper = ref<HTMLElement>();

const setViewCanvasSize = () => {
    const el = wrapper.value!;

    const viewWidth = el.offsetWidth!;

    const width = viewWidth - 48;
    const height = width * ( 9 / 16);

    container.value!.style.width = width + 'px';
    container.value!.style.height = height + 'px';
}

onMounted(() => {
    setViewCanvasSize();
})

const changePage = () => {
    projectStore.clear();
    container.value!.innerHTML = '';
    projectStore.render(container.value!)
}

watch([
    () => projectStore.activePage,
], () => {
    changePage();
})

watch([
    () => projectStore.shouldRender,
], () => {
    projectStore.render(container.value!)
})

</script>

<template>
    <div class="view" ref="wrapper">
        <div class="view-canvas" ref="container"></div>
    </div>
</template>

<style lang="scss">
    $canvas-margin: 16px;
    .view {
        grid-area: middle;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: hidden;
        &-canvas {
            overflow: auto;
        }
    }
</style>