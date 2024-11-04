import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FieldRendererProps } from '../types';
import type { TextareaFieldProps } from './index';

export function TextareaFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<TextareaFieldProps>) {
  return (
    <FormField
      control={form.control}
      name={fieldConfig.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {fieldConfig.required && '*'} {fieldConfig.label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={fieldConfig.placeholder}
              rows={fieldConfig.rows}
              {...field}
            />
          </FormControl>
          {fieldConfig.description && (
            <FormDescription>{fieldConfig.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
