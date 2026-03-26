"use client";

import { useState } from "react";
import { createTaskAction } from "@/lib/task-actions";
import { ITask } from "@/models/Task";

interface TaskFormProps {
  onTaskCreated: (task: ITask) => void;
  onClose?: () => void;
}

export default function TaskForm({ onTaskCreated, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newTask = await createTaskAction(formData);
      onTaskCreated(newTask);
      setFormData({ name: "", description: "", dueDate: "" });
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Task Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter task name"
          required
          maxLength={100}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
