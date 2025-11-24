import { redirect } from "next/navigation";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prismaClient";

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

	const user = await prisma.user.upsert({
		where: { id: session.user.id },
		update: {
			email: session.user.email,
			name: session.user.name ?? undefined,
			image: session.user.image ?? undefined,
		},
		create: {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name ?? null,
			image: session.user.image ?? null,
		},
	});

	return user;
}
