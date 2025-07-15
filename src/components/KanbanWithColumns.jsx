import React, { useState, useEffect } from "react";
import { useTasks } from "../context/userTasks.jsx";
import Task from "./Task.jsx";

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

const COLUMN_DEFS = [
  { columnId: "todo", title: "To Do" },
  { columnId: "inprogress", title: "In Progress" },
  { columnId: "completed", title: "Completed" },
];
export default function KanbanWithDnD() {
  const { tasks, updateTaskOrder } = useTasks();

  const [items, setItems] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterTag, setFilterTag] = useState("");

  useEffect(() => {
    // Maintain order using IDs
    setItems(tasks.map((t) => t.id));
  }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      updateTaskOrder(newOrder); // Update task order in context
    }
  };

  // Filtering by priority or tag
  const visibleItems = items.filter((id) => {
  const task = tasks.find((t) => t.id === id);
  return (
    task &&
    (!filterPriority || task.priority === filterPriority) &&
    (!filterTag ||
      (task.tags || []).some((tag) =>
        tag.toLowerCase().includes(filterTag.toLowerCase())
      ))
  );
});



  return (
    <>
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {visibleItems.map((id) => {
              const task = tasks.find((t) => t.id === id);
              return task ? <Task key={task.id} task={task} /> : null;
            })}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
