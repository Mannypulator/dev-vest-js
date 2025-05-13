import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signInWithCredentials } from "@/app/action/signInWithCredentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        try {
          const user = await signInWithCredentials(
            credentials.email,
            credentials.password
          );
          return user;
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account }) {
      await connectDB();

      if (account.provider === "credentials") {
        return true;
      }

      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        const username =
          profile.name?.slice(0, 20) || profile.email.split("@")[0];
        await User.create({
          email: profile.email,
          firstName: profile.given_name || profile.firstName,
          lastName: profile.family_name || profile.lastName,
          username,
          image: profile.picture || profile.image,
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
        } else {
          token.id = user.id; // Fallback for new users
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).lean();
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.bookmarks = dbUser?.bookmarks || [];
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
