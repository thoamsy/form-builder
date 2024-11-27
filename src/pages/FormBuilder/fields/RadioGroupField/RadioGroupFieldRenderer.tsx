import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { FieldRendererProps } from '../types';
import type { RadioGroupFieldProps } from './index';

export function RadioGroupFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<RadioGroupFieldProps>) {
  return (
    <FormField
      control={form.control}
      name={fieldConfig.id}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <div>
            <FormLabel>
              {fieldConfig.required && '*'} {fieldConfig.label}
            </FormLabel>
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
          </div>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn(
                'gap-2',
                fieldConfig.layout === 'horizontal' ? 'flex' : 'flex flex-col',
              )}
            >
              {fieldConfig.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label className="font-normal" htmlFor={option.value}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
