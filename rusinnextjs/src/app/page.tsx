import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
              Task Manager
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Organize your tasks efficiently and boost your productivity with
              our simple yet powerful task management application.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row pt-4">
            <LoginButton />
          </div>
        </div>
      </main>
    </div>
  );
}
