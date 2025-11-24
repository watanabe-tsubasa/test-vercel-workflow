"use client";

import { signIn } from "next-auth/react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Login() {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 justify-center items-center">
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Login to your account</CardTitle>
						<CardDescription>
							Googleでサインインして日記を作成しましょう。
						</CardDescription>
						{/* <CardAction>
							<Button variant="link" onClick={() => signIn("google")}>
								Sign Up with Google
							</Button>
						</CardAction> */}
					</CardHeader>
					<CardFooter className="flex-col gap-2">
						<Button
							type="button"
							className="w-full"
							onClick={() => signIn("google", { callbackUrl: "/" })}
						>
							Login with Google
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
