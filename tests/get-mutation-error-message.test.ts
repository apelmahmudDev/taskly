import { getMutationErrorMessage } from "@/utils/get-mutation-error-message";

describe("getMutationErrorMessage", () => {
	it("prefers the RTK Query custom error message", () => {
		expect(getMutationErrorMessage({ error: "Task title is required." })).toBe(
			"Task title is required.",
		);
	});

	it("uses the supplied fallback for unknown errors", () => {
		expect(getMutationErrorMessage(null, "Try again later.")).toBe(
			"Try again later.",
		);
	});
});
