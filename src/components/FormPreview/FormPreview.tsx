import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RenderField } from './RenderField';
import { useFormValidation } from '@/hooks/useFormValidation';

export function FormPreview() {
  const { formId } = useParams<{ formId: string }>();
  const form = useFormStore((state) =>
    state.forms.find((f) => f.id === formId),
  );

  const { formHook, validationSchema } = useFormValidation(form);

  if (!form) {
    return <div>Form not found</div>;
  }

  function onSubmit(data: z.infer<typeof validationSchema>) {
    console.log(data);
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">{form.title}</h1>
        {form.description && (
          <p className="mb-6 text-muted-foreground">{form.description}</p>
        )}

        <Form {...formHook}>
          <form
            onSubmit={formHook.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {form.fields.map((field) => (
              <RenderField key={field.id} field={field} form={formHook} />
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
