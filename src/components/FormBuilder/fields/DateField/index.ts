import { DateFieldRenderer } from './DateFieldRenderer';
import { DateFieldConfig } from './DateFieldConfig';
import { Calendar } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface DateFieldProps extends BaseFieldProps {
  type: 'date';
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateField: FieldDefinition<DateFieldProps> = {
  type: 'date',
  label: 'Date Picker',
  icon: Calendar,
  defaultProps: {
    placeholder: 'Pick a date...',
  },
  Renderer: DateFieldRenderer,
  Config: DateFieldConfig,
  createSchema: (field) => {
    let schema = z.date();
    if (field.minDate) {
      schema = schema.min(
        field.minDate,
        `Date must be after ${field.minDate.toLocaleDateString()}`,
      );
    }
    if (field.maxDate) {
      schema = schema.max(
        field.maxDate,
        `Date must be before ${field.maxDate.toLocaleDateString()}`,
      );
    }
    return field.required ? schema : schema.optional();
  },
};
