import React, { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext.jsx";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(data => {
    setTasks(prev => [
      ...prev,
      { id: uuidv4(), title: data.title, status: data.status || "todo" },
    ]);
  }, []);

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }, []);

  const updateTaskOrder = useCallback(reorderedColumnTasks => {
    if (!reorderedColumnTasks.length) return;
    const colId = reorderedColumnTasks[0].status;
    setTasks(prev => [
      ...prev.filter(t => t.status !== colId),
      ...reorderedColumnTasks
    ]);
  }, []);

  const value = useMemo(() => ({
    tasks, addTask, moveTask, updateTaskOrder
  }), [tasks, addTask, moveTask, updateTaskOrder]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
