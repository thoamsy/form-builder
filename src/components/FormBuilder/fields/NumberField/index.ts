import { NumberFieldRenderer } from './NumberFieldRenderer';
import { NumberFieldConfig } from './NumberFieldConfig';
import { Hash } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface NumberFieldProps extends BaseFieldProps {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberField: FieldDefinition<NumberFieldProps> = {
  type: 'number',
  label: 'Number Input',
  icon: Hash,
  defaultProps: {
    placeholder: 'Enter number...',
    step: 1,
  },
  Renderer: NumberFieldRenderer,
  Config: NumberFieldConfig,
  createSchema: (field) => {
    let schema = z.number();
    if (field.required) {
      schema = schema.min(1, 'Required');
    }
    if (field.min !== undefined) {
      schema = schema.min(field.min, `Minimum value is ${field.min}`);
    }
    if (field.max !== undefined) {
      schema = schema.max(field.max, `Maximum value is ${field.max}`);
    }
    return schema;
  },
};
