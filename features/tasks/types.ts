export type TaskItem = {
	id: string;
	title: string;
	category: string;
	due: string;
	categoryColor: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	completed: boolean;
	starred: boolean;
	urgent: boolean;
	categoryId: string;
};

export type Category = { id: string; name: string; color?: string | null };
export type TaskInput = { title: string; description: string; categoryId: string; dueDate: string };
export type EditTaskInput = {
	id: string;
	changes: TaskInput & { completed: boolean };
};
