import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { FieldRendererProps } from '../types';
import type { DateFieldProps } from './index';

export function DateFieldRenderer({
  field: fieldConfig,
  form,
}: FieldRendererProps<DateFieldProps>) {
  const disablePast = fieldConfig.disablePast || false;

  return (
    <FormField
      control={form.control}
      name={fieldConfig.id}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {fieldConfig.required && '*'} {fieldConfig.label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    typeof field.value.from !== 'undefined' ? (
                      `${format(field.value.from, 'PPP')}-${
                        field.value.to ? format(field.value.to, 'PPP') : ''
                      }`
                    ) : (
                      format(field.value, 'PPP')
                    )
                  ) : (
                    <span>{fieldConfig.placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode={fieldConfig.rangeMode ? 'range' : 'single'}
                selected={field.value}
                onSelect={field.onChange}
                numberOfMonths={fieldConfig.rangeMode ? 2 : 1}
                disabled={
                  disablePast
                    ? {
                        before: new Date(),
                      }
                    : false
                }
                // disabled={(date) =>
                //   (fieldConfig.minDate && date < fieldConfig.minDate) ||
                //   (fieldConfig.maxDate && date > fieldConfig.maxDate) ||
                //   false
                // }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fieldConfig.description && (
            <FormDescription>{fieldConfig.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
