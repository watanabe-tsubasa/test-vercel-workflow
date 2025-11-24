"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Avatar({ className, ...props }: AvatarProps) {
	return (
		<span
			className={cn(
				"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

export type AvatarImageProps = Omit<ImageProps, "ref">;

export function AvatarImage({
	className,
	alt,
	width,
	height,
	...props
}: AvatarImageProps) {
	return (
		<Image
			className={cn("aspect-square h-full w-full", className)}
			alt={alt ?? ""}
			width={width ?? 40}
			height={height ?? 40}
			{...props}
		/>
	);
}

export interface AvatarFallbackProps
	extends React.HTMLAttributes<HTMLSpanElement> {}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
	return (
		<span
			className={cn(
				"flex h-full w-full items-center justify-center rounded-full bg-muted",
				className,
			)}
			{...props}
		/>
	);
}
