<script lang="ts" setup>
import Tools from './components/tools.vue'

</script>

<template>
    <div class="main-container">
        <div class="tools-container">
            <Tools></Tools>
        </div>
        <div class="body"></div>
    </div>
</template>

<style lang="scss">
    .main-container {
        width: 100vw;
        height: 100vh;
        .tools-container {
            height: 12px;
            padding: 8px 24px;
            background-color: var(--basic-color);
        }
    }
</style>