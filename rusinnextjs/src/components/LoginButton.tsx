"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "cognito",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="flex h-12 items-center justify-center rounded-full bg-black text-white px-8 transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      {isLoading ? "Logging in..." : "Get Started"}
    </button>
  );
}
