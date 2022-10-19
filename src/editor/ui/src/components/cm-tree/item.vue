<script lang="ts" setup>
interface ITree {
    name: string,
    icon?: string,
    childrens: ITree[]
}
const props = defineProps<{data: ITree}>();

</script>

<template>
    <div class="cm-tree-item">
        <span>></span>
        <span>{{props.data.icon}}</span>
        <span>{{props.data.name}}</span>
    </div>
</template>