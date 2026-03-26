import Navigation from "@/components/Navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
