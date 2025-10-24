<template>
  <div class="field-group">
    <label :for="name" class="field-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
      :id="name"
      :type="inputType"
      :name="name"
      v-model="inputValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @blur="handleBlur"
      class="field-input"
      :class="{ 'error': !!error }"
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
  disabled = false
} = props.schema

const inputType = computed(() => {
  const typeMap: Record<string, string> = {
    email: 'email',
    password: 'password',
    text: 'text'
  }
  return typeMap[props.schema.type] || 'text'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  }
})

const handleBlur = () => {
  emit('blur')
}
</script>
