<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import ButtonIcon from 'ui/src/components/Button/ButtonIcon.vue'
import Tree, { ITreeNode } from 'editor/ui/src/components/Tree';
import { componentTag, componentType } from 'runtime/functional/project/component/common';

const projectStore = useProjectStore()
const projectInfo = projectStore.projectInfo;
const treeData = ref<ITreeNode[]>()
let isAddPage = false;

watch(() => projectStore.changeTime, () => {
    if (!projectStore.isEmpty()) {
        treeData.value = projectInfo?.pages.map((page, index) => {
            let isEdit = false;
            let isActive = false;
            if (isAddPage && index +1 === projectInfo.pages.length) {
                isEdit = true
                isActive = true
            }
            return { 
                name: page.name,
                icon: 'description',
                active: isActive,
                isEdit,
                childrens: [],
                data: page
            }
        })
    }
})

const addPage = () => {
    projectStore.addPage()
    isAddPage = true;
}

const onTreeDataChange = (data: ITreeNode) => {
    projectStore.changePageNameById(data.data.id, data.name);
}

const addComponent = () => {
    projectStore.addComponent(componentType.Rect, componentTag.CANVAS, { name: '测试', style: {
        backgroundColor: 'yellowgreen',
        height: 100,
        width: 100,
    } })
    projectStore.addComponent(componentType.Input, componentTag.HTML, { name: '测试', style: {} })
}
</script>

<template>
    <div class="PanelManager">
        <div class="PanelManager-projectpanle">
            <div class="header">
                <span>{{projectInfo?.name}}</span>
                <span>
                    <ButtonIcon icon="note_add"  @click="addPage" />
                    <ButtonIcon icon="add_circle"  @click="addComponent" />
                </span>
            </div>
            <div class="body">
                <Tree v-if="treeData" :data="treeData" @onTreeDataChange="onTreeDataChange"></Tree>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .PanelManager {
        grid-area: left;
        background-color: lighten($color: $basic-color, $amount: 8);
        // height: calc(100vh - 28px);
        height: 100%;
        &-projectpanle {
            height: 100%;
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 4px 12px;
                font-size: 14px;
                font-weight: bolder;
                height: 38px;
                box-sizing: border-box;
            }
            .body {
                height: calc(100% - 44px);
                box-sizing: border-box;
                padding: 4px 0;
                overflow: auto;
            }
        }
    }
</style>