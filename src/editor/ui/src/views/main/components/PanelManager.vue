<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import Tree, { ITree } from 'ui/src/components/Tree/index.vue';
import ButtonIcon from 'ui/src/components/Button/ButtonIcon.vue'

const projectStore = useProjectStore()
const projectInfo = projectStore.projectInfo;
const treeData = ref<ITree[]>()
let isAddPage = false;

const addPage = () => {
    projectStore.addPage()
    isAddPage = true;
}
watch(() => projectStore.changeTime, () => {
    if (!projectStore.isEmpty()) {
        treeData.value = projectInfo?.pages.map((page, index) => { 
            let isEdit = false;
            if (isAddPage && index +1 === projectInfo.pages.length) {
                isEdit = true
            }
            return { 
                name: page.name,
                icon: 'description',
                active: false,
                isEdit,
                childrens: []
            }
        })
    }
})
</script>

<template>
    <div class="PanelManager">
        <div class="PanelManager-projectpanle">
            <div class="header">
                <span>{{projectInfo?.name}}</span>
                <ButtonIcon icon="note_add"  @click="addPage" />
            </div>
            <div class="body">
                <Tree v-if="treeData" :data="treeData"></Tree>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .PanelManager {
        grid-area: left;
        background-color: lighten($color: $basic-color, $amount: 8);
        height: calc(100vh - 28px);
        &-projectpanle {
            height: 100%;
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                font-size: 14px;
                font-weight: bolder;
                height: 44px;
                box-sizing: border-box;
            }
            .body {
                height: calc(100% - 44px);
                overflow: auto;
            }
        }
    }
</style>