// src/store/useFormStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FormSchema, FieldType } from '@/types/schema';

interface FormState {
  schema: FormSchema;
  selectedFieldId: string | null;

  // Actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void; // <--- NEW ACTION
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  selectField: (id: string | null) => void;
  reorderFields: (newOrder: FormField[]) => void;
}

export const useFormStore = create<FormState>((set) => ({
  schema: {
    title: 'Untitled Form',
    description: '',
    targetTableName: '',
    fields: [],
  },
  selectedFieldId: null,

  setTitle: (title) => 
    set((state) => ({ schema: { ...state.schema, title } })),

  // <--- NEW IMPLEMENTATION
  setDescription: (description) => 
    set((state) => ({ schema: { ...state.schema, description } })),

  addField: (type) => 
    set((state) => {
      const newField: FormField = {
        id: uuidv4(),
        type,
        label: `New ${type} Field`,
        columnName: `field_${Date.now()}`,
        validation: { required: false },
      };
      return { 
        schema: { ...state.schema, fields: [...state.schema.fields, newField] },
        selectedFieldId: newField.id 
      };
    }),

  removeField: (id) =>
    set((state) => ({
      schema: {
        ...state.schema,
        fields: state.schema.fields.filter((f) => f.id !== id),
      },
      selectedFieldId: null,
    })),

  updateField: (id, updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        fields: state.schema.fields.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        ),
      },
    })),

  selectField: (id) => set({ selectedFieldId: id }),
  
  reorderFields: (newOrder) => 
    set((state) => ({ schema: { ...state.schema, fields: newOrder } })),
}));