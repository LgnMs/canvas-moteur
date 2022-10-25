<script lang="ts" setup>
import { useProjectStore } from 'editor/ui/src/stores/project';

const projectStore = useProjectStore()

</script>

<template>
    <div class="footer">
        <span>项目版本：{{projectStore.projectInfo?.version}}</span>
    </div>
</template>

<style lang="scss">
    .footer {
        grid-area: footer;
        height: 12px;
        padding: 4px 12px;
        background-color: $color-footer;
        font-size: 12px;
    }
</style>
