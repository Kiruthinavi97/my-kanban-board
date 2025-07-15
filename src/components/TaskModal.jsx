import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useTasks } from "../context/userTasks.jsx";

export default function TaskModal({ taskToEdit, onClose }) {
  const { addTask, updateTask, setSelectedTask } = useTasks();
  const isEdit = Boolean(taskToEdit);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (isEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "todo");
      setTags((taskToEdit.tags || []).join(", "));
      setPriority(taskToEdit.priority || "medium");
      setDueDate(taskToEdit.dueDate || "");
    }
  }, [isEdit, taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      priority,
      dueDate: dueDate || null,
    };

    if (isEdit) {
      updateTask({ ...taskToEdit, ...taskData });
      setSelectedTask(null);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  const handleCancel = () => {
    setSelectedTask(null);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Task" : "New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            className="w-full border p-2 rounded"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <select
            className="w-full border p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded text-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

TaskModal.propTypes = {
  taskToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.string,
    dueDate: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
