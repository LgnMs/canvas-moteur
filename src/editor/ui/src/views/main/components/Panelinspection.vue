<script lang="ts" setup>
import { useProjectStore } from 'editor/ui/src/stores/project';
import Input from 'ui/src/components/Input/Input.vue'

const projectStore = useProjectStore()

const onBlur = () => {
    projectStore.activeComponent?.setShouldRender(true);
    projectStore.render();
}
</script>

<template>
    <div class="Panelinspection">
        <div class="PropPanel">
            <div class="header">属性检查器</div>

            <div class="body" v-if="projectStore.activeComponent" @blur="onBlur">
                <Input label="名称" v-model="projectStore.activeComponent.name"></Input>

                <div class="body-position" v-if="projectStore.activeComponent.position">
                    <Input label="x" v-model="projectStore.activeComponent.position.x"></Input>
                    <Input label="y" v-model="projectStore.activeComponent.position.y"></Input>
                </div>

                <div class="body-style" v-if="projectStore.activeComponent.style">
                    <template v-for="(value, key) in (projectStore.activeComponent.style as object)">
                        <Input :label="key" v-model="projectStore.activeComponent.style[key]" @blur="onBlur"></Input>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    $padding-lr: 12px;
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
                padding: 4px $padding-lr;
                font-size: 14px;
                font-weight: bolder;
                height: 38px;
                box-sizing: border-box;
            }
            .body {
                padding: 4px $padding-lr;
                box-sizing: border-box;
                overflow: hidden;
                &-position {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    column-gap: 4px;
                }
            }
        }
    }
</style>
