<script lang="ts" setup>
defineProps<{
    label: string,
    modelValue: string | number | any,
}>();
defineEmits<{
    (e: 'update:modelValue', value: string): void,
    (e: 'blur', $event: FocusEvent): void,
}>()
</script>

<template>
    <div class="cm-input">
        <div>{{label}}</div>
            <input 
                :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as any).value)"
                @blur="$emit('blur', $event)"
            />
    </div>
</template>

<style lang="scss">
.cm-input {
    display: grid;
    padding: 4px 0;
    width: 100%;
    font-size: 14px;
    // grid-template-columns: max-content min-content;
    grid-template-columns: max-content 1fr;
    align-items: center;
    column-gap: 4px;
    label {
        display: inline-block;
    }
    input {
        width: min-content;
        color: darken($color: $text-color, $amount: 10);
        outline: none;
        border: none;
        border-bottom: 1px solid $color-line;
        background-color: transparent;
        width: 95%;
        font-size: 13px;
    }
}

</style>