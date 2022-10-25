<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Icon from '../Icon/Icon.vue'
import { ITreeNode } from './common';

const emit = defineEmits<{
    (e: 'onNodeDataChange', node: ITreeNode): void,
}>()

const props = defineProps<{data: ITreeNode}>();

const InputRef = ref();
const name = ref('');
const isEditInput =ref(false);

onMounted(() => {
    isEditInput.value = props.data.isEdit;
    if (props.data.isEdit) {
        InputRef.value.focus();
    }
    name.value = props.data.name;
})

const onInputBlur = () => {
    props.data.isEdit = false;
    emit('onNodeDataChange', {...props.data, name: name.value})
}

</script>

<template>
    <div class="tree-item" @click="data.active = !data.active">
        <Icon class="expand_more" :class="{active: data.active}" icon="expand_more"/>
        <Icon v-if="data.icon" :icon="data.icon"/>
        <input
            class="name-input"
            ref="InputRef"
            :disabled="!isEditInput"
            v-model="name"
            @blur="onInputBlur"
        />
        <div class="tree-item-children">
            <template v-if="data.childrens instanceof Array && data.childrens.length > 0">
                <TreeItem v-for="children in data.childrens" :data="children"></TreeItem>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
    .tree-item {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        cursor: pointer;
        user-select: none;
        &:hover {
            background-color: lighten($color: $basic-color, $amount: 15);
        }
        .name-input {
            margin-left: 4px;
            width: 80%;
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
    }
</style>