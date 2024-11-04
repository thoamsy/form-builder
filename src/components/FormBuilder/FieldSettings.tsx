import { useFormStore } from '@/store/formStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { FormField } from '@/types/form';
import { X, Plus, Trash } from 'lucide-react';

interface FieldSettingsProps {
  formId: string;
  field: FormField;
  onClose: () => void;
}

export function FieldSettings({ formId, field, onClose }: FieldSettingsProps) {
  const updateField = useFormStore((state) => state.updateField);
  const deleteField = useFormStore((state) => state.deleteField);

  const handleDelete = () => {
    deleteField(formId, field.id);
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Field Settings</CardTitle>
          <CardDescription>Configure the selected field</CardDescription>
        </div>
        <Button
          className="size-7"
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={field.label}
            onChange={(e) =>
              updateField(formId, field.id, { label: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={field.description || ''}
            onChange={(e) =>
              updateField(formId, field.id, {
                description: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={field.required}
            onCheckedChange={(checked) =>
              updateField(formId, field.id, { required: checked })
            }
          />
        </div>

        {field.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) =>
                  updateField(formId, field.id, {
                    placeholder: e.target.value,
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
                  updateField(formId, field.id, {
                    minLength: parseInt(e.target.value) || undefined,
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
                  updateField(formId, field.id, {
                    maxLength: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </>
        )}

        {field.type === 'number' && (
          <>
            <div className="space-y-2">
              <Label>Minimum Value</Label>
              <Input
                type="number"
                value={field.min || ''}
                onChange={(e) =>
                  updateField(formId, field.id, {
                    min: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Value</Label>
              <Input
                type="number"
                value={field.max || ''}
                onChange={(e) =>
                  updateField(formId, field.id, {
                    max: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </>
        )}

        {field.type === 'select' && (
          <>
            <div className="space-y-2">
              <Label>Options</Label>
              {field.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...field.options];
                      newOptions[index] = {
                        ...option,
                        label: e.target.value,
                        value: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, '-'),
                      };
                      updateField(formId, field.id, {
                        options: newOptions,
                      });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = field.options.filter(
                        (_, i) => i !== index,
                      );
                      updateField(formId, field.id, {
                        options: newOptions,
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newOptions = [
                    ...field.options,
                    { label: 'New Option', value: 'new-option' },
                  ];
                  updateField(formId, field.id, { options: newOptions });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </>
        )}

        {field.type === 'date' && (
          <>
            <div className="space-y-2">
              <Label>Minimum Date</Label>
              <Input
                type="date"
                value={field.minDate?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  updateField(formId, field.id, {
                    minDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Date</Label>
              <Input
                type="date"
                value={field.maxDate?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  updateField(formId, field.id, {
                    maxDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </>
        )}

        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Field
        </Button>
      </CardContent>
    </Card>
  );
}
