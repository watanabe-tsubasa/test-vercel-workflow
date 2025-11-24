import { defineHook } from "workflow";

// ユーザー修正版を受け取るためのHook
export const firstDraftHook = defineHook<{ firstDraft: string }>();
export const userEditedHook = defineHook<{ revisedBullets: string }>();
