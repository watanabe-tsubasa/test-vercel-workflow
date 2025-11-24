import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
	images: {
		domains: ["lh3.googleusercontent.com", "ik.imagekit.io", "placehold.co"],
	},
};

export default withWorkflow(nextConfig);
