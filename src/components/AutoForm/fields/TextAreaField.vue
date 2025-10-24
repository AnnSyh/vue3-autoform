<template>
    <div class="field-group">

        <label :for="name" class="field-label">
            {{ label }}
            <span v-if="required" class="required">*</span>
        </label>

        <textarea
            :id="name"
            :name="name"
            :placeholder="placeholder"
            :rows="rows"
            :cols="cols"
            :required="required"
            :disabled="disabled"
            v-model="textareaValue"
            class="field-input"
            :class="{ 'error': !!error }"
        />

        <div v-if="error" class="error-message">
        {{ error }}
        </div>

    </div>

</template>

<script setup lang="ts">
import {computed} from 'vue'
import type { FieldSchema } from './../types';

    interface Props {
        schema: FieldSchema
        modelValue: string
        error?: string
    }

    interface Emits {
        (e: 'update:modelValue', value: string): void
        (e: 'blur'): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const {
        name,
        label,
        placeholder,
        required = false,
        disabled = false,
        rows = 5,
        cols = 33,
    } = props.schema

    const textareaValue = computed({
        get: () => props.modelValue,
        set: (value: string) => emit('update:modelValue', value)
    })

</script>

<style scoped>

</style>
