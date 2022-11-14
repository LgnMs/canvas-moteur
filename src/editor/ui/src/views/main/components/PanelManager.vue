<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useProjectStore } from 'editor/ui/src/stores/project';
import ButtonIcon from 'ui/src/components/Button/ButtonIcon.vue'
import Tree, { ITreeNode } from 'editor/ui/src/components/Tree';
import { Component, componentTag, componentType } from 'runtime/functional/project/component/common';
import { Page } from 'runtime/functional/project/page';
import { error } from 'runtime/core/log';

const projectStore = useProjectStore()
const projectInfo = projectStore.projectInfo;
const treeData = ref<ITreeNode[]>()
let isAddPage = false;

const getTreeData = (pages: Page[]) => {
    const getChildren = (components: Component[], parent: ITreeNode): ITreeNode[] => {
        if (components.length === 0) return [];

        return components.map((component) => {
            const node: ITreeNode= {
                name: component.name,
                icon: 'circle',
                active: false,
                parent,
                childrens: [],
                data: component
            }
            node.childrens = getChildren(component.components, node);
            return node
        })
    }

    const data: ITreeNode[] = pages.map((page, index) => {
        let isActive = false;
        if (isAddPage && index +1 === pages.length) {
            isActive = true
        }
        const node: ITreeNode  = { 
            name: page.name,
            icon: 'description',
            active: isActive,
            parent: null,
            childrens: [],
            data: page
        }
        node.childrens = getChildren(page.components, node);
        return node;
    })
    return data;
}

onMounted(() => {
    if (!projectStore.isEmpty()) {
        treeData.value = getTreeData(projectStore.projectInfo!.pages)
    }
})

watch(() => projectStore.shouldUpdateTree, () => {
    if (!projectStore.isEmpty()) {
        treeData.value = getTreeData(projectStore.projectInfo!.pages)
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
    // projectStore.addComponent(componentType.Rect, componentTag.CANVAS, { name: '测试1', style: {
    //     backgroundColor: 'yellowgreen',
    //     height: 100,
    //     width: 100,
    // } })
    projectStore.addComponent(componentType.Input, componentTag.HTML, {
        name: '测试2',
        layerId: projectStore.view!.activeLayerId,
        style: {
            width: '120px',
            height: '40px',
    } })
}

const onNodeClick = (node: ITreeNode) => {
    const data: Page | Component = node.data;
    if (data.id.indexOf('page') !== -1) {
        projectStore.setActivePage(data as Page);
        projectStore.setSelectType(0);
    } else if (data.id.indexOf('component') !== -1) {
        // 点击到组件时应当渲染组件所在的页面
        const getPage = (node: ITreeNode): Page | null => {
            const parent = node.parent;
            if (!parent) return null;

            if (parent.data.id.indexOf('page') !== -1) {
                return parent.data;
            } else if (parent.data.id.indexOf('component') !== -1) {
                if (!parent.parent) return null;
                return getPage(parent.parent)
            }
            return null;
        }

        const page = getPage(node);
        if (page) {
            projectStore.setActivePage(page)
        } else {
            error('未找到组件所在的页面')
        }
        projectStore.setActiveComponent(data as Component);
        projectStore.setSelectType(1);
    }
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
                <Tree v-if="treeData" :data="treeData" @onTreeDataChange="onTreeDataChange" @onNodeClick="onNodeClick"></Tree>
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
        user-select: none;
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
                height: calc(100vh - 38px - 20px);
                box-sizing: border-box;
                padding: 4px 0;
                overflow: auto;
            }
        }
    }
</style>