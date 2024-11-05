import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableField } from './DraggableField';
import { RenderField } from '../FormPreview/RenderField';
import type { Form as StateForm, FormField } from '@/types/form';
import { useFormValidation } from '@/hooks/useFormValidation';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { useMemo } from 'react';
import { DROP_ZONE_ID } from '@/lib/constants';
import { DRAGGABLE_ITEM_ID } from './FieldPalette';
import { getFieldDefinition, type FieldTypes } from './fields/registry';
import { useFormStore } from '@/store/formStore';

interface FieldListProps {
  form: StateForm;
  onFieldSelect: (field: FormField) => void;
  selectedFieldId: string | null;
  draggingIdFromPalette: string;
  activeIndex: number;
}

const DropIndicator = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      style={style}
      ref={setNodeRef}
      className="h-44 bg-card rounded transition-all"
      {...attributes}
      {...listeners}
    />
  );
};

export function FieldList({
  onFieldSelect,
  selectedFieldId,
  draggingIdFromPalette,
  form,
  activeIndex,
}: FieldListProps) {
  const { formHook } = useFormValidation(form);
  const { setNodeRef, isOver } = useDroppable({
    id: DROP_ZONE_ID,
  });

  const ids = useMemo(() => {
    const fieldIds = form.fields.map((f) => f.id);
    if (draggingIdFromPalette) {
      fieldIds.splice(activeIndex, 0, draggingIdFromPalette);
    }
    return fieldIds;
  }, [form.fields, draggingIdFromPalette, activeIndex]);

  const isDraggingFromPalette = draggingIdFromPalette !== '';
  const deleteField = useFormStore((state) => state.deleteField);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors duration-200',
        isDraggingFromPalette && !isOver && 'bg-muted/50',
        isOver && 'bg-primary/10 ring-2 ring-primary ring-inset',
      )}
    >
      <Form {...formHook}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <form className="space-y-6 min-h-[600px] p-4">
            {ids.map((id) => {
              const field = form.fields.find((f) => f.id === id);

              if (!field) {
                if (form.fields.length !== 0) {
                  return <DropIndicator id={id} />;
                } else {
                  return null;
                }
              }

              return (
                <DraggableField
                  field={field}
                  isSelected={field.id === selectedFieldId}
                  key={id}
                  onClick={() => onFieldSelect(field)}
                  onRemove={() => deleteField(form.id, field.id)}
                >
                  <RenderField key={field.id} field={field} form={formHook} />
                </DraggableField>
              );
            })}
            {isDraggingFromPalette && form.fields.length === 0 && (
              <div className="h-32 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Drop field here</p>
              </div>
            )}
          </form>
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
          className="cursor-grabbing"
        >
          {isDraggingFromPalette && (
            <div className="w-full cursor-grabbing max-w-md p-4 bg-white border rounded-lg shadow-lg opacity-80">
              <Form {...formHook}>
                <RenderField
                  field={{
                    id: 'preview',
                    type: draggingIdFromPalette.replace(
                      DRAGGABLE_ITEM_ID + '-',
                      '',
                    ) as FieldTypes,
                    label: getFieldDefinition(
                      draggingIdFromPalette.replace(
                        DRAGGABLE_ITEM_ID + '-',
                        '',
                      ),
                    ).label,
                    required: false,
                  }}
                  form={formHook}
                />
              </Form>
            </div>
          )}
        </DragOverlay>
      </Form>
    </div>
  );
}
