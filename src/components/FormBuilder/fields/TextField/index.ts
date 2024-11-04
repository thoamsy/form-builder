import { TextFieldRenderer } from './TextFieldRenderer';
import { TextFieldConfig } from './TextFieldConfig';
import { Pen } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface TextFieldProps extends BaseFieldProps {
  type: 'text';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export const TextField: FieldDefinition<TextFieldProps> = {
  type: 'text',
  label: 'Text Input',
  icon: Pen,
  defaultProps: {
    placeholder: 'Enter text...',
  },
  Renderer: TextFieldRenderer,
  Config: TextFieldConfig,
  createSchema: (field) => {
    let schema = z.string();
    if (field.required) {
      schema = schema.min(1, 'Required');
    }
    if (field.minLength) {
      schema = schema.min(field.minLength);
    }
    if (field.maxLength) {
      schema = schema.max(field.maxLength);
    }
    return schema;
  },
};
