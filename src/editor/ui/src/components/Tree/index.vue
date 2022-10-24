<script lang="ts" setup>
import Item from './Item.vue'

export interface ITree {
    name: string,
    icon?: string,
    childrens: ITree[]
}
const props = defineProps<{data: ITree[]}>();

</script>

<template>
    <div class="tree">
        <Item v-for="item in data" :data="item">
            <template v-if="item.childrens instanceof Array && item.childrens.length > 0">
                <item v-for="children in item.childrens" :data="children"></item>
            </template>
        </Item>
    </div>
</template>
