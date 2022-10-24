<script lang="ts" setup>
import { ITreeNode } from './common';
import TreeItem from './TreeItem.vue';

const emit = defineEmits<{
    (e: 'onTreeDataChange', node: ITreeNode): void,
}>()

defineProps<{data: ITreeNode[]}>();

const onNodeDataChange = (node: ITreeNode) => {
    emit('onTreeDataChange', node)
}
</script>

<template>
    <div class="tree">
        <TreeItem v-for="item in data" :data="item" @onNodeDataChange="onNodeDataChange"></TreeItem>
    </div>
</template>
