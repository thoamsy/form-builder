import { z } from 'zod';

// Base field properties
const baseFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  description: z.string().optional(),
});

// Text field specific properties
const textFieldSchema = baseFieldSchema.extend({
  type: z.literal('text'),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
});

// Number field specific properties
const numberFieldSchema = baseFieldSchema.extend({
  type: z.literal('number'),
  min: z.number().optional(),
  max: z.number().optional(),
});

// Select field specific properties
const selectFieldSchema = baseFieldSchema.extend({
  type: z.literal('select'),
  multiple: z.boolean().default(false),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});

// Checkbox field specific properties
const checkboxFieldSchema = baseFieldSchema.extend({
  type: z.literal('checkbox'),
});

// Date field specific properties
const dateFieldSchema = baseFieldSchema.extend({
  type: z.literal('date'),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
});

// Combined form field schema
export const formFieldSchema = z.discriminatedUnion('type', [
  textFieldSchema,
  numberFieldSchema,
  selectFieldSchema,
  checkboxFieldSchema,
  dateFieldSchema,
]);

// Form schema
export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
});

// Infer TypeScript types from schemas
export type FormField = z.infer<typeof formFieldSchema>;
export type TextFieldProps = z.infer<typeof textFieldSchema>;
export type NumberFieldProps = z.infer<typeof numberFieldSchema>;
export type SelectFieldProps = z.infer<typeof selectFieldSchema>;
export type CheckboxFieldProps = z.infer<typeof checkboxFieldSchema>;
export type DateFieldProps = z.infer<typeof dateFieldSchema>;
export type Form = z.infer<typeof formSchema>;
