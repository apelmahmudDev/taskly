import { Colors } from "@/constants/theme";
import { mapTaskRow } from "@/features/tasks/utils/task-mapper";

describe("mapTaskRow", () => {
	it("maps a Supabase task row and applies local defaults", () => {
		const task = mapTaskRow({
			id: "task-1",
			title: "Mapped task",
			description: null,
			category_id: null,
			due_date: "2026-08-01T00:00:00.000Z",
			created_at: "2026-07-25T10:00:00.000Z",
			updated_at: null,
			completed: 1,
			categories: null,
		});

		expect(task).toMatchObject({
			id: "task-1",
			title: "Mapped task",
			description: "",
			categoryId: "",
			category: "Uncategorized",
		categoryColor: Colors.primarySoft,
		completed: true,
		starred: false,
		urgent: false,
		});
		expect(task.updatedAt).toBe("2026-07-25T10:00:00.000Z");
	});
});
