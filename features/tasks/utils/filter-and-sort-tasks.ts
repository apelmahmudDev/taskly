import type { TaskItem } from "../types";

export type TaskStatusFilter = "All" | "Open" | "Done";
export type TaskSortOption = "Due date" | "Created time";

type TaskFilterOptions = {
	query: string;
	category: string;
	status: TaskStatusFilter;
	sortBy: TaskSortOption;
};

function getDateTimestamp(value: string) {
	const timestamp = Date.parse(value.replace(" at ", " "));
	return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

export function selectVisibleTasks(
	tasks: TaskItem[],
	{ query, category, status, sortBy }: TaskFilterOptions,
) {
	const normalizedQuery = query.trim().toLowerCase();
	const filteredTasks = tasks.filter((task) => {
		const matchesQuery = task.title.toLowerCase().includes(normalizedQuery);
		const matchesCategory = category === "All" || task.category === category;
		const matchesStatus =
			status === "All" ||
			(status === "Done" ? task.completed : !task.completed);

		return matchesQuery && matchesCategory && matchesStatus;
	});

	return [...filteredTasks].sort((left, right) => {
		if (sortBy === "Created time") {
			return getDateTimestamp(right.createdAt) - getDateTimestamp(left.createdAt);
		}

		return getDateTimestamp(left.due) - getDateTimestamp(right.due);
	});
}
