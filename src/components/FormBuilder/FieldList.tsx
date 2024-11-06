import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableField } from './DraggableField';
import { RenderField } from '../FormPreview/RenderField';
import type { Form as StateForm, FormField } from '@/types/form';
import { useFormValidation } from '@/hooks/useFormValidation';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { forwardRef, Fragment, useCallback, useMemo } from 'react';
import { DROP_ZONE_ID } from '@/lib/constants';
import { DRAGGABLE_ITEM_ID } from './FieldPalette';
import { getFieldDefinition, type FieldTypes } from './fields/registry';
import { useFormStore } from '@/store/formStore';

interface FieldListProps {
  overItemId: string | null;
  form: StateForm;
  onFieldSelect: (field: FormField) => void;
  selectedFieldId: string | null;
  draggingIdFromPalette: string;
}

const renderDraggingPlaceholder = (id: string, formHook: any) => {
  if (id.startsWith(DRAGGABLE_ITEM_ID)) {
    return (
      <div className="w-full cursor-grabbing p-4 bg-inherit opacity-60 border shadow-lg">
        <Form {...formHook}>
          <RenderField
            field={{
              id: 'preview',
              type: id.replace(DRAGGABLE_ITEM_ID + '-', '') as FieldTypes,
              label: getFieldDefinition(id.replace(DRAGGABLE_ITEM_ID + '-', ''))
                .label,
              required: false,
            }}
            form={formHook}
          />
        </Form>
      </div>
    );
  }
  return null;
};

export const FieldList = forwardRef<HTMLDivElement, FieldListProps>(
  function FieldList(
    { onFieldSelect, selectedFieldId, draggingIdFromPalette, form, overItemId },
    ref,
  ) {
    const { formHook } = useFormValidation(form);
    const { setNodeRef, isOver } = useDroppable({
      id: DROP_ZONE_ID,
    });

    const ids = useMemo(() => {
      const fieldIds = form.fields.map((f) => f.id);
      return fieldIds;
    }, [form.fields]);

    const isDraggingFromPalette = draggingIdFromPalette !== '';
    const deleteField = useFormStore((state) => state.deleteField);

    // Combine refs
    const setRefs = useCallback(
      (element: HTMLDivElement | null) => {
        setNodeRef(element);
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref, setNodeRef],
    );

    return (
      <div
        ref={setRefs}
        className={cn(
          'transition-colors space-y-6 p-4 min-h-[600px] duration-200',
          isDraggingFromPalette && !isOver && 'bg-muted/50',
          isOver &&
            form.fields.length === 0 &&
            'bg-card/20 ring-2 ring-blue-400 rounded-lg ring-inset',
        )}
      >
        <Form {...formHook}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {form.fields.map((field) => {
              return (
                <Fragment key={field.id}>
                  {isDraggingFromPalette &&
                    overItemId === field.id &&
                    renderDraggingPlaceholder(draggingIdFromPalette, formHook)}
                  <DraggableField
                    field={field}
                    isSelected={field.id === selectedFieldId}
                    onClick={() => onFieldSelect(field)}
                    onRemove={() => deleteField(form.id, field.id)}
                  >
                    <RenderField key={field.id} field={field} form={formHook} />
                  </DraggableField>
                </Fragment>
              );
            })}
            {overItemId === DROP_ZONE_ID &&
              (form.fields.length !== 0 ? (
                renderDraggingPlaceholder(draggingIdFromPalette, formHook)
              ) : (
                <div className="h-32 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Drop field here</p>
                </div>
              ))}
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
            className="cursor-grabbing"
          >
            {renderDraggingPlaceholder(draggingIdFromPalette, formHook)}
          </DragOverlay>
        </Form>
      </div>
    );
  },
);

FieldList.displayName = 'FieldList';
