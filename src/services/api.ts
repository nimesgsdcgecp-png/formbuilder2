// src/services/api.ts
import { FormSchema } from '@/types/schema';

const API_BASE_URL = 'http://localhost:8080/api';

export const saveForm = async (schema: FormSchema) => {
  // 1. Map Frontend Schema to Backend DTO
  // The backend expects "required" as a top-level boolean, but our frontend stores it inside "validation"
  const payload = {
    title: schema.title,
    description: schema.description,
    fields: schema.fields.map((field) => ({
      label: field.label,
      type: field.type,
      required: field.validation?.required || false, // Extract required
      validation: {
        ...field.validation,
        required: undefined, // Remove it from the validation map since we sent it separately
      },
    })),
  };

  // 2. Send Request
  const response = await fetch(`${API_BASE_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to save form');
  }

  return response.json();
};