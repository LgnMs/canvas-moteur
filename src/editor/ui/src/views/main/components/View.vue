<script lang="ts" setup>
import { nextTick, onMounted, ref, VNodeRef, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import ScrollWrapper from 'ui/src/components/Scroll/wrapper.vue'

const projectStore = useProjectStore()
const container = ref<HTMLElement>();
const wrapper = ref<InstanceType<typeof ScrollWrapper>>();

const setViewCanvasSize = () => {
    const el = wrapper.value?.el!;

    const viewWidth = el.offsetWidth!;
    el.style.height = el.offsetHeight + 'px';
    // web 16:9大小

    const width = viewWidth - 48;
    const height = width * ( 9 / 16);

    container.value!.style.width = width + 'px';
    container.value!.style.height = height + 'px';
}

onMounted(() => {
    setViewCanvasSize();

    wrapper.value?.initScroll()
})

watch([
    () => projectStore.activePage,
    () => projectStore.shouldRender,
], () => {
    projectStore.render(container.value!)
})

</script>

<template>
    <ScrollWrapper class="view" ref="wrapper">
        <div class="view-canvas" ref="container"></div>
    </ScrollWrapper>
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