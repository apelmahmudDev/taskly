import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import { counterSlice } from "./slices/counterSlice";

export const createStore = () =>
	configureStore({
		reducer: {
			[api.reducerPath]: api.reducer,
			[counterSlice.name]: counterSlice.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
	});

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
