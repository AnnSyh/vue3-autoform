<template>
  <form @submit.prevent="handleSubmit" class="auto-form">

    <section class="form-section">
        <div v-if="schema.title" class="form-header">
          <h2 class="form-title">{{ schema.title }}</h2>
          <p v-if="schema.description" class="form-description">
            {{ schema.description }}
          </p>
        </div>
        <div class="form-fields">
          <component
            v-for="field in visibleFields"
            :key="field.name"
            :is="getFieldComponent(field.type)"
            :schema="field"
            :modelValue="formData[field.name]"
            :error="errors[field.name]?.[0]"
            @update:modelValue="(value: FieldValue) => handleFieldChange(field.name, value)"
            @blur="() => validateField(field.name)"
          />
        </div>
        <div class="form-actions">
          <button
            type="submit"
            :disabled="submitDisabled"
            class="submit-button"
            :class="{ 'loading': schema.submitButton?.loading }"
          >
            {{ submitButtonText }}
            <span v-if="schema.submitButton?.loading" class="loading-spinner"></span>
          </button>
        </div>
    </section>



    <div v-if="showDebug" class="debug-info">
      <h3>Debug Info:</h3>
      <pre>Form Data: {{ JSON.stringify(formData, null, 2) }}</pre>
      <pre>Errors: {{ JSON.stringify(errors, null, 2) }}</pre>
      <pre>Visible Fields: {{ visibleFields.map(f => f.name) }}</pre>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Component } from 'vue';
import type { FieldSchema, FormData, FormSchema, FieldValue } from './types';


import CheckboxField from './fields/CheckboxField.vue';
import NumberField from './fields/NumberField.vue';
import RadioField from './fields/RadioField.vue';
import SelectField from './fields/SelectField.vue';
import TextAreaField from './fields/TextAreaField.vue';
import TextField from './fields/TextField.vue';

interface Props {
  schema: FormSchema
  initialData?: FormData
  showDebug?: boolean
}

interface Emits {
  (e: 'submit', data: FormData): void
  (e: 'change', data: { field: string; value: FieldValue; formData: FormData }): void
  (e: 'validation', data: { isValid: boolean; errors: Record<string, string[]> }): void
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  showDebug: false
})

const emit = defineEmits<Emits>()


const formData = ref<FormData>({})
const errors = ref<Record<string, string[]>>({})
const touchedFields = ref<Set<string>>(new Set())

  // Инициализировать сразу при создании
const initializeFormData = () => {
  const data: FormData = {}

  // Сначала установить initialData
  Object.assign(data, props.initialData)

  // Затем установить значения по умолчанию
  props.schema.fields.forEach(field => {
    if (data[field.name] === undefined) {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'textarea':
          data[field.name] = field.defaultValue || ''
          break
        case 'number':
          data[field.name] = field.defaultValue || null
          break
        case 'checkbox':
          data[field.name] = field.defaultValue || false
          break
        case 'select':
        case 'radio':
          data[field.name] = field.defaultValue || null
          break
      }
    }
  })

  formData.value = data
}

// Вызвать инициализацию сразу
initializeFormData()


const visibleFields = computed(() => {
  return props.schema.fields.filter(field => isFieldVisible(field))
})

const submitButtonText = computed(() => {
  return props.schema.submitButton?.text || 'Submit'
})

const submitDisabled = computed(() => {
  return Object.keys(errors.value).length > 0 || props.schema.submitButton?.loading
})


const getFieldComponent = (type: string) => {
  const componentMap: Record<string, Component> = {
    text: TextField,
    email: TextField,
    password: TextField,
    number: NumberField,
    select: SelectField,
    checkbox: CheckboxField,
    radio: RadioField,
    textarea: TextAreaField
  }
  return componentMap[type] || TextField
}


const isFieldVisible = (field: FieldSchema): boolean => {
  if (!field.conditional) return true

  const { field: dependentField, value } = field.conditional
  return formData.value[dependentField] === value
}

const handleFieldChange = (fieldName: string, value: FieldValue) => {
  formData.value[fieldName] = value
  touchedFields.value.add(fieldName)

  // Валидация при изменении (только для touched полей)
  if (touchedFields.value.has(fieldName)) {
    validateField(fieldName)
  }

  emit('change', {
    field: fieldName,
    value,
    formData: formData.value
  })
}

const validateField = (fieldName: string) => {
  const field = props.schema.fields.find(f => f.name === fieldName)
  if (!field) return

  const fieldErrors: string[] = []
  const value = formData.value[fieldName]

  // Required validation
  if (field.required && (value === undefined || value === null || value === '')) {
    fieldErrors.push('Это поле обязательно для заполнения')
  }

  // Custom validation rules
  if (field.validation && value !== undefined && value !== null && value !== '') {
    field.validation.forEach(rule => {
      switch (rule.type) {
        case 'min':
          if (typeof rule.value === 'number' && Number(value) < rule.value) {
            fieldErrors.push(rule.message)
          }
          break
        case 'max':
          if (typeof rule.value === 'number' && Number(value) > rule.value) {
            fieldErrors.push(rule.message)
          }
          break
        case 'minLength':
          if (typeof rule.value === 'number' && String(value).length < rule.value) {
            fieldErrors.push(rule.message)
          }
          break
        case 'maxLength':
          if (typeof rule.value === 'number' && String(value).length > rule.value) {
            fieldErrors.push(rule.message)
          }
          break
        case 'pattern':
          if (typeof rule.value === 'string' && !new RegExp(rule.value).test(String(value))) {
            fieldErrors.push(rule.message)
          }
          break
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
            fieldErrors.push(rule.message)
          }
          break
      }
    })
  }

  if (fieldErrors.length > 0) {
    errors.value[fieldName] = fieldErrors
  } else {
    delete errors.value[fieldName]
  }
}

const validateForm = (): boolean => {
  // Mark all fields as touched for validation
  props.schema.fields.forEach(field => {
    touchedFields.value.add(field.name)
    validateField(field.name)
  })

  const isValid = Object.keys(errors.value).length === 0
  emit('validation', { isValid, errors: errors.value })

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}


watch(
  () => props.initialData,
  () => {
    initializeFormData()
  },
  { deep: true }
)

watch(
  () => props.schema,
  () => {
    initializeFormData()
    errors.value = {}
    touchedFields.value.clear()
  },
  { deep: true }
)


onMounted(() => {
  initializeFormData()
})


defineExpose({
  validate: validateForm,
  getData: () => formData.value,
  setData: (data: FormData) => {
    formData.value = { ...formData.value, ...data }
  },
  reset: () => {
    initializeFormData()
    errors.value = {}
    touchedFields.value.clear()
  }
})
</script>

<style scoped>



</style>
