// src/app/builder/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Router
import { 
  DndContext, 
  DragOverlay, 
  DragStartEvent, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCorners
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFormStore } from '@/store/useFormStore';
import { FieldType } from '@/types/schema';
import { saveForm } from '@/services/api'; // Import the API function

// Components
import Sidebar, { FIELD_TYPES } from '@/components/builder/Sidebar';
import { SidebarBtnOverlay } from '@/components/builder/DraggableSidebarBtn';
import Canvas from '@/components/builder/Canvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import { SortableField } from '@/components/builder/SortableField';

export default function BuilderPage() {
  const router = useRouter();
  const { schema, addField, reorderFields } = useFormStore();
  
  // State
  const [activeSidebarItem, setActiveSidebarItem] = useState<FieldType | null>(null);
  const [activeCanvasItemId, setActiveCanvasItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Loading state

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // --- NEW: Handle Save ---
  const handlePublish = async () => {
    if (schema.fields.length === 0) {
      alert("You cannot publish an empty form!");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveForm(schema);
      alert(`Success! Form "${result.title}" published with ID: ${result.id}`);
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Failed to publish form. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // ... (handleDragStart and handleDragEnd remain the same) ...
  const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      const activeData = active.data.current;
  
      if (activeData?.isSidebarBtn) {
        setActiveSidebarItem(activeData.type);
        setActiveCanvasItemId(null);
        return;
      }
      
      setActiveSidebarItem(null);
      setActiveCanvasItemId(active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      
      setActiveSidebarItem(null);
      setActiveCanvasItemId(null);
  
      if (!over) return;
  
      const activeData = active.data.current;
      if (activeData?.isSidebarBtn) {
        if (over.id === 'canvas-droppable' || schema.fields.some(f => f.id === over.id)) {
          addField(activeData.type);
        }
        return;
      }
  
      if (active.id !== over.id) {
        const oldIndex = schema.fields.findIndex((f) => f.id === active.id);
        const newIndex = schema.fields.findIndex((f) => f.id === over.id);
        reorderFields(arrayMove(schema.fields, oldIndex, newIndex));
      }
  };


  // Helper to render Overlay
  const renderOverlay = () => {
    if (activeSidebarItem) {
      const tool = FIELD_TYPES.find(t => t.type === activeSidebarItem);
      return tool ? <SidebarBtnOverlay label={tool.label} icon={tool.icon} /> : null;
    }
    if (activeCanvasItemId) {
      const field = schema.fields.find(f => f.id === activeCanvasItemId);
      return field ? (
        <div className="opacity-80 rotate-2 pointer-events-none">
          <SortableField 
            field={field} 
            onRemove={() => {}} 
            onSelect={() => {}} 
            isSelected={false} 
          />
        </div>
      ) : null;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 h-full">
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
            <h1 className="font-bold text-gray-800">Form Builder</h1>
            
            {/* --- UPDATED BUTTON --- */}
            <button 
              onClick={handlePublish}
              disabled={isSaving}
              className={`px-4 py-2 text-white text-sm font-medium rounded shadow-sm transition-colors
                ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
            >
              {isSaving ? 'Publishing...' : 'Save & Publish'}
            </button>
          </header>
          
          <Canvas />
        </main>
        
        <PropertiesPanel />
        
        <DragOverlay>
          {renderOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
}