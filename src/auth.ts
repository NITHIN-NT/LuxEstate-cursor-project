import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface User {
        role?: string;
    }
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }
}

declare module "next-auth" {
    interface JWT {
        role?: string;
        id?: string;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const [admin] = await db
                    .select()
                    .from(admins)
                    .where(eq(admins.email, credentials.email as string))
                    .limit(1);

                if (!admin) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    admin.password
                );

                if (!isValid) return null;

                return {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
