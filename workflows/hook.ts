import type { Hook, HookOptions } from "workflow";

function createWorkflowHook<T>() {
	return {
		create(options?: HookOptions): Hook<T> {
			const createHookFn = (globalThis as Record<PropertyKey, unknown>)[
				Symbol.for("WORKFLOW_CREATE_HOOK")
			] as ((options?: HookOptions) => Hook<T>) | undefined;

			if (!createHookFn) {
				throw new Error(
					"`defineHook().create()` can only be called inside a workflow function.",
				);
			}

			return createHookFn(options);
		},
	};
}

// Hooks used inside workflow/step executions.
export const userEditedHook = createWorkflowHook<{ revisedBullets: string }>();
