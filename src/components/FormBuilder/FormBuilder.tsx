import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { FieldList } from './FieldList';
import { DRAGGABLE_ITEM_ID, FieldPalette } from './FieldPalette';
import { FormSettings } from './FormSettings';
import { FieldSettings } from './FieldSettings';
import { Eye, ListRestart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FormField } from '@/types/form';
import { IconButton } from '../icon-button';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragOverEvent,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { getFieldDefinition, type FieldTypes } from './fields/registry';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DROP_ZONE_ID } from '@/lib/constants';

const isDraggingFromPalette = (id: string) =>
  String(id).startsWith(DRAGGABLE_ITEM_ID);

export function FormBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId),
  );
  const setActiveForm = useFormStore((state) => state.setActiveForm);
  const clearFields = useFormStore((state) => state.clearFields);
  const reorderFields = useFormStore((state) => state.reorderFields);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const addField = useFormStore((state) => state.addField);

  const selectedField = useMemo(
    () => form?.fields.find((f) => f.id === selectedFieldId),
    [form?.fields, selectedFieldId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [activeIndex, setActiveIndex] = useState(-1);

  function handleDragStart(event: DragStartEvent) {
    // setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over || !form) return;

    // console.log(active.id, active.data.current, over);
    // 只处理从调色板拖拽的情况
    if (!active.data.current?.isTemplate) return;

    setActiveId(event.active.id as string);

    // 计算拖拽位置
    const overId = over.id;
    let newIndex;

    if (overId === DROP_ZONE_ID) {
      // 如果拖到了容器上，放在最后
      newIndex = form.fields.length;
    } else {
      // 如果拖到了某个字段上，获取该字段的索引
      newIndex = form.fields.findIndex((f) => f.id === overId);
      if (newIndex === -1) newIndex = form.fields.length;
    }

    setActiveIndex(newIndex);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setActiveIndex(-1);

    if (!form || !over) return;

    console.log(active.id, over.id);

    const isDraggingFromPalette = String(active.id).startsWith(
      DRAGGABLE_ITEM_ID,
    );
    // Handle dropping a new field from palette
    if (isDraggingFromPalette) {
      const fieldType = String(active.id).replace(
        DRAGGABLE_ITEM_ID + '-',
        '',
      ) as FieldTypes;
      const fieldDef = getFieldDefinition(fieldType);

      addField(
        form.id,
        {
          // TODO: 修复类型问题
          type: fieldType,
          label: fieldDef.label,
          required: false,
          ...fieldDef.defaultProps,
        },
        activeIndex,
      ); // 在正确的位置添加字段
      return;
    }

    // Handle reordering existing fields
    if (!active.data.current?.isTemplate && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(form.id, oldIndex, newIndex);
      }
    }
  }

  useEffect(() => {
    if (formId) {
      setActiveForm(formId);
    }
  }, [formId, setActiveForm]);

  useEffect(() => {
    if (!selectedField) {
      setSelectedFieldId(null);
    }
  }, [selectedField]);

  if (!form) {
    return <div>Form not found</div>;
  }

  const handleFieldSelect = (field: FormField) => {
    setSelectedFieldId(field.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="grid grid-cols-12 h-screen relative">
        <div className="col-span-3 sticky overflow-y-auto top-0">
          <FieldPalette formId={form.id} />
        </div>

        <div className="col-span-6 bg-gray-50 h-full p-6 overflow-y-auto">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{form.title}</h1>
              {form.description && (
                <p className="text-muted-foreground">{form.description}</p>
              )}
            </div>
            <menu className="inline-flex items-center gap-2">
              <TooltipProvider delayDuration={300}>
                <Link to={`/preview/${form.id}`}>
                  <IconButton tooltip="Preview Form" Icon={Eye} />
                </Link>
                <IconButton
                  tooltip="Clear Form"
                  onClick={() => {
                    clearFields(form.id);
                    setSelectedFieldId(null);
                  }}
                  Icon={ListRestart}
                />
              </TooltipProvider>
            </menu>
          </div>
          <FieldList
            form={form}
            onFieldSelect={handleFieldSelect}
            selectedFieldId={selectedFieldId}
            draggingIdFromPalette={activeId ?? ''}
            activeIndex={activeIndex}
          />
        </div>

        <div className="col-span-3 sticky top-0 overflow-y-auto">
          <FormSettings formId={form.id} />
          {selectedField ? (
            <FieldSettings
              formId={form.id}
              field={selectedField}
              onClose={() => setSelectedFieldId(null)}
            />
          ) : null}
        </div>
      </div>
    </DndContext>
  );
}
