import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

import type { Category, TaskItem } from "@/features/tasks/types";
import type { RootState } from "@/store";

const CACHE_KEY = "taskly.cache.v1";

export type TasklyCache = {
	version: 1;
	tasks: TaskItem[];
	categories: Category[];
	lastRefreshed: string | null;
};

export const hydrateCache = createAsyncThunk("cache/hydrate", async () => {
	const value = await AsyncStorage.getItem(CACHE_KEY);
	if (!value) return null;
	const cache = JSON.parse(value) as TasklyCache;
	return cache.version === 1 ? cache : null;
});

export const persistCache = createAsyncThunk<void, void, { state: RootState }>(
	"cache/persist",
	async (_, { getState }) => {
		const state = getState();
		const cache: TasklyCache = {
			version: 1,
			tasks: state.tasks.items,
			categories: state.categories.items,
			lastRefreshed: state.tasks.lastRefreshed,
		};
		await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
	},
);
