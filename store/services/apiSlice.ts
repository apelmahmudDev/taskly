import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		// baseUrl: process.env.API_URL,
		baseUrl: "https://pokeapi.co/api/v2/",
	}),
	tagTypes: [],
	endpoints: () => ({}),
});
