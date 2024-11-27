// form-builder/src/types/form.ts
import type { FieldTypes } from '@/pages/FormBuilder/fields/registry';
import type { BaseFieldProps } from '@/pages/FormBuilder/fields/types';

export interface FormField extends BaseFieldProps {
  id: string;
  type: FieldTypes;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
