import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Form } from '@/types/form';
import { getFieldDefinition } from '@/pages/FormBuilder/fields/registry';

export function useFormValidation(form: Form | undefined | null) {
  const validationSchema = useMemo(() => {
    if (!form) return z.object({});

    return z.object(
      form.fields.reduce((acc, field) => {
        const fieldDef = getFieldDefinition(field.type);
        return {
          ...acc,
          [field.id]: fieldDef.createSchema(field),
        };
      }, {})
    );
  }, [form]);

  const formHook = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
  });

  return {
    validationSchema,
    formHook,
  };
}
