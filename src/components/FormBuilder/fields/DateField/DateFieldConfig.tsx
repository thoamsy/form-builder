import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import type { FieldConfigProps } from '../types';
import type { DateFieldProps } from './index';

export function DateFieldConfig({
  field,
  onUpdate,
}: FieldConfigProps<DateFieldProps>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Label</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={field.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={field.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Required</Label>
        <Switch
          checked={field.required || false}
          onCheckedChange={(checked) => onUpdate({ required: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !field.minDate && 'text-muted-foreground',
              )}
            >
              {field.minDate ? (
                format(field.minDate, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.minDate}
              onSelect={(date) => onUpdate({ minDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Maximum Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !field.maxDate && 'text-muted-foreground',
              )}
            >
              {field.maxDate ? (
                format(field.maxDate, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.maxDate}
              onSelect={(date) => onUpdate({ maxDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
