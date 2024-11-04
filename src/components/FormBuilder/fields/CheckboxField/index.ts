import { CheckboxFieldRenderer } from './CheckboxFieldRenderer';
import { CheckboxFieldConfig } from './CheckboxFieldConfig';
import { CheckSquare } from 'lucide-react';
import { z } from 'zod';
import type { BaseFieldProps, FieldDefinition } from '../types';

export interface CheckboxFieldProps extends BaseFieldProps {
  type: 'checkbox';
  defaultChecked?: boolean;
}

export const CheckboxField: FieldDefinition<CheckboxFieldProps> = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: CheckSquare,
  defaultProps: {
    defaultChecked: false,
  },
  Renderer: CheckboxFieldRenderer,
  Config: CheckboxFieldConfig,
  createSchema: (field) => {
    const schema = z.boolean();
    return field.required ? schema : schema.optional();
  },
};
