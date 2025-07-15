import React from "react";
import { TaskProvider } from "./context/TaskProvider.jsx";
import TaskForm from "./components/TaskForm.jsx";
import Column from "./components/Column.jsx";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useTasks } from "./context/userTasks.jsx";

const COLUMN_DEFS = [
  { columnId: "todo", title: "To Do" },
  { columnId: "inprogress", title: "In Progress" },
  { columnId: "completed", title: "Completed" },
];

function KanbanBoard() {
  const { tasks, updateTaskOrder } = useTasks();
  const sensors = useSensors(useSensor(PointerSensor));
  const items = tasks.map((t) => t.id);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    updateTaskOrder(newItems);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMN_DEFS.map(({ columnId, title }) => (
            <Column key={columnId} title={title} columnId={columnId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Kanban Task Board
        </h1>
        <TaskForm />
        <KanbanBoard />
      </div>
    </TaskProvider>
  );
}
