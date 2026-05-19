import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) {
            throw new Error("No user found");
          }

          if (user.status === "Suspended") {
            throw new Error("Your account has been suspended");
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordMatch) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.id = (user as any)._id?.toString() || user.id;
        token.status = (user as any).status || "Active";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      await connectDB();
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser && existingUser.status === "Suspended") {
          return false;
        }
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google"
          });
          (user as any)._id = newUser._id;
        } else {
          (user as any)._id = existingUser._id;
        }
      } else {
        // Double check credentials status as well
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser && existingUser.status === "Suspended") {
          return false;
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
