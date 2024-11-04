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
import type { NumberFieldProps } from './index';

export function NumberFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<NumberFieldProps>) {
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
            <Input
              type="number"
              placeholder={fieldConfig.placeholder}
              min={fieldConfig.min}
              max={fieldConfig.max}
              step={fieldConfig.step}
              {...field}
              onChange={(e) => {
                const value = e.target.value
                  ? Number(e.target.value)
                  : undefined;
                field.onChange(value);
              }}
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
