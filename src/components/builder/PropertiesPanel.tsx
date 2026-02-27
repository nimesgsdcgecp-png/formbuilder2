// src/components/builder/PropertiesPanel.tsx
'use client';

import { useFormStore } from '@/store/useFormStore';

export default function PropertiesPanel() {
  const { schema, selectedFieldId, updateField } = useFormStore();
  
  // Find the currently selected field object
  const selectedField = schema.fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <aside className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400">Select a field on the canvas to edit its properties.</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">Field Properties</h2>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {selectedField.type} Field
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Label Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Database Column Name (Read-Only or Editable) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Column Name (SQL)
          </label>
          <input
            type="text"
            value={selectedField.columnName}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500 text-sm font-mono cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">
            Auto-generated for database integrity.
          </p>
        </div>

        {/* Validation Rules */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Validation</h3>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedField.validation.required || false}
              onChange={(e) => 
                updateField(selectedField.id, { 
                  validation: { ...selectedField.validation, required: e.target.checked } 
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Required Field</span>
          </label>

          {/* Conditional Input based on type */}
          {selectedField.type === 'NUMERIC' && (
             <div className="grid grid-cols-2 gap-2">
               <div>
                 <label className="text-xs text-gray-500">Min</label>
                 <input 
                   type="number" 
                   className="w-full border p-1 rounded"
                   onChange={(e) => updateField(selectedField.id, {
                     validation: { ...selectedField.validation, min: parseInt(e.target.value) }
                   })}
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500">Max</label>
                 <input 
                   type="number" 
                   className="w-full border p-1 rounded"
                   onChange={(e) => updateField(selectedField.id, {
                     validation: { ...selectedField.validation, max: parseInt(e.target.value) }
                   })}
                 />
               </div>
             </div>
          )}
        </div>
      </div>
    </aside>
  );
}