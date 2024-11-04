import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { DateField } from './DateField';
import { RadioGroupField } from './RadioGroupField';
import { TextareaField } from './TextareaField';
import type { FieldDefinition, BaseFieldProps } from './types';

const fieldTypes: Record<string, FieldDefinition<BaseFieldProps>> = {
  text: TextField as FieldDefinition<BaseFieldProps>,
  number: NumberField as FieldDefinition<BaseFieldProps>,
  select: SelectField as FieldDefinition<BaseFieldProps>,
  checkbox: CheckboxField as FieldDefinition<BaseFieldProps>,
  date: DateField as FieldDefinition<BaseFieldProps>,
  radio: RadioGroupField as FieldDefinition<BaseFieldProps>,
  textarea: TextareaField as FieldDefinition<BaseFieldProps>,
};

export const getFieldDefinition = (
  type: string,
): FieldDefinition<BaseFieldProps> => {
  const fieldDef = fieldTypes[type];
  if (!fieldDef) {
    throw new Error(`Field type "${type}" not found`);
  }
  return fieldDef;
};

export const getAllFieldTypes = () => Object.values(fieldTypes);
