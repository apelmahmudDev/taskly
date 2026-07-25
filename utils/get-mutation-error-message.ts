export function getMutationErrorMessage(
	error: unknown,
	fallback = "Please try again.",
) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error !== "object" || !error) return fallback;

	if ("error" in error && typeof error.error === "string" && error.error) {
		return error.error;
	}
	if ("message" in error && typeof error.message === "string" && error.message) {
		return error.message;
	}

	return fallback;
}
