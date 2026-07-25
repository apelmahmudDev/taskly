import type { TaskItem } from "@/types/task";
import { selectVisibleTasks } from "@/utils/filter-and-sort-tasks";

const tasks: TaskItem[] = [
	{
		id: "1",
		title: "Write release notes",
		description: "",
		categoryId: "work",
		category: "Work",
		categoryColor: "#000000",
		due: "2026-08-12T09:00:00.000Z",
		createdAt: "2026-07-20T09:00:00.000Z",
		updatedAt: "2026-07-20T09:00:00.000Z",
		completed: false,
		starred: false,
		urgent: false,
	},
	{
		id: "2",
		title: "Review release plan",
		description: "",
		categoryId: "work",
		category: "Work",
		categoryColor: "#000000",
		due: "2026-08-10T09:00:00.000Z",
		createdAt: "2026-07-22T09:00:00.000Z",
		updatedAt: "2026-07-22T09:00:00.000Z",
		completed: false,
		starred: false,
		urgent: false,
	},
	{
		id: "3",
		title: "Buy groceries",
		description: "",
		categoryId: "personal",
		category: "Personal",
		categoryColor: "#000000",
		due: "2026-08-09T09:00:00.000Z",
		createdAt: "2026-07-24T09:00:00.000Z",
		updatedAt: "2026-07-24T09:00:00.000Z",
		completed: true,
		starred: false,
		urgent: false,
	},
];

describe("selectVisibleTasks", () => {
	it("filters by title, category, and open status, then sorts by due date", () => {
		const result = selectVisibleTasks(tasks, {
			query: "release",
			category: "Work",
			status: "Open",
			sortBy: "Due date",
		});

		expect(result.map((task) => task.id)).toEqual(["2", "1"]);
	});

	it("sorts matching tasks by newest created time", () => {
		const result = selectVisibleTasks(tasks, {
			query: "",
			category: "All",
			status: "All",
			sortBy: "Created time",
		});

		expect(result.map((task) => task.id)).toEqual(["3", "2", "1"]);
	});
});
