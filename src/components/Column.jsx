import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./Task.jsx";
import { useTasks } from "../context/userTasks.jsx";
import PropTypes from "prop-types";

export default function Column({ columnId, title }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const { tasks } = useTasks();
  const columnTasks = tasks.filter(t => t.status === columnId);

  return (
    <section
      ref={setNodeRef}
      className={`p-4 rounded shadow flex flex-col min-h-[300px] ${
        isOver ? "bg-blue-50" : "bg-white"
      }`}
    >
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-auto">
          {columnTasks.map(t => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>
      </section>
  );
}

Column.propTypes = {
  columnId: PropTypes.oneOf(["To Do", "In Progress", "Done"]).isRequired,
  title: PropTypes.oneOf(["To Do", "In Progress", "Done"]).isRequired,
};