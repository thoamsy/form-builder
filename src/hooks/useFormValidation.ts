import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Form } from '@/types/form';

export function useFormValidation(form: Form | undefined | null) {
  const validationSchema = useMemo(() => {
    if (!form) return z.object({});

    return z.object(
      form.fields.reduce<z.ZodRawShape>((acc, field) => {
        let schema:
          | z.ZodString
          | z.ZodNumber
          | z.ZodBoolean
          | z.ZodDate
          | z.ZodArray<z.ZodString>;

        switch (field.type) {
          case 'text': {
            let textSchema = z.string();
            if (field.required) {
              textSchema = textSchema.min(1, 'Required');
            }
            if ('minLength' in field && field.minLength) {
              textSchema = textSchema.min(
                field.minLength,
                `Minimum ${field.minLength} characters`,
              );
            }
            if ('maxLength' in field && field.maxLength) {
              textSchema = textSchema.max(
                field.maxLength,
                `Maximum ${field.maxLength} characters`,
              );
            }
            schema = textSchema;
            break;
          }

          case 'number': {
            let numberSchema = z.number();
            if (field.required) {
              numberSchema = numberSchema.min(1, 'Required');
            }
            if ('min' in field && field.min !== undefined) {
              numberSchema = numberSchema.min(field.min);
            }
            if ('max' in field && field.max !== undefined) {
              numberSchema = numberSchema.max(field.max);
            }
            schema = numberSchema;
            break;
          }

          case 'select': {
            if ('multiple' in field && field.multiple) {
              let arraySchema = z.array(z.string());
              if (field.required) {
                arraySchema = arraySchema.min(1, 'Required');
              }
              schema = arraySchema;
            } else {
              let selectSchema = z.string();
              if (field.required) {
                selectSchema = selectSchema.min(1, 'Required');
              }
              schema = selectSchema;
            }
            break;
          }

          case 'checkbox': {
            let checkboxSchema = z.boolean();
            if (field.required) {
              checkboxSchema = checkboxSchema.refine(
                (val) => val === true,
                'Required',
              );
            }
            schema = checkboxSchema;
            break;
          }

          case 'date': {
            let dateSchema = z.date();
            if (field.required) {
              dateSchema = dateSchema.refine((val) => val !== null, 'Required');
            }
            if ('minDate' in field && field.minDate) {
              dateSchema = dateSchema.min(field.minDate);
            }
            if ('maxDate' in field && field.maxDate) {
              dateSchema = dateSchema.max(field.maxDate);
            }
            schema = dateSchema;
            break;
          }

          default: {
            schema = z.string();
          }
        }

        return { ...acc, [field.id]: schema };
      }, {}),
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
