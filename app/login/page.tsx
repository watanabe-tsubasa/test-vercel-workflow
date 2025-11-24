import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { login } from "./action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 justify-center items-center">
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Login to your account</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
						<CardAction>
							<Button variant="link">Sign Up</Button>
						</CardAction>
					</CardHeader>
					<form action={login} className="flex flex-col gap-6">
						<CardContent>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										<a
											href="#"
											className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</a>
									</div>
									<Input id="password" type="password" required />
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex-col gap-2">
							<Button type="submit" className="w-full">
								Login
							</Button>
							<Button variant="outline" className="w-full">
								Login with Google
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
