<template>
  <div class="field-group">
    <label :for="name" class="field-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <select
      :id="name"
      :name="name"
      v-model="selectedValue"
      :required="required"
      :disabled="disabled"
      @blur="handleBlur"
      class="field-select"
      :class="{ 'error': !!error }"
    >
      <option value="" disabled>{{ placeholder || 'Выберите опцию' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

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
  modelValue: string | number | null
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
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
  options = []
} = props.schema

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => {
    emit('update:modelValue', value)
  }
})

const handleBlur = () => {
  emit('blur')
}
</script>

<style scoped>

</style>
