<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';

const projectStore = useProjectStore()
const container = ref<HTMLElement>();

watch([
    () => projectStore.activePage,
    () => projectStore.shouldRender,
], () => {
    projectStore.render(container.value!)
})

</script>

<template>
    <div class="view">
        <div class="view-canvas" ref="container"></div>
    </div>
</template>

<style lang="scss">
    $canvas-margin: 16px;
    .view {
        grid-area: middle;
        &-canvas {
            margin: $canvas-margin;
            width: calc(100% - ($canvas-margin * 2));
            height: calc(100% - ($canvas-margin * 2));
        }
    }
</style>