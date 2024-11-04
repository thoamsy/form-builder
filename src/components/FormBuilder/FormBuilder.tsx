import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { FieldList } from './FieldList';
import { FieldPalette } from './FieldPalette';
import { FormSettings } from './FormSettings';
import { FieldSettings } from './FieldSettings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FormField } from '@/types/form';

export function FormBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId),
  );
  const setActiveForm = useFormStore((state) => state.setActiveForm);
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
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{form.title}</h1>
        <Link to={`/preview/${form.id}`}>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <FieldList
              formId={form.id}
              onFieldSelect={handleFieldSelect}
              selectedFieldId={selectedFieldId}
            />
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <FormSettings formId={form.id} />
          {selectedField ? (
            <FieldSettings
              formId={form.id}
              field={selectedField}
              onClose={() => setSelectedFieldId(null)}
            />
          ) : (
            <FieldPalette formId={form.id} />
          )}
        </div>
      </div>
    </div>
  );
}
