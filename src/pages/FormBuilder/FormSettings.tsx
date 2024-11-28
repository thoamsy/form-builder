import { useFormStore } from '@/store/formStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormSettingsProps {
  formId: string;
}

export function FormSettings({ formId }: FormSettingsProps) {
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId)
  );
  const updateForm = useFormStore((state) => state.updateForm);

  if (!form) return null;

  return (
    <Card className="shadow-none border-none border-l-2">
      <CardHeader className="">
        <CardTitle>Form Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => updateForm(formId, { title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description || ''}
            onChange={(e) =>
              updateForm(formId, { description: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
