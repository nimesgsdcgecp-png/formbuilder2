export type FieldType = 'TEXT' | 'NUMERIC' | 'DATE' | 'BOOLEAN' | 'TEXTAREA';

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string; // Regex for text
}

export interface FormField {
  id: string; // Temporary UUID for the frontend
  type: FieldType;
  label: string;
  placeholder?: string;
  validation: ValidationRules;
  columnName: string; // The SQL column name (generated automatically)
}

export interface FormSchema {
  id?: number; // Null if new form
  title: string;
  description: string;
  targetTableName: string;
  fields: FormField[];
}