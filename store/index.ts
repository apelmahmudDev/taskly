import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import { counterSlice } from "./slices/counterSlice";
import { tasksSlice } from "./slices/tasks-slice";
import { categoriesSlice } from "./slices/categories-slice";

export const createStore = () =>
	configureStore({
		reducer: {
			[api.reducerPath]: api.reducer,
			[counterSlice.name]: counterSlice.reducer,
			[tasksSlice.name]: tasksSlice.reducer,
			[categoriesSlice.name]: categoriesSlice.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
	});

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
