// lib/openaiClient.ts
import OpenAI from "openai";

export type ImageModel = OpenAI.Images.ImageGenerateParams["model"];
export type TextModel = OpenAI.Responses.ResponseCreateParams["model"];

// モデル管理をここで集約
export const MODELS = {
	image: "gpt-image-1-mini" as ImageModel,
	text: "gpt-5.1" as TextModel, // タイトル生成に利用
} as const;

if (!process.env.OPENAI_API_KEY) {
	throw new Error("Missing OPENAI_API_KEY");
}

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
