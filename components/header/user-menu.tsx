"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import Link from "next/link";

export function UserMenu() {
	const { data: session, status } = useSession();
	const user = session?.user;

	if (status === "loading") {
		return (
			<div className="flex h-9 w-28 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
				Loading...
			</div>
		);
	}

	if (!user) {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => signIn("google", { callbackUrl: "/" })}
			>
				Google でログイン
			</Button>
		);
	}

	return (
		<div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
			<Avatar className="h-9 w-9">
				{user.image ? (
					<AvatarImage src={user.image} alt={user.name ?? ""} />
				) : null}
				<AvatarFallback>
					{user.email?.[0]?.toUpperCase() ?? user.name?.[0] ?? "U"}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-sm font-medium">{user.name ?? "ログイン中"}</span>
				<span className="text-xs text-muted-foreground">{user.email}</span>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => signOut({ callbackUrl: "/login" })}
			>
				ログアウト
			</Button>
		</div>
	);
}
