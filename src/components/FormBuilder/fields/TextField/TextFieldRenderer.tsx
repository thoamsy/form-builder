import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FieldRendererProps } from '../types';
import type { TextFieldProps } from './index';

export function TextFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<TextFieldProps>) {
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
            <Input placeholder={fieldConfig.placeholder} {...field} />
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
