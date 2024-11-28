import { create } from 'zustand';
import type { Form } from '@/types/form';

interface PreviewStore {
  isOpen: boolean;
  form: Form | null;
  openPreview: (form: Form) => void;
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  isOpen: false,
  form: null,
  openPreview: (form) => set({ isOpen: true, form }),
  closePreview: () => set({ isOpen: false, form: null }),
}));

export function usePreview() {
  const { openPreview, closePreview } = usePreviewStore();
  return { openPreview, closePreview };
}
