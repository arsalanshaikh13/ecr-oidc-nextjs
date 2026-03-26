import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || !session?.user) {
    redirect("/");
  }

  return { user: session.user };
});
