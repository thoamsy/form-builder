import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RenderField } from './RenderField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { toast } from 'sonner';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

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
    const formattedData = Object.fromEntries(
      Object.entries(data).map(([id, value]) => {
        const field = form!.fields.find((f) => f.id === id);
        return [field?.label ?? 'Unknown Field', value];
      }),
    );

    toast.success(
      <pre className="break-all whitespace-break-spaces">
        {JSON.stringify(formattedData, null, 2)}
      </pre>,
    );
  }

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{form.title}</DrawerTitle>
          {form.description && (
            <DrawerDescription>{form.description}</DrawerDescription>
          )}
        </DrawerHeader>

        <div className="p-4">
          <Form {...formHook}>
            <form
              onSubmit={formHook.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {form.fields.map((field) => (
                <RenderField key={field.id} field={field} form={formHook} />
              ))}
              <DrawerFooter>
                <Button type="submit">Submit</Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </div>
    </DrawerContent>
  );
}
