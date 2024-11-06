import { create, type StateCreator } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import type { Form, FormField } from '@/types/form';
import { arrayMove } from '@dnd-kit/sortable';

interface FormState {
  forms: Form[];
  activeFormId: string | null;
}

interface FormActions {
  addForm: (title: string, description?: string) => Form;
  updateForm: (
    formId: string,
    updates: Partial<Omit<Form, 'id' | 'fields'>>,
  ) => void;
  deleteForm: (formId: string) => void;
  setActiveForm: (formId: string) => void;
  addField: (
    formId: string,
    field: Omit<FormField, 'id'>,
    index?: number,
  ) => FormField;
  clearFields: (formId: string) => void;
  updateField: (
    formId: string,
    fieldId: string,
    updates: Partial<Omit<FormField, 'id' | 'type'>>,
  ) => void;
  deleteField: (formId: string, fieldId: string) => void;
  reorderFields: (formId: string, startIndex: number, endIndex: number) => void;
}

type FormStore = FormState & FormActions;

type FormStorePersist = (
  config: StateCreator<FormStore, [], []>,
  options: {
    name: string;
    storage?: StateStorage;
  },
) => StateCreator<FormStore, [], []>;

const storeCreator: StateCreator<FormStore, [], []> = (set) => ({
  forms: [],
  activeFormId: null,

  addForm: (title: string, description?: string) => {
    const newForm: Form = {
      id: uuidv4(),
      title,
      description,
      fields: [],
    };

    set(
      produce((state: FormStore) => {
        state.forms.push(newForm);
        state.activeFormId = newForm.id;
      }),
    );
    return newForm;
  },

  updateForm: (
    formId: string,
    updates: Partial<Omit<Form, 'id' | 'fields'>>,
  ) => {
    set(
      produce((state: FormStore) => {
        const form = state.forms.find((form) => form.id === formId);
        if (form) {
          Object.assign(form, updates);
        }
      }),
    );
  },

  deleteForm: (formId: string) => {
    set(
      produce((state: FormStore) => {
        state.forms = state.forms.filter((form) => form.id !== formId);
        if (state.activeFormId === formId) {
          state.activeFormId = null;
        }
      }),
    );
  },

  setActiveForm: (formId: string) => {
    set(
      produce((state: FormStore) => {
        state.activeFormId = formId;
      }),
    );
  },

  addField: (
    formId: string,
    field: Omit<FormField, 'id'>,
    index?: number,
  ): FormField => {
    const newField: FormField = {
      ...field,
      id: uuidv4(),
    };

    set(
      produce((state: FormState) => {
        const formIndex = state.forms.findIndex((f) => f.id === formId);
        if (formIndex === -1) return state;

        const form = state.forms[formIndex];

        if (typeof index === 'number' && index >= 0) {
          // 在指定位置插入
          form.fields.splice(index, 0, newField);
        } else {
          // 添加到末尾
          form.fields.push(newField);
        }
      }),
    );

    return newField;
  },

  updateField: (
    formId: string,
    fieldId: string,
    updates: Partial<Omit<FormField, 'id' | 'type'>>,
  ) => {
    set(
      produce((state: FormStore) => {
        const form = state.forms.find((form) => form.id === formId);
        if (form) {
          const field = form.fields.find((field) => field.id === fieldId);
          if (field) {
            Object.assign(field, updates);
          }
        }
      }),
    );
  },

  deleteField: (formId: string, fieldId: string) => {
    set(
      produce((state: FormStore) => {
        const form = state.forms.find((form) => form.id === formId);
        if (form) {
          form.fields = form.fields.filter((field) => field.id !== fieldId);
        }
      }),
    );
  },

  clearFields: (formId: string) => {
    set(
      produce((state: FormStore) => {
        const form = state.forms.find((form) => form.id === formId);
        if (form) {
          form.fields = [];
        }
      }),
    );
  },

  reorderFields: (formId: string, oldIndex: number, newIndex: number) => {
    set(
      produce<FormState>((state) => {
        const form = state.forms.find((form) => form.id === formId);
        if (form) {
          form.fields = arrayMove(form.fields, oldIndex, newIndex);
        }
      }),
    );
  },
});

export const useFormStore = create<FormStore>()(
  persist(storeCreator, {
    name: 'form-builder-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state: FormStore) => ({
      forms: state.forms,
    }),
    version: 1,
  }),
);
