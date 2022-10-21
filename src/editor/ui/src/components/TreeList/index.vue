<script lang="ts" setup>
import Item from './Item.vue'

export interface ITree {
    name: string,
    icon?: string,
    childrens: ITree[]
}
const props = defineProps<{data: ITree}>();

</script>

<template>
    <div class="cm-tree">
        <div>
            <label>{{props.data.name}}</label>
        </div>
        <Item v-for="item in props.data.childrens" :data="item"></Item>
    </div>
</template>