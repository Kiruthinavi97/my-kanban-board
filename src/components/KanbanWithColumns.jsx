import React from "react";
import Column from "./Column";
import TaskForm from "./TaskForm";
import TaskModal from "./TaskModal";
import { useTasks } from "../context/userTasks.jsx";
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

const columns = ["To Do", "In Progress", "Done"];

export default function Board() {
  const { tasks, updateTask, selectedTask, setSelectedTask } = useTasks();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const dragged = tasks.find((t) => t.id === active.id);
      const newStatus = over?.id;
      if (columns.includes(newStatus)) {
        updateTask({ ...dragged, status: newStatus });
      }
    }
  };

  return (
    <>
      <TaskForm />
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {columns.map((status) => (
            <Column key={status} status={status} />
          ))}
        </div>
      </DndContext>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </>
  );
}
