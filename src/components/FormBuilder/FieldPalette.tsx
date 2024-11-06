import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllFieldTypes } from './fields/registry';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { GripVertical } from 'lucide-react';
import type { BaseFieldProps } from './fields/types';
import type { FieldDefinition } from './fields/types';
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
    },
  });

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      onClick={onClick}
      className={cn('h-20 relative flex-col gap-2 touch-none')}
      // onMouseDown={handleMouseDown}
    >
      <GripVertical
        {...attributes}
        {...listeners}
        className={cn(
          '!size-7 touch-none cursor-grab p-1 rounded hover:bg-card text-muted-foreground absolute top-2 right-2',

          isDragging && 'cursor-grabbing',
        )}
      />
      <Icon className="h-5 w-5" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export const FieldPalette = memo(function FieldPalette({
  onClick,
}: {
  onClick: (fieldDef: FieldDefinition<BaseFieldProps>) => void;
}) {
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
        {fieldTypes.map((fieldDef) => (
          <DraggableFieldButton
            key={fieldDef.type}
            type={fieldDef.type}
            label={fieldDef.label}
            icon={fieldDef.icon}
            onClick={() => onClick(fieldDef)}
          />
        ))}
      </CardContent>
    </Card>
  );
});
