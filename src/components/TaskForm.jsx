import React, { useState, useEffect } from "react";
import { useTasks } from "../context/userTasks.jsx";

export default function TaskForm() {
  const { addTask, updateTask, selectedTask, setSelectedTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // Prefill the form when editing
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || "");
      setDescription(selectedTask.description || "");
      setStatus(selectedTask.status || "todo");
      setTags((selectedTask.tags || []).join(", "));
      setPriority(selectedTask.priority || "medium");
      setDueDate(selectedTask.dueDate || "");
    }
  }, [selectedTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setTags("");
    setPriority("medium");
    setDueDate("");
    setSelectedTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      status,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      priority,
      dueDate: dueDate || null,
    };

    if (selectedTask) {
      updateTask({ ...selectedTask, ...taskData });
    } else {
      addTask(taskData);
    }

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />
         <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded w-full md:col-span-2"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {selectedTask ? "Update Task" : "Add Task"}
        </button>
        {selectedTask && (
          <button type="button" onClick={resetForm} className="bg-gray-300 text-black px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
