import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormStore } from '@/store/formStore';
import { DraggableField } from './DraggableField';
import { Form } from '@/components/ui/form';
import { RenderField } from '../FormPreview/RenderField';
import type { FormField } from '@/types/form';
import { useFormValidation } from '@/hooks/useFormValidation';

interface FieldListProps {
  formId: string;
  onFieldSelect: (field: FormField) => void;
  selectedFieldId: string | null;
}

export function FieldList({
  formId,
  onFieldSelect,
  selectedFieldId,
}: FieldListProps) {
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId),
  );
  const reorderFields = useFormStore((state) => state.reorderFields);
  const { formHook } = useFormValidation(form);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!form) return null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      reorderFields(formId, oldIndex, newIndex);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={form.fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <Form {...formHook}>
          <form className="space-y-6">
            {form.fields.map((field) => (
              <div
                key={field.id}
                className="relative flex flex-col gap-2"
                onClick={() => onFieldSelect(field)}
              >
                <DraggableField
                  field={field}
                  isSelected={field.id === selectedFieldId}
                />
                <RenderField key={field.id} field={field} form={formHook} />
              </div>
            ))}
          </form>
        </Form>
      </SortableContext>
    </DndContext>
  );
}
