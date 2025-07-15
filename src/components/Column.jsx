import React from "react";
import { useTasks } from "../context/userTasks.jsx";
import TaskCard from "./Task.jsx";
import PropTypes from "prop-types";

export default function Column({ title, columnId }) {
  const { tasks, moveTask } = useTasks();
  

  
  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("text");
    if (taskId) {
      moveTask(taskId, columnId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const tasksInColumn = tasks.filter((task) => task.status === columnId);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-white p-4 rounded shadow min-h-[200px] w-full"
    >
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="space-y-2 mb-4">
        {tasksInColumn.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

Column.propTypes = {
  title: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
};
