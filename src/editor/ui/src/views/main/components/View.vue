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
    <div class="View" ref="container">
        
    </div>
</template>

<style lang="scss">
    .View {
        grid-area: middle;
    }
</style>