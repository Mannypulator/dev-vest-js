"use server";

import connectDB from "@/config/database";
import { signOut } from "next-auth/react";

async function signOutUser() {
  await connectDB();
  await signOut();
}

export default signOutUser;
