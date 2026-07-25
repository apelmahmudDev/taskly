import type { TaskItem } from "@/features/tasks/types";
import { mergeRemoteTasks } from "@/features/tasks/utils/task-mapper";

function task(id: string, starred = false): TaskItem {
	return {
		id,
		title: `Task ${id}`,
		description: "",
		categoryId: "work",
		category: "Work",
		categoryColor: "#000000",
		due: "2026-08-01T00:00:00.000Z",
		createdAt: "2026-07-25T00:00:00.000Z",
		updatedAt: "2026-07-25T00:00:00.000Z",
		completed: false,
		starred,
	};
}

describe("mergeRemoteTasks", () => {
	it("preserves cached stars and defaults newly downloaded tasks to unstarred", () => {
		const merged = mergeRemoteTasks(
			[task("existing"), task("new", true)],
			[task("existing", true)],
		);

		expect(merged.map(({ id, starred }) => ({ id, starred }))).toEqual([
			{ id: "existing", starred: true },
			{ id: "new", starred: false },
		]);
	});
});
