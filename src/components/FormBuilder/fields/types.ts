import { z } from 'zod';
import { ComponentType } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { FieldTypes } from './registry';

export interface BaseFieldProps {
  id: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
}

export interface FieldRendererProps<T extends BaseFieldProps = BaseFieldProps> {
  field: T;
  form: UseFormReturn<Record<string, any>>;
}

export interface FieldConfigProps<T extends BaseFieldProps = BaseFieldProps> {
  field: T;
  onUpdate: (updates: Partial<T>) => void;
}

export interface FieldDefinition<T extends BaseFieldProps = BaseFieldProps> {
  type: FieldTypes;
  label: string;
  icon: ComponentType<{ className?: string }>;
  defaultProps: Partial<Omit<T, keyof BaseFieldProps>>;
  Renderer: ComponentType<FieldRendererProps<T>>;
  Config: ComponentType<FieldConfigProps<T>>;
  createSchema: (field: T) => z.ZodType;
}
