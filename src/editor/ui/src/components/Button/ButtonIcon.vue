<script lang="ts" setup>
import Icon from '../Icon/Icon.vue';

defineProps<{
    icon: string;
    size?: number;
    color?: string;
}>()
</script>

<template>
    <Icon class="button-icon" :icon="icon" :size="size" :color="color" ></Icon>
</template>

<style lang="scss">
.button-icon {
    cursor: pointer;
    display: inline-block;
    padding: 4px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    &:hover {
        background-color: lighten($color: $basic-color, $amount: 15);
    }

}
</style>