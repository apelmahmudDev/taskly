import { Colors } from "@/constants/theme";
import type { TaskItem } from "@/types/task";

type TaskRow = Record<string, unknown> & {
	categories?: { id?: string; name?: string; color?: string } | null;
};

export function mapTaskRow(row: TaskRow): TaskItem {
	const category = row.categories;
	return {
		id: String(row.id),
		title: String(row.title ?? ""),
		description: String(row.description ?? ""),
		categoryId: String(row.category_id ?? category?.id ?? ""),
		category: category?.name ?? "Uncategorized",
		categoryColor: category?.color ?? Colors.primarySoft,
		due: String(row.due_date ?? ""),
		createdAt: String(row.created_at ?? ""),
		updatedAt: String(row.updated_at ?? row.created_at ?? ""),
		completed: Boolean(row.completed),
		starred: false,
		urgent: false,
	};
}

export function mergeRemoteTasks(remote: TaskItem[], local: TaskItem[]) {
	const stars = new Map(local.map((task) => [task.id, Boolean(task.starred)]));
	return remote.map((task) => ({
		...task,
		starred: stars.get(task.id) ?? false,
	}));
}
