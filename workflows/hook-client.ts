import { defineHook } from "workflow";

// Hooks for external callers (API routes). create() will throw here, but resume() works.
export const userEditedHookClient = defineHook<{ revisedBullets: string }>();
