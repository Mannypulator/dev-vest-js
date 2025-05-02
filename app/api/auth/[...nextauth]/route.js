import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;
