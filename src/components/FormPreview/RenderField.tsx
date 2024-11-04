import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { FormField as TFormField } from '@/types/form';
interface RenderFieldProps {
  field: TFormField;
  form: UseFormReturn<any>;
}

export function RenderField({ field, form }: RenderFieldProps) {
  const isInlineLayout = field.type === 'checkbox';

  return (
    <FormField
      control={form.control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          {!isInlineLayout && (
            <FormLabel className="leading-none">
              {field.required && '*'}
              {field.label}
            </FormLabel>
          )}
          <FormControl>
            {(() => {
              switch (field.type) {
                case 'text':
                  return (
                    <Input placeholder={field.placeholder} {...formField} />
                  );
                case 'number':
                  return (
                    <Input
                      type="number"
                      placeholder={field.placeholder}
                      {...formField}
                      onChange={(e) => {
                        formField.onChange(Number(e.target.value));
                      }}
                    />
                  );
                case 'select':
                  return (
                    <Select
                      onValueChange={formField.onChange}
                      value={formField.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'checkbox':
                  return (
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                    />
                  );
                case 'date':
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !formField.value && 'text-muted-foreground',
                          )}
                        >
                          {formField.value ? (
                            format(formField.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formField.value}
                          onSelect={formField.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  );
                default:
                  return null;
              }
            })()}
          </FormControl>

          {isInlineLayout && (
            <div className="space-y-1 leading-none">
              <FormLabel className="">
                {field.required && '*'} {field.label}
              </FormLabel>
              {field.description && (
                <FormDescription>{field.description}</FormDescription>
              )}
            </div>
          )}
          {!isInlineLayout && field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
