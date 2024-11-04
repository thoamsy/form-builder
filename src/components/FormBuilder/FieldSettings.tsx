import { useFormStore } from '@/store/formStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FormField } from '@/types/form';
import { X, Trash } from 'lucide-react';
import { getFieldDefinition } from './fields/registry';

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

  const Config = getFieldDefinition(field.type).Config;

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
        <Config
          field={field}
          onUpdate={(updates) =>
            updateField(formId, field.id, { ...field, ...updates })
          }
        />
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Field
        </Button>
      </CardContent>
    </Card>
  );
}
