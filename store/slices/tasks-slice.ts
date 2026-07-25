import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { TaskItem } from "@/features/tasks/types";
import { hydrateCache } from "@/store/persistence/cache";

type TasksState = {
	items: TaskItem[];
	hydrated: boolean;
	lastRefreshed: string | null;
};

const initialState: TasksState = {
	items: [],
	hydrated: false,
	lastRefreshed: null,
};

export const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		setRemoteTasks(
			state,
			action: PayloadAction<{ tasks: TaskItem[]; refreshedAt: string }>,
		) {
			state.items = action.payload.tasks;
			state.lastRefreshed = action.payload.refreshedAt;
		},

		addTask(state, action: PayloadAction<TaskItem>) {
			state.items.unshift(action.payload);
		},

		updateTask(state, action: PayloadAction<TaskItem>) {
			const index = state.items.findIndex(
				(task) => task.id === action.payload.id,
			);
			if (index !== -1) {
				state.items[index] = {
					...action.payload,
					starred: state.items[index].starred,
				};
			}
		},

		toggleStar(state, action: PayloadAction<string>) {
			const task = state.items.find((item) => item.id === action.payload);
			if (task) task.starred = !task.starred;
		},
	},

	extraReducers: (builder) =>
		builder
			.addCase(hydrateCache.fulfilled, (state, action) => {
				if (action.payload) {
					state.items = action.payload.tasks;
					state.lastRefreshed = action.payload.lastRefreshed;
				}
				state.hydrated = true;
			})
			.addCase(hydrateCache.rejected, (state) => {
				state.hydrated = true;
			}),
});

export const { setRemoteTasks, addTask, updateTask, toggleStar } =
	tasksSlice.actions;
