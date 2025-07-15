import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext.jsx";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((data) => {
    setTasks(prev => [
      ...prev,
      {
        id: uuidv4(),
        title: data.title || "",
        description: data.description || "",
        status: data.status || "todo",
        tags: data.tags || [],
        priority: data.priority || "medium",
        dueDate: data.dueDate || "",
      }
    ]);
  }, []);

  const updateTask = useCallback(updated => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  }, []);

  const deleteTask = useCallback(id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }, []);

  const updateTaskOrder = useCallback(newOrder => {
    setTasks(prev => {
      const map = Object.fromEntries(prev.map(t => [t.id, t]));
      return newOrder.map(id => map[id]).filter(Boolean);
    });
  }, []);

  const value = useMemo(() => ({
    tasks,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    updateTaskOrder
  }), [tasks, selectedTask, addTask, updateTask, deleteTask, moveTask, updateTaskOrder]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
