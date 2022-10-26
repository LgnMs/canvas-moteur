<script lang="ts" setup>
import { useProjectStore } from 'editor/ui/src/stores/project';

const projectStore = useProjectStore()

</script>

<template>
    <div class="Panelinspection">
        <div class="PropPanel">
            <div class="header">属性检查器</div>

            <div>名称: {{projectStore.activeComponent?.name}}</div>
        </div>
    </div>
</template>

<style lang="scss">
    .Panelinspection {
        grid-area: right;
        background-color: lighten($color: $basic-color, $amount: 8);
        height: 100%;
        .PropPanel {
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
        }
    }
</style>
