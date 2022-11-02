<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import { Page } from 'runtime/functional/project/page';

const projectStore = useProjectStore()
const container = ref<HTMLElement>();
const wrapper = ref<HTMLElement>();
const scale = ref(1);

const setViewCanvasSize = (page: Page) => {
    container.value!.style.width = page.width;
    container.value!.style.height = page.height;
    container.value!.style.minHeight = '100vh';

    scale.value = wrapper.value!.clientWidth / container.value!.clientWidth;
    
    if (scale.value > 1) {
        scale.value = 1;
    }
    container.value!.style.transform = `scale(${scale.value})`;
}


const changePage = () => {
    projectStore.clear();
    container.value!.innerHTML = '';
    projectStore.render(container.value!)
}

watch(() => projectStore.activePage, (page) => {
    console.log(233)
    if (page) {
        setViewCanvasSize(page);
        changePage();
    }
})

watch(() => projectStore.shouldRender, () => {
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
        padding: 16px;
        box-sizing: border-box;
        overflow: auto;
        &-canvas {
            margin: 0 auto;
            overflow: auto;
            transform-origin: left top;
        }
    }
</style>