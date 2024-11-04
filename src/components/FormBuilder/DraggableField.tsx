import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { GripVertical, Settings } from 'lucide-react';
import type { FormField } from '@/types/form';
import { cn } from '@/lib/utils';

interface DraggableFieldProps {
  field: FormField;
  isSelected?: boolean;
  className?: string;
}

export function DraggableField({ field, isSelected, className }: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative flex items-center justify-between p-4',
        isDragging && 'z-50 shadow-lg',
        isSelected && 'ring-2 ring-primary',
        className
      )}
    >
      <div className="flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="mr-4 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{field.label}</p>
          <p className="text-sm text-muted-foreground">{field.type}</p>
        </div>
      </div>
      <Settings className="h-4 w-4 text-muted-foreground" />
    </Card>
  );
}