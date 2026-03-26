import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTasksAction } from "@/lib/task-actions";
import { ITask } from "@/models/Task";

export default async function Dashboard() {
  // Get session on the server
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/");
  }

  const userId = session.user.id;

  // Fetch tasks to calculate stats
  let tasks: ITask[] = [];
  try {
    tasks = await getTasksAction(userId);
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to your task management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Tasks Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Total Tasks
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                {totalTasks}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 1 1 0 000-2 4 4 0 00-4 4v9a4 4 0 004 4h12a4 4 0 004-4V5a1 1 0 000 2 2 2 0 012 2v9a6 6 0 01-6 6H6a6 6 0 01-6-6V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Completed Tasks
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                {completedTasks}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Link */}
      <Link
        href="/tasks"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        View All Tasks
      </Link>
    </div>
  );
}
