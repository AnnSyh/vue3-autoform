<template>
  <div class="field-group checkbox-group">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :name="name"
        :checked="modelValue"
        :required="required"
        :disabled="disabled"
        @change="handleChange"
        class="checkbox-input"
      />
      <span class="checkbox-custom"></span>
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FieldSchema } from './../types';

interface Props {
  schema: FieldSchema
  modelValue: boolean
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  name,
  label,
  required = false,
  disabled = false
} = props.schema

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<style scoped>
.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #3498db;
  border-color: #3498db;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.checkbox-input:disabled + .checkbox-custom {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
</style>
