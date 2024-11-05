import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFormStore } from '@/store/formStore';
import { getAllFieldTypes } from './fields/registry';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface DraggableFieldButtonProps {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export const DRAGGABLE_ITEM_ID = 'field-palette';

function DraggableFieldButton({
  type,
  label,
  icon: Icon,
  onClick,
}: DraggableFieldButtonProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${DRAGGABLE_ITEM_ID}-${type}`,
    data: {
      type,
      isTemplate: true,
    },
  });

  const handleMouseDown = () => {
    const start = Date.now();

    const handleMouseUp = () => {
      const duration = Date.now() - start;
      if (duration < 200) {
        onClick();
      }
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={cn(
        'h-20 flex-col gap-2 touch-none',
        isDragging && 'opacity-50 cursor-grabbing',
      )}
      // onMouseDown={handleMouseDown}
      {...attributes}
      {...listeners}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export const FieldPalette = memo(function FieldPalette({
  formId,
}: {
  formId: string;
}) {
  const fieldTypes = getAllFieldTypes();
  const addField = useFormStore((state) => state.addField);

  return (
    <Card className="shadow-none border-none border-r-2">
      <CardHeader>
        <CardTitle>Field Types</CardTitle>
        <CardDescription>
          Drag and drop or click to add fields to your form
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {fieldTypes.map((fieldDef) => (
          <DraggableFieldButton
            key={fieldDef.type}
            type={fieldDef.type}
            label={fieldDef.label}
            icon={fieldDef.icon}
            onClick={() => {
              return addField(formId, {
                type: fieldDef.type,
                label: fieldDef.label,
                required: false,
                ...fieldDef.defaultProps,
              });
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
});
