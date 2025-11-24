import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./header/user-menu";

export function Header() {
	return (
		<header className="border-b border-border bg-card">
			<div className="flex h-16 items-center justify-between px-6">
				<Link href="/">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
							<BookOpen className="h-5 w-5 text-primary-foreground" />
						</div>
						<h1 className="text-xl font-semibold text-foreground">絵日記</h1>
					</div>
				</Link>
				<div className="flex items-center gap-3">
					<UserMenu />
					<Button asChild size="sm">
						<Link href="/creation">作成</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
