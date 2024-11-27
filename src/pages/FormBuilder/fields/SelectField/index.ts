import { SelectFieldRenderer } from './SelectFieldRenderer';
import { SelectFieldConfig } from './SelectFieldConfig';
import { ListFilter } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  placeholder?: string;
  options: SelectOption[];
}

export const SelectField: FieldDefinition<SelectFieldProps> = {
  type: 'select',
  label: 'Select Input',
  icon: ListFilter,
  defaultProps: {
    placeholder: 'Select an option...',
    options: [
      {
        value: 'option1',
        label: 'Option 1',
      },
    ],
  },
  Renderer: SelectFieldRenderer,
  Config: SelectFieldConfig,
  createSchema: (field) => {
    const baseSchema = z.string();
    return field.required
      ? baseSchema.min(1, 'Required')
      : baseSchema.optional();
  },
};
