import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { FieldConfigProps } from '../types';
import type { CheckboxFieldProps } from './index';

export function CheckboxFieldConfig({
  field,
  onUpdate,
}: FieldConfigProps<CheckboxFieldProps>) {
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

      <div className="flex items-center justify-between">
        <Label>Required</Label>
        <Switch
          checked={field.required || false}
          onCheckedChange={(checked) => onUpdate({ required: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Default Checked</Label>
        <Switch
          checked={field.defaultChecked || false}
          onCheckedChange={(checked) => onUpdate({ defaultChecked: checked })}
        />
      </div>
    </div>
  );
}
