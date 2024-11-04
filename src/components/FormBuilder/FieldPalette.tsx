import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckSquare, Calendar, ListFilter, Hash, Pen } from 'lucide-react';
import { useFormStore } from '@/store/formStore';

const FIELD_TYPES = [
  {
    type: 'text',
    label: 'Text Input',
    icon: Pen,
    defaultProps: {
      label: 'Text Field',
      required: false,
      placeholder: 'Enter text...',
    },
  },
  {
    type: 'number',
    label: 'Number Input',
    icon: Hash,
    defaultProps: {
      label: 'Number Field',
      required: false,
      placeholder: 'Enter number...',
    },
  },
  {
    type: 'select',
    label: 'Select',
    icon: ListFilter,
    defaultProps: {
      label: 'Select Field',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
      multiple: false,
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    defaultProps: {
      label: 'Checkbox Field',
      required: false,
    },
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: Calendar,
    defaultProps: {
      label: 'Date Field',
      required: false,
    },
  },
];

interface FieldPaletteProps {
  formId: string;
}

export function FieldPalette({ formId }: FieldPaletteProps) {
  const addField = useFormStore((state) => state.addField);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Types</CardTitle>
        <CardDescription>
          Drag and drop or click to add fields to your form
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {FIELD_TYPES.map((fieldType) => {
          const Icon = fieldType.icon;
          return (
            <Button
              key={fieldType.type}
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() =>
                addField(formId, {
                  type: fieldType.type,
                  ...fieldType.defaultProps,
                } as any)
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{fieldType.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
