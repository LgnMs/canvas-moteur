<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import Tree, { ITree } from 'ui/src/components/TreeList/index.vue'
import Icon from 'ui/src/components/Icon/index.vue'

const projectStore = useProjectStore()

const treeData = ref<ITree>()

watch(() => projectStore.changeTime, () => {
    if (!projectStore.isEmpty()) {
        treeData.value = {
            name: projectStore.projectInfo!.name,
            childrens: projectStore.projectInfo!.pages.map(page => { 
                return { name: page.name, icon: 'description', childrens: [] }
            })
        }
    }
})
</script>

<template>
    <div class="PanelManager">
        <div @click="projectStore.addPage">
            <Icon icon="add"/>新增页面
        </div>
        <Tree v-if="treeData" :data="treeData"></Tree>
    </div>
</template>

<style lang="scss">
    .PanelManager {
        grid-area: left;
        background-color: lighten($color: $basic-color, $amount: 8);
    }
</style>