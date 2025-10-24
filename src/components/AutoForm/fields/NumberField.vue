<template>
  <div class="field-group">
    <label :for="name" class="field-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
      :id="name"
      type="number"
      :name="name"
      v-model="numberValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @blur="handleBlur"
      class="field-input"
      :class="{ 'error': error }"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FieldSchema } from './../types';

interface Props {
  schema: FieldSchema
  modelValue: number | null
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'blur'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  name,
  label,
  placeholder,
  required = false,
  disabled = false
} = props.schema

const min = computed(() => {
  const minRule = props.schema.validation?.find(rule => rule.type === 'min')
  return minRule?.value as number | undefined
})

const max = computed(() => {
  const maxRule = props.schema.validation?.find(rule => rule.type === 'max')
  return maxRule?.value as number | undefined
})

const step = computed(() => {
  return props.schema.type === 'number' ? 'any' : '1'
})

const numberValue = computed({
  get: () => props.modelValue?.toString() || '',
  set: (value: string) => {
    const numValue = value === '' ? null : Number(value)
    emit('update:modelValue', numValue)
  }
})

const handleBlur = () => {
  emit('blur')
}
</script>
<style scoped>

</style>
