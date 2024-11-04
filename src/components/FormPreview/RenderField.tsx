import { getFieldDefinition } from '../FormBuilder/fields/registry';
import type { FieldRendererProps } from '../FormBuilder/fields/types';

export function RenderField({ field, form }: FieldRendererProps) {
  const fieldDef = getFieldDefinition(field.type);
  const Renderer = fieldDef.Renderer;

  return <Renderer field={field} form={form} />;
}
