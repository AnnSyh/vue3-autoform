// Базовые типы полей
export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date';

// Валидация
export type FieldValue = string | number | boolean | null;
export type ValidationValue = string | number | boolean | RegExp;
export interface ValidationRule
{
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email';
  value?: ValidationValue;
  message: string;
}

// Опции для select, radio
export interface FieldOption
{
  label: string;
  value: string | number;
}

export interface FieldConditional
{
  field: string;
  value: string | number | boolean;
}

// Схема поля
export interface FieldSchema
{
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number | boolean | null;
  options?: FieldOption[];
  validation?: ValidationRule[];
  dependencies?: string[];
  conditional?: FieldConditional;
  rows?: number;
  cols?: number;
}

// Схема всей формы
export interface FormSchema
{
  title?: string;
  description?: string;
  fields: FieldSchema[];
  submitButton?: {
    text?: string;
    loading?: boolean;
  };
}

// Данные формы
export interface FormData
{
  [ key: string ]: FieldValue;
}
// События формы
export interface FormEvents
{
  submit: FormData;
  change: {
    field: string;
    value: string | number | boolean | null;
    formData: FormData;
  };
  validation: {
    isValid: boolean;
    errors: Record<string, string[]>;
  };
}
