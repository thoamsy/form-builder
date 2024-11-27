import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFormStore } from "@/store/formStore";
import { FieldList } from "./FieldList";
import { DRAGGABLE_ITEM_ID, FieldPalette } from "./FieldPalette";
import { FormSettings } from "./FormSettings";
import { FieldSettings } from "./FieldSettings";
import { Eye, ListRestart } from "lucide-react";
import type { FormField } from "@/types/form";
import { IconButton } from "../icon-button";
import { TooltipProvider } from "@/components/ui/tooltip";
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
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { getFieldDefinition, type FieldTypes } from "./fields/registry";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DROP_ZONE_ID } from "@/lib/constants";
import type { FieldDefinition } from "./fields/types";
import type { BaseFieldProps } from "./fields/types";
import { Separator } from "@/components/ui/separator";

const isDraggingFromPalette = (id: string) => String(id).startsWith(DRAGGABLE_ITEM_ID);

export function FormBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const form = useFormStore((state) => state.forms.find((f) => f.id === formId));
  const setActiveForm = useFormStore((state) => state.setActiveForm);
  const clearFields = useFormStore((state) => state.clearFields);
  const reorderFields = useFormStore((state) => state.reorderFields);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overItemId, setOverItemId] = useState<string | null>(null);

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

  function handleDragStart(event: DragStartEvent) {
    if (isDraggingFromPalette(String(event.active.id))) {
      setActiveId(event.active.id as string);
    } else {
      setActiveId(null);
    }
  }

  const isInFieldLists = (id: string) => {
    return form?.fields.some((f) => f.id === id);
  };

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over || !form) return;

    if (over.id === active.id) return;

    if ((activeId && isInFieldLists(String(over.id))) || over.id === DROP_ZONE_ID) {
      setOverItemId(String(over.id));
    } else {
      setOverItemId(null);
    }
  }

  const fieldListRef = useRef<HTMLDivElement>(null);
  const onPaletteClick = (fieldDef: FieldDefinition<BaseFieldProps>) => {
    if (!form) return;

    // 放在下一次 loop 执行
    requestAnimationFrame(() => {
      fieldListRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    const newField = addField(form.id, {
      type: fieldDef.type,
      label: fieldDef.label,
      required: false,
      ...fieldDef.defaultProps,
    });

    setSelectedFieldId(newField.id);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setOverItemId(null);

    if (!form || !over) return;

    const isDraggingFromPalette = String(active.id).startsWith(DRAGGABLE_ITEM_ID);
    // Handle dropping a new field from palette
    if (isDraggingFromPalette) {
      const fieldType = String(active.id).replace(DRAGGABLE_ITEM_ID + "-", "") as FieldTypes;
      const fieldDef = getFieldDefinition(fieldType);

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

      addField(
        form.id,
        {
          // TODO: 修复类型问题
          type: fieldType,
          label: fieldDef.label,
          required: false,
          ...fieldDef.defaultProps,
        },
        newIndex,
      ); // 在正确的位置添加字段
      return;
    }

    // Handle reordering existing fields
    if (isInFieldLists(String(active.id)) && String(active.id) !== String(over.id)) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(form.id, oldIndex, newIndex);
      }
    }

    setActiveId(null);
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

  const navigate = useNavigate();

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
      <div className="relative grid h-screen grid-cols-12">
        <div className="sticky top-0 col-span-3 overflow-y-auto">
          <FieldPalette onClick={onPaletteClick} />
        </div>

        <div className="col-span-6 h-full overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{form.title}</h1>
              {form.description && <p className="text-muted-foreground">{form.description}</p>}
            </div>
            <menu className="inline-flex items-center gap-2">
              <TooltipProvider delayDuration={300}>
                <IconButton
                  tooltip="Preview Form"
                  onClick={() => navigate("./preview", { relative: "path" })}
                  Icon={Eye}
                />
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
            overItemId={overItemId}
            ref={fieldListRef}
            form={form}
            onFieldSelect={handleFieldSelect}
            selectedFieldId={selectedFieldId}
            draggingIdFromPalette={activeId ?? ""}
          />
        </div>

        <div className="sticky top-0 col-span-3 overflow-y-auto">
          <FormSettings formId={form.id} />
          {selectedField ? (
            <>
              <Separator />
              <FieldSettings formId={form.id} field={selectedField} onClose={() => setSelectedFieldId(null)} />
            </>
          ) : null}
        </div>
      </div>
      <Outlet />
    </DndContext>
  );
}
