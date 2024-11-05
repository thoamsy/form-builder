import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFormStore } from '@/store/formStore';
import { getAllFieldTypes, type FieldTypes } from './fields/registry';
import type { BaseFieldProps } from './fields/types';

interface FieldPaletteProps {
  formId: string;
}

export function FieldPalette({ formId }: FieldPaletteProps) {
  const addField = useFormStore((state) => state.addField);
  const fieldTypes = getAllFieldTypes();

  return (
    <Card className="shadow-none border-none border-r-2">
      <CardHeader>
        <CardTitle>Field Types</CardTitle>
        <CardDescription>
          Drag and drop or click to add fields to your form
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {fieldTypes.map((fieldDef) => {
          const Icon = fieldDef.icon;
          return (
            <Button
              key={fieldDef.type}
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() =>
                addField(formId, {
                  type: fieldDef.type as FieldTypes,
                  ...fieldDef.defaultProps,
                } as BaseFieldProps)
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{fieldDef.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
