<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Icon from '../Icon/Icon.vue'
import { ITreeNode } from './common';

const emit = defineEmits<{
    (e: 'onNodeDataChange', node: ITreeNode): void,
    (e: 'onNodeClick', node: ITreeNode): void,
}>()

const props = defineProps<{data: ITreeNode}>();

const InputRef = ref();
const name = ref('');
const isEditInput =ref(false);
const expand = ref(false);

onMounted(() => {
    name.value = props.data.name;
})

const onInputBlur = () => {
    isEditInput.value = false;
    emit('onNodeDataChange', {...props.data, name: name.value})
}

const nodeClick = () => {
    props.data.active = !props.data.active;
    emit('onNodeClick', props.data);
}

const onNodeDataChange = (node: ITreeNode) => {
    emit('onNodeDataChange', node)
}

const onNodeClick = (node: ITreeNode) => {
    emit('onNodeClick', node)
}

</script>

<template>
    <div class="tree-item" @click="nodeClick">
        <Icon class="expand_more" @click="expand = !expand" :class="{active: expand}" icon="expand_more"/>
        <Icon v-if="data.icon" :size="16" :icon="data.icon"/>
        <input
            class="name-input"
            ref="InputRef"
            :disabled="!isEditInput"
            v-model="name"
            @blur="onInputBlur"
        />
    </div>
    <div v-show="expand" class="tree-item-children">
        <template v-if="data.childrens instanceof Array && data.childrens.length > 0">
            <TreeItem v-for="children in data.childrens" :data="children" @onNodeDataChange="onNodeDataChange" @onNodeClick="onNodeClick"></TreeItem>
        </template>
    </div>
</template>

<style lang="scss">
    .tree-item {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        cursor: pointer;
        user-select: none;
        flex-wrap: wrap;
        &:hover {
            background-color: lighten($color: $basic-color, $amount: 15);
        }
        .name-input {
            margin-left: 4px;
            width: calc(100% - 56px);
            background-color: transparent;
            border: none;
            color: $text-color;
            outline: none;
            cursor: pointer;
            &:focus {
                outline: 1px solid $color-outline;
            }
        }
        .expand_more {
            transform: rotate(-90deg);
            &.active {
                transform: rotate(0deg);
            }
        }
        &-children {
            padding-left: 8px;
        }
    }
</style>