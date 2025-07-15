import React from "react";
import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "../context/userTasks.jsx";

export default function TaskCard({ task }) {
  const { deleteTask, setSelectedTask } = useTasks();
  const { id, title, description, tags = [], priority, dueDate } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;

  let priorityClass = "text-green-600";
  if (priority === "high") priorityClass = "text-red-600";
  else if (priority === "medium") priorityClass = "text-yellow-600";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded shadow relative ${isOverdue ? "border-2 border-red-500" : ""}`}
    >
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="absolute top-2 left-2 cursor-grab text-gray-600"
        aria-label="Drag"
      >
        ≡
      </button>

      <div className="pl-8">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm">
          {priority && (
            <span className={`font-semibold ${priorityClass}`}>
              Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          )}
          {dueDate && (
            <span className={isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}>
              Due: {dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTask(task);
          }}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(id);
          }}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
};
