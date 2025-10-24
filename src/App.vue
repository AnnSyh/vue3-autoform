<template>
  <div class="app">
    <h1>Vue 3 AutoForm Demo</h1>

    <div class="demo-container">
      <AutoForm
        :schema="formSchema"
        :initialData="initialData"
        :showDebug="true"
        @submit="handleFormSubmit"
        @change="handleFormChange"
        @validation="handleFormValidation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import './assets/main.css';
import AutoForm from './components/AutoForm/AutoForm.vue';
import type { FormData, FormSchema, FieldValue } from './components/AutoForm/types';

// Схема формы
const formSchema = ref<FormSchema>({
  title: 'Регистрация пользователя',
  description: 'Заполните форму для регистрации в системе',
  submitButton: {
    text: 'Зарегистрироваться',
    loading: false
  },
  fields: [
    {
      type: 'text',
      name: 'firstName',
      label: 'Имя',
      placeholder: 'Введите ваше имя',
      required: true,
      validation: [
        {
          type: 'minLength',
          value: 2,
          message: 'Имя должно содержать минимум 2 символа'
        }
      ]
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Фамилия',
      placeholder: 'Введите вашу фамилию',
      required: true
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'Введите ваш email',
      required: true,
      validation: [
        {
          type: 'email',
          message: 'Введите корректный email адрес'
        }
      ]
    },
    {
      type: 'number',
      name: 'age',
      label: 'Возраст',
      placeholder: 'Введите ваш возраст',
      validation: [
        {
          type: 'min',
          value: 18,
          message: 'Возраст должен быть не менее 18 лет'
        },
        {
          type: 'max',
          value: 100,
          message: 'Возраст должен быть не более 100 лет'
        }
      ]
    },
    {
      type: 'select',
      name: 'country',
      label: 'Страна',
      placeholder: 'Выберите страну',
      required: true,
      options: [
        { label: 'Россия', value: 'ru' },
        { label: 'США', value: 'us' },
        { label: 'Германия', value: 'de' },
        { label: 'Франция', value: 'fr' }
      ]
    },
    {
      type: 'checkbox',
      name: 'subscribe',
      label: 'Подписаться на рассылку',
      defaultValue: true
    },
    {
      type: 'radio',
      name: 'gender',
      label: 'Пол',
      required: true,
      options: [
        { label: 'Мужской', value: 'male' },
        { label: 'Женский', value: 'female' }
      ]
    },
    {
      type: 'textarea',
      name: 'bio',
      label: 'О себе',
      placeholder: 'Расскажите о себе...',
      validation: [
        {
          type: 'maxLength',
          value: 500,
          message: 'Текст не должен превышать 500 символов'
        }
      ]
    }
  ]
})

// Начальные данные
const initialData = ref<FormData>({
  firstName: 'Иван',
  country: 'ru',
  subscribe: true
})


const handleFormSubmit = (formData: FormData) => {
  console.log('Form submitted:', formData)

  // Имитация загрузки
  formSchema.value.submitButton!.loading = true
  setTimeout(() => {
    formSchema.value.submitButton!.loading = false
    alert('Форма успешно отправлена!')
  }, 2000)
}

const handleFormChange = (event: { field: string; value: FieldValue; formData: FormData }) => {
  console.log('Field changed:', event.field, event.value)
}

const handleFormValidation = (event: { isValid: boolean; errors: Record<string, string[]> }) => {
  console.log('Form validation:', event.isValid, event.errors)
}
</script>

<style>

</style>
