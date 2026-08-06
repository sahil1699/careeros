"use server";

import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const passphrase = formData.get("passphrase");
  if (typeof passphrase !== "string" || passphrase.length === 0) {
    return { error: "Enter the passphrase." };
  }
  if (passphrase !== process.env.SESSION_PASSPHRASE) {
    return { error: "That's not it." };
  }

  const session = await getSession();
  session.authenticated = true;
  await session.save();
  redirect("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
