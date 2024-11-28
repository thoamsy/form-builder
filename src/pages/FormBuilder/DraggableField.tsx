import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { GripVertical, TrashIcon } from 'lucide-react';
import type { FormField } from '@/types/form';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/icon-button';
import { TooltipProvider } from '@/components/ui/tooltip';

interface DraggableFieldProps {
  field: FormField;
  isSelected?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  onRemove?: () => void;
}

export function DraggableField({
  field,
  isSelected,
  className,
  children,
  onClick,
  onRemove,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card
        className={cn(
          'relative group p-4 flex flex-col transition-shadow duration-200',
          isDragging && 'z-50 shadow-xl opacity-80 ring-0!',
          isSelected && 'ring-2 ring-blue-400',
          className
        )}
        style={style}
        onClick={onClick}
      >
        <div className="flex-1">{children}</div>
        <menu className="flex bg-muted rounded-lg px-1 z-10 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1 items-center top-1 right-1">
          <IconButton
            variant="ghost"
            className="size-7 text-muted-foreground"
            tooltip="remove"
            Icon={TrashIcon}
            onClick={onRemove}
          />
          <div
            ref={setNodeRef}
            className="p-1.5 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing hover:text-primary"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </menu>
      </Card>
    </TooltipProvider>
  );
}
