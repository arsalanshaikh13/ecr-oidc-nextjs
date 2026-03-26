import Link from "next/link";
import Navigation from "@/components/Navigation";
import SettingsForm from "@/components/SettingsForm";
import { verifySession } from "@/lib/dal";

export default async function Settings() {
  const { user } = await verifySession();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                Settings
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Manage your account and profile information
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <SettingsForm user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
