"use server";
import { signOut } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function signOutUser() {
  try {
    await signOut({ redirect: false });
    redirect("/");
  } catch (error) {
    console.error("Sign-out error:", error);
    throw new Error("Failed to sign out");
  }
}
