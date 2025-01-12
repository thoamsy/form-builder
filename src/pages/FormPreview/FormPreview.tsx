import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RenderField } from './RenderField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { toast } from 'sonner';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  Drawer,
} from '@/components/ui/drawer';
import { usePreviewStore } from '@/hooks/usePreview';

export default function FormPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, form, closePreview } = usePreviewStore();

  const { formHook, validationSchema } = useFormValidation(form);

  function onSubmit(data: z.infer<typeof validationSchema>) {
    const formattedData = Object.fromEntries(
      Object.entries(data).map(([id, value]) => {
        const field = form!.fields.find((f) => f.id === id);
        return [field?.label ?? 'Unknown Field', value];
      })
    );

    toast.success(
      <pre className="whitespace-break-spaces break-all">
        {JSON.stringify(formattedData, null, 2)}
      </pre>
    );
  }

  return (
    <Drawer
      setBackgroundColorOnScale={false}
      open={isOpen}
      onOpenChange={(state) => {
        if (!state) {
          closePreview();
        }
      }}
    >
      {children}
      <DrawerContent className="min-h-[50vh]">
        {form && (
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>{form.title}</DrawerTitle>
              {form.description && (
                <DrawerDescription>{form.description}</DrawerDescription>
              )}
            </DrawerHeader>

            <Form {...formHook}>
              <ScrollArea className="h-[50vh]">
                <form
                  onSubmit={formHook.handleSubmit(onSubmit)}
                  className="space-y-6 px-4"
                >
                  {form.fields.map((field) => (
                    <RenderField key={field.id} field={field} form={formHook} />
                  ))}
                  <DrawerFooter>
                    <Button type="submit">Submit</Button>
                  </DrawerFooter>
                </form>
              </ScrollArea>
            </Form>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
