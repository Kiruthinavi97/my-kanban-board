import React from "react";
import { TaskProvider } from "./context/TaskProvider.jsx";
import TaskForm from "./components/TaskForm.jsx";
import Column from "./components/Column.jsx";
import { useTasks } from "./context/userTasks.jsx";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

const COLUMN_DEFS = [
  { columnId: "todo", title: "To Do" },
  { columnId: "inprogress", title: "In Progress" },
  { columnId: "completed", title: "Completed" },
];

function KanbanBoard() {
  const { tasks, moveTask, updateTaskOrder } = useTasks();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    if (COLUMN_DEFS.some(col => col.columnId === over.id)) {
      // Moving to a different column
      if (activeTask.status !== over.id) {
        moveTask(active.id, over.id);
      }
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find(task => task.id === over.id);
    if (overTask) {
      // If moving to a different column
      if (activeTask.status !== overTask.status) {
        moveTask(active.id, overTask.status);
      } else {
        // Reordering within the same column
        const columnTasks = tasks.filter(task => task.status === activeTask.status);
        const oldIndex = columnTasks.findIndex(task => task.id === active.id);
        const newIndex = columnTasks.findIndex(task => task.id === over.id);
        
        if (oldIndex !== newIndex) {
          const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
          updateTaskOrder(reorderedTasks.map(task => task.id));
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMN_DEFS.map(({ columnId, title }) => (
          <Column key={columnId} title={title} columnId={columnId} />
        ))}
      </div>
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
