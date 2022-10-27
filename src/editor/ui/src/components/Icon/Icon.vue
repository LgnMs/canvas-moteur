<script lang="ts" setup>
export interface IconOptions {
  icon: string;
  size?: number;
  color?: string;
}

defineProps<IconOptions>()

</script>

<template>
    <span
      class="material-symbols-outlined" 
      :style="`color:${color}; font-size: ${size}px;`"
    >{{icon}}</span>
</template>

<style>
/* fallback */
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100 700;
  src: url(./fonts/MaterialIcons.woff2) format('woff2');
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
}

</style>