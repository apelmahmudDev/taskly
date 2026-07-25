import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Category } from "@/features/tasks/types";
import { hydrateCache } from "@/store/persistence/cache";

type CategoriesState = { items: Category[] };
const initialState: CategoriesState = { items: [] };

export const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		setCategories(state, action: PayloadAction<Category[]>) {
			state.items = action.payload;
		},
		addCategory(state, action: PayloadAction<Category>) {
			state.items.push(action.payload);
		},
	},
	extraReducers: (builder) =>
		builder.addCase(hydrateCache.fulfilled, (state, action) => {
			if (action.payload) state.items = action.payload.categories;
		}),
});

export const { setCategories, addCategory } = categoriesSlice.actions;
