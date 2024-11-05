import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, TrashIcon } from 'lucide-react';
import type { FormField } from '@/types/form';
import { cn } from '@/lib/utils';
import { IconButton } from '../icon-button';
import { TooltipProvider } from '@radix-ui/react-tooltip';

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
          'relative flex flex-col transition-shadow duration-200',
          isDragging && 'z-50 shadow-lg opacity-50',
          isSelected && 'ring-2 ring-primary',
          className,
        )}
        style={style}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center flex-1">
            <div>
              <p className="font-medium">{field.label}</p>
              <p className="text-sm text-muted-foreground">{field.type}</p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
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
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </TooltipProvider>
  );
}
