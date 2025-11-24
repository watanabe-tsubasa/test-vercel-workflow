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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<VisuallyHidden>
				<DialogTitle>Generated Image</DialogTitle>
			</VisuallyHidden>
			<DialogTrigger asChild>
				<div className="relative w-full h-full cursor-pointer">
					<Image
						src={src ?? "/peaceful-park-scene-with-coffee-shop-and-sunset.jpg"}
						alt={alt ?? "画像"}
						fill
						className="object-cover"
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-5xl p-0 bg-transparent border-none">
				<div className="relative w-full h-[80vh]">
					<Image
						src={src ?? "/peaceful-park-scene-with-coffee-shop-and-sunset.jpg"}
						alt={alt ?? "画像"}
						fill
						className="object-cover"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
