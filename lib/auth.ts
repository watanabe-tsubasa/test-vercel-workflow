import { redirect } from "next/navigation";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { users } from "@/db/schema";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
	],
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, account, user }) {
			if (account?.providerAccountId) {
				token.sub = account.providerAccountId;
			}
			if (user?.id) {
				token.sub = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);

export async function getAuthSession() {
	return getServerSession(authOptions);
}

export async function getCurrentUser() {
	const session = await getAuthSession();
	if (!session?.user?.id) return null;
	return {
		id: session.user.id,
		email: session.user.email ?? null,
		name: session.user.name ?? null,
		image: session.user.image ?? null,
	};
}

export async function requireCurrentUser() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/login");
	}
	return user;
}

export async function ensureUserFromSession() {
	const session = await getAuthSession();
	if (!session?.user?.id || !session.user.email) return null;

	const now = new Date();
	const [user] = await db
		.insert(users)
		.values({
			id: session.user.id,
			email: session.user.email,
			name: session.user.name ?? null,
			image: session.user.image ?? null,
			createdAt: now,
			updatedAt: now,
		})
		.onConflictDoUpdate({
			target: users.id,
			set: {
				email: session.user.email,
				name: session.user.name ?? null,
				image: session.user.image ?? null,
				updatedAt: now,
			},
		})
		.returning();

	return user ?? null;
}
