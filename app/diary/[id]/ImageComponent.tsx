"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type ImageModalProps = {
	src?: string;
	alt?: string;
};

export default function ImageModal({ src, alt }: ImageModalProps) {
	const [open, setOpen] = useState(false);

	const imageSrc =
		src ?? "https://placehold.co/1200x800.png?text=Diary+Image+Placeholder";

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<VisuallyHidden>
				<DialogTitle>Generated Image</DialogTitle>
			</VisuallyHidden>
			<DialogTrigger asChild>
				<div className="relative w-full aspect-3/2 cursor-pointer">
					<Image
						src={imageSrc}
						alt={alt ?? "画像"}
						fill
						className="object-contain"
						sizes="(min-width: 1024px) 640px, 100vw"
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-6xl p-0 bg-transparent border-none">
				<div className="relative w-full max-w-6xl aspect-3/2 max-h-[80vh] mx-auto">
					<Image
						src={imageSrc}
						alt={alt ?? "画像"}
						fill
						className="object-contain"
						sizes="90vw"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
