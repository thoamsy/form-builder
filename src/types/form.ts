// form-builder/src/types/form.ts
import type { FieldTypes } from "@/components/FormBuilder/fields/registry";
import type { BaseFieldProps } from "@/components/FormBuilder/fields/types";

export interface FormField extends BaseFieldProps {
  id: string;
  type: FieldTypes;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
