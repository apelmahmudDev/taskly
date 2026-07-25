import type { Category } from "@/features/tasks/types";
import { getSupabase } from "@/lib/supabase";
import { api } from "./api";
import { toQueryError } from "./api-error";

export const categoriesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query<Category[], void>({
			queryFn: async () => {
				try {
					const { data, error } = await getSupabase()
						.from("categories")
						.select("id,name")
						.order("name");
					if (error) throw error;
					return { data: data ?? [] };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
		createCategory: builder.mutation<Category, string>({
			queryFn: async (name) => {
				try {
					const { data, error } = await getSupabase()
						.from("categories")
						.insert({ name })
						.select("id,name")
						.single();
					if (error) throw error;
					return { data };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
	}),
	overrideExisting: false,
});

export const { useLazyGetCategoriesQuery, useCreateCategoryMutation } =
	categoriesApi;
