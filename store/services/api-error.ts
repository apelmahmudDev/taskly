export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error && "message" in error) {
		return String(error.message);
	}
	return String(error);
}

export function toQueryError(error: unknown) {
	return {
		error: {
			status: "CUSTOM_ERROR" as const,
			error: getErrorMessage(error),
		},
	};
}
