<script lang="ts" setup>
import Tools from './components/Tools.vue'
import PanelManager from './components/PanelManager.vue'
import Panelinspection from './components/Panelinspection.vue'
import View from './components/View.vue'

</script>

<template>
    <div class="main-container">
        <Tools></Tools>
        <PanelManager></PanelManager>
        <View></View>
        <Panelinspection></Panelinspection>
    </div>
</template>

<style lang="scss">
    .main-container {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 200px 1fr 200px;
        grid-auto-rows: min-content auto;
        grid-template-areas:
            "tools tools tools"
            "left middle right";
        color: $text-color;
        background-color: $basic-color;
    }
</style>