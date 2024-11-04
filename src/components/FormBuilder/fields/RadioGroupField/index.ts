import { RadioGroupFieldRenderer } from './RadioGroupFieldRenderer';
import { RadioGroupFieldConfig } from './RadioGroupFieldConfig';
import { Radio } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps extends BaseFieldProps {
  type: 'radio';
  options: RadioOption[];
  defaultValue?: string;
  layout?: 'horizontal' | 'vertical';
}

export const RadioGroupField: FieldDefinition<RadioGroupFieldProps> = {
  type: 'radio',
  label: 'Radio Group',
  icon: Radio,
  defaultProps: {
    options: [],
    layout: 'vertical',
  },
  Renderer: RadioGroupFieldRenderer,
  Config: RadioGroupFieldConfig,
  createSchema: (field) => {
    const schema = z.string();
    return field.required ? schema.min(1, 'Required') : schema.optional();
  },
};
