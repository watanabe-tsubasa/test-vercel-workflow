import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
	"/login",
	"/api/auth",
	"/_next",
	"/favicon.ico",
	"/.well-known/workflow",
	"/api/internal/ai/stream-start", // workflow step calls
	"/api/diary/update", // called from workflow server-to-server
];

function isPublic(pathname: string) {
	return publicPaths.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (isPublic(pathname)) {
		return NextResponse.next();
	}

	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (!token) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
