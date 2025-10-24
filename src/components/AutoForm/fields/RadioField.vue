<template>
    <div class="field-group">
        <legend class="field-legend">
            <span class="field-label">
                {{ label }}
                <span v-if="required" class="required">*</span>
            </span>
        </legend>

        <div v-for="option in options"
            :key="option.value"
            class="field-radio-input"
        >
            <input
              type="radio"
              :id="`${name}-${option.value}`"
              :name="name"
              :value="option.value"
              :disabled="disabled"
              v-model="selectedValue"
              @blur="handleBlur"
            />
            <label :for="`${name}-${option.value}`">
              {{ option.label }}
            </label>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

    </div>

</template>

<script setup lang="ts">
import {computed} from 'vue'
import type { FieldSchema, FieldValue } from './../types';

interface Props {
  schema: FieldSchema
  modelValue: string | number | null
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: FieldValue): void
  (e: 'blur'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  name,
  label,
  required = false,
  disabled = false,
  options = []
} = props.schema

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: FieldValue) => emit('update:modelValue', value)
})

const handleBlur = () => {
  emit('blur')
}

</script>

<style scoped>

</style>
