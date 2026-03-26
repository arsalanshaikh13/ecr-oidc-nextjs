"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { ITask } from "@/models/Task";
import { can } from "@/lib/utils";

interface TasksContentProps {
  initialTasks: (ITask & { _id: string })[];
  user: User;
}

export default function TasksContent({
  initialTasks,
  user,
}: TasksContentProps) {
  const [tasks, setTasks] = useState<(ITask & { _id: string })[]>(initialTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleTaskCreated = (newTask: ITask) => {
    setTasks((prev) => [newTask as ITask & { _id: string }, ...prev]);
    setIsFormOpen(false);
  };

  const handleTaskUpdated = (updatedTask: ITask) => {
    setTasks((prev) =>
      prev.map((task) => {
        const taskId = (task as unknown as Record<string, unknown>)._id;
        const updatedId = (updatedTask as unknown as Record<string, unknown>)
          ._id;
        return taskId === updatedId
          ? (updatedTask as ITask & { _id: string })
          : task;
      }),
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) =>
      prev.filter((task) => {
        const id = (task as unknown as Record<string, unknown>)._id;
        return id !== taskId;
      }),
    );
  };

  return (
    <>
      {can(user, "create_task") && (
        <div className="flex gap-4">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isFormOpen ? "Close Form" : "Add New Task"}
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Create New Task
          </h2>
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onClose={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Your Tasks ({tasks.length})
        </h2>
        <TaskList
          tasks={tasks}
          user={user}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </div>
    </>
  );
}
