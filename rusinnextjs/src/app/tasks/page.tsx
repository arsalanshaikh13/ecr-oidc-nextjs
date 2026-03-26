import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Navigation from "@/components/Navigation";
import TasksContent from "@/components/TasksContent";
import { getTasksAction } from "@/lib/task-actions";
import { auth } from "@/lib/auth";
import { ITask } from "@/models/Task";

export default async function Tasks() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;
  const userId = user.id;

  let tasks: (ITask & { _id: string })[] = [];
  try {
    tasks = (await getTasksAction(user.id)) as (ITask & { _id: string })[];
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                Tasks
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Manage your tasks here
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>

          <TasksContent initialTasks={tasks} user={user} />
        </div>
      </main>
    </div>
  );
}
