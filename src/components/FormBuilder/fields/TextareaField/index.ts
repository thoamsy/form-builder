import { TextareaFieldRenderer } from './TextareaFieldRenderer';
import { TextareaFieldConfig } from './TextareaFieldConfig';
import { AlignLeft } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export const TextareaField: FieldDefinition<TextareaFieldProps> = {
  type: 'textarea',
  label: 'Long Text',
  icon: AlignLeft,
  defaultProps: {
    placeholder: 'Enter text...',
    rows: 4,
  },
  Renderer: TextareaFieldRenderer,
  Config: TextareaFieldConfig,
  createSchema: (field) => {
    let schema = z.string();
    if (field.required) {
      schema = schema.min(1, 'Required');
    }
    if (field.minLength) {
      schema = schema.min(
        field.minLength,
        `Minimum ${field.minLength} characters`,
      );
    }
    if (field.maxLength) {
      schema = schema.max(
        field.maxLength,
        `Maximum ${field.maxLength} characters`,
      );
    }
    return schema;
  },
};
