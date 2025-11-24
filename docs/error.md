# error.md

```bash
## Error Type
Runtime Error

## Error Message
Invalid src prop (https://lh3.googleusercontent.com/a/ACg8ocIWWQgm7Amc-gRuOvAxQH_NQk8BIwiG2reI6i2Q75rQWxL1t8_F=s96-c) on `next/image`, hostname "lh3.googleusercontent.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host


    at AvatarImage (components/ui/avatar.tsx:31:3)
    at UserMenu (components/header/user-menu.tsx:36:6)
    at Header (components/header.tsx:19:6)
    at HomePage (app/page.tsx:15:4)

## Code Frame
  29 | }: AvatarImageProps) {
  30 | 	return (
> 31 | 		<Image
     | 		^
  32 | 			className={cn("aspect-square h-full w-full", className)}
  33 | 			alt={alt ?? ""}
  34 | 			width={width ?? 40}

Next.js version: 16.0.0 (Turbopack)
```
