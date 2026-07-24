export type TaskItem = {
	id: string;
	title: string;
	category: string;
	due: string;
	categoryColor: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	completed?: boolean;
	starred?: boolean;
	urgent?: boolean;
};
