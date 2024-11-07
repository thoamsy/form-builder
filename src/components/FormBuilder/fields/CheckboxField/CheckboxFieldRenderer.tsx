import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { FieldRendererProps } from '../types';
import type { CheckboxFieldProps } from './index';

export function CheckboxFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<CheckboxFieldProps>) {
  return (
    <FormField
      control={form.control}
      name={fieldConfig.id}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md">
          <FormControl>
            <Checkbox
              className="translate-y-0.5"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {fieldConfig.required && '*'} {fieldConfig.label}
            </FormLabel>
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
