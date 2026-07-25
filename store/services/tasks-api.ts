import type { EditTaskInput, TaskInput, TaskItem } from "@/features/tasks/types";
import { mapTaskRow } from "@/features/tasks/utils/task-mapper";
import { getSupabase } from "@/lib/supabase";
import { api } from "./api";
import { toQueryError } from "./api-error";

const taskSelect = "*, categories(id,name)";

export const tasksApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTasks: builder.query<TaskItem[], void>({
			queryFn: async () => {
				try {
					const { data, error } = await getSupabase()
						.from("tasks")
						.select(taskSelect);
					if (error) throw error;
					return { data: (data ?? []).map(mapTaskRow) };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
		createTask: builder.mutation<TaskItem, TaskInput>({
			queryFn: async (input) => {
				try {
					const { data, error } = await getSupabase()
						.from("tasks")
						.insert({
							title: input.title,
							description: input.description,
							category_id: input.categoryId || null,
							due_date: input.dueDate || null,
							completed: false,
						})
						.select(taskSelect)
						.single();
					if (error) throw error;
					return { data: mapTaskRow(data) };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
		editTask: builder.mutation<TaskItem, EditTaskInput>({
			queryFn: async ({ id, changes }) => {
				try {
					const { data, error } = await getSupabase()
						.from("tasks")
						.update({
							title: changes.title,
							description: changes.description,
							category_id: changes.categoryId,
							due_date: changes.dueDate || null,
							completed: changes.completed,
							updated_at: new Date().toISOString(),
						})
						.eq("id", id)
						.select(taskSelect);
					if (error) throw error;
					if (!data || data.length === 0) {
						throw new Error(
							"We couldn't find this task. Refresh your task list and try again.",
						);
					}
					return { data: mapTaskRow(data[0]) };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
	}),
	overrideExisting: false,
});

export const {
	useLazyGetTasksQuery,
	useCreateTaskMutation,
	useEditTaskMutation,
} = tasksApi;
