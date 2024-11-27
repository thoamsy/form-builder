import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { FieldConfigProps } from '../types';
import type { TextareaFieldProps } from './index';

export function TextareaFieldConfig({
  field,
  onUpdate,
}: FieldConfigProps<TextareaFieldProps>) {
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
        <Label>Rows</Label>
        <Input
          type="number"
          value={field.rows || ''}
          onChange={(e) =>
            onUpdate({
              rows: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Length</Label>
        <Input
          type="number"
          value={field.minLength || ''}
          onChange={(e) =>
            onUpdate({
              minLength: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Maximum Length</Label>
        <Input
          type="number"
          value={field.maxLength || ''}
          onChange={(e) =>
            onUpdate({
              maxLength: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
