import React, { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext.jsx";
import PropTypes from "prop-types";
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(data => {
    setTasks(prev => [
      ...prev,
      { 
        id: uuidv4(), 
        title: data.title,
        description: data.description || "",
        status: data.status || "todo",
        tags: data.tags || [],
        priority: data.priority || "medium",
        dueDate: data.dueDate || null,
        createdAt: new Date().toISOString()
      },
    ]);
  }, []);

  const updateTask = useCallback((updatedTask) => {
    setTasks(prev =>
      prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }, []);

  const updateTaskOrder = useCallback(reorderedIds => {
    if (!reorderedIds.length) return;
    
    setTasks(prev => {
      const taskMap = new Map(prev.map(task => [task.id, task]));
      const reorderedTasks = reorderedIds.map(id => taskMap.get(id)).filter(Boolean);
      const otherTasks = prev.filter(task => !reorderedIds.includes(task.id));
      return [...otherTasks, ...reorderedTasks];
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

