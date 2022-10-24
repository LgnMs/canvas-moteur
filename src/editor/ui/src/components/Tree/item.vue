<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Icon from '../Icon/index.vue'

interface ITree {
    name: string,
    icon?: string,
    active: boolean,
    isEdit: boolean,
    childrens: ITree[]
}
const props = defineProps<{data: ITree}>();

const InputRef = ref();

onMounted(() => {
    if (props.data.isEdit) {
        InputRef.value.focus();
    }
})

const onInputBlur = () => {
    props.data.isEdit = false;
}
</script>

<template>
    <div class="tree-item" @click="data.active = !data.active">
        <Icon class="expand_more" :class="{active: data.active}" icon="expand_more"/>
        <Icon v-if="data.icon" :icon="data.icon"/>
        <input
            class="name-input"
            ref="InputRef"
            :disabled="!data.isEdit"
            v-model="data.name"
            @blur="onInputBlur"
        />
        <div class="tree-item-children">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
    .tree-item {
        display: flex;
        align-items: center;
        padding: 0 8px;
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
            &:focus-visible {
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