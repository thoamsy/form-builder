import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { FieldList } from './FieldList';
import { FieldPalette } from './FieldPalette';
import { FormSettings } from './FormSettings';
import { FieldSettings } from './FieldSettings';
import { Eye, ListRestart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FormField } from '@/types/form';
import { IconButton } from '../icon-button';
import { TooltipProvider } from '@/components/ui/tooltip';

export function FormBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId),
  );
  const setActiveForm = useFormStore((state) => state.setActiveForm);
  const clearFields = useFormStore((state) => state.clearFields);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedField = useMemo(
    () => form?.fields.find((f) => f.id === selectedFieldId),
    [form?.fields, selectedFieldId],
  );

  useEffect(() => {
    if (formId) {
      setActiveForm(formId);
    }
  }, [formId, setActiveForm]);

  if (!form) {
    return <div>Form not found</div>;
  }

  const handleFieldSelect = (field: FormField) => {
    setSelectedFieldId(field.id);
  };

  return (
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
          formId={form.id}
          onFieldSelect={handleFieldSelect}
          selectedFieldId={selectedFieldId}
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
  );
}
