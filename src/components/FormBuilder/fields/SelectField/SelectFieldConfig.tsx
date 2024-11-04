import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import type { FieldConfigProps } from '../types';
import type { SelectFieldProps, SelectOption } from './index';

export function SelectFieldConfig({
  field,
  onUpdate,
}: FieldConfigProps<SelectFieldProps>) {
  const addOption = () => {
    const newOption: SelectOption = {
      label: `Option ${field.options.length + 1}`,
      value: `option-${field.options.length + 1}`,
    };
    onUpdate({ options: [...field.options, newOption] });
  };

  const removeOption = (index: number) => {
    const newOptions = [...field.options];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, updates: Partial<SelectOption>) => {
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ options: newOptions });
  };

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

      <div className="flex items-center justify-between">
        <Label>Multiple Selection</Label>
        <Switch
          checked={field.multiple || false}
          onCheckedChange={(checked) => onUpdate({ multiple: checked })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Options</Label>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {field.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Label"
                value={option.label}
                onChange={(e) => updateOption(index, { label: e.target.value })}
              />
              <Input
                placeholder="Value"
                value={option.value}
                onChange={(e) => updateOption(index, { value: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
