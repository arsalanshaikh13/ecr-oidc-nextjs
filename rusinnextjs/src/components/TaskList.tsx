"use client";

import { useState } from "react";
import { ITask } from "@/models/Task";
import {
  updateTaskAction,
  deleteTaskAction,
  toggleTaskCompletionAction,
} from "@/lib/task-actions";
import { can } from "@/lib/utils";

interface TaskListProps {
  tasks: (ITask & { _id: string })[];
  user: User;
  onTaskUpdated: (task: ITask) => void;
  onTaskDeleted: (taskId: string) => void;
}

interface EditFormData {
  name?: string;
  description?: string;
  dueDate?: string;
}

export default function TaskList({
  tasks,
  user,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleEditStart = (task: ITask) => {
    const taskId = (task as unknown as Record<string, string>)._id;
    setEditingId(taskId);
    setEditFormData({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (taskId: string) => {
    setIsLoading(taskId);
    try {
      const updated = await updateTaskAction(
        taskId,
        {
          name: editFormData.name,
          description: editFormData.description,
          dueDate: editFormData.dueDate,
        },
        user.id,
      );
      onTaskUpdated(updated);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleComplete = async (task: ITask) => {
    const taskId = (task as unknown as Record<string, string>)._id;
    setIsLoading(taskId);
    try {
      const updated = await toggleTaskCompletionAction(
        taskId,
        task.completed,
        user.id,
      );
      onTaskUpdated(updated);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(taskId);
    try {
      await deleteTaskAction(taskId, user.id);
      onTaskDeleted(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsLoading(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">
          No tasks yet. Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const taskId = (task as unknown as Record<string, string>)._id;
        const isEditing = editingId === taskId;

        return (
          <div
            key={taskId}
            className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
          >
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                  maxLength={500}
                  rows={2}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={
                    editFormData.dueDate
                      ? new Date(editFormData.dueDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSubmit(taskId)}
                    disabled={isLoading === taskId}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      disabled={isLoading === taskId}
                      className="flex-shrink-0"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        disabled={isLoading === taskId}
                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          task.completed
                            ? "text-zinc-500 dark:text-zinc-500 line-through"
                            : "text-zinc-900 dark:text-white"
                        }`}
                      >
                        {task.name}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {can(user, "update_tasks") && (
                    <button
                      onClick={() => handleEditStart(task)}
                      disabled={isLoading === taskId}
                      className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
                    >
                      Edit
                    </button>
                  )}
                  {can(user, "delete_tasks") && (
                    <button
                      onClick={() => handleDelete(taskId)}
                      disabled={isLoading === taskId}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
