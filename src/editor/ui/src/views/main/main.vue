<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Tools from './components/Tools.vue'
import PanelManager from './components/PanelManager.vue'
import Panelinspection from './components/Panelinspection.vue'
import View from './components/View.vue'
import Footer from './components/Footer.vue'
import { useProjectStore } from '../../stores/project';

const projectStore = useProjectStore();

onMounted(() => {
    if (projectStore.isEmpty()) {
        useRouter().push('/welcome');
    }
})
</script>

<template>
    <div class="main-container">
        <PanelManager></PanelManager>
        <Tools></Tools>
        <View></View>
        <Panelinspection></Panelinspection>
        <Footer></Footer>
    </div>
</template>

<style lang="scss">
    .main-container {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 200px 1fr 200px;
        grid-auto-rows: 28px auto 20px;
        grid-template-areas:
            "left tools right"
            "left middle right"
            "footer footer footer";
        color: $text-color;
        background-color: $basic-color;
    }
</style>