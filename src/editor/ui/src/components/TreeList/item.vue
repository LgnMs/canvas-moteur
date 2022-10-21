<script lang="ts" setup>
import Icon from '../Icon/index.vue'

interface ITree {
    name: string,
    icon?: string,
    childrens: ITree[]
}
const props = defineProps<{data: ITree}>();

</script>

<template>
    <div class="cm-tree-item">
        <Icon icon="expand_more"/>
        <Icon v-if="data.icon" :icon="data.icon"/>
        <span>{{data.name}}</span>
    </div>
</template>