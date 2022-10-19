<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    show: boolean
}>();

// const emit = defineEmits<{
//     (e: 'update:show', state: boolean): void;
// }>();

const dialog = ref()

const showMethod = () => {
    dialog.value.showModal();
    // emit('update:show', true);
}

const hideMethod = () => {
    dialog.value.close();
    // emit('update:show', false);
}

const onClose = () => {
    // emit('update:show', false);
}

watch(() => props.show, (value) => {
    if (value) {
        showMethod();
    } else {
        hideMethod();
    }
})

</script>

<template>
    <dialog ref="dialog" @close="onClose">
        <slot></slot>
    </dialog>
</template>