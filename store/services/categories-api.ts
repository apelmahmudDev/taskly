import type { Category } from "@/types/task";
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
		renameCategory: builder.mutation<Category, { id: string; name: string }>({
			queryFn: async ({ id, name }) => {
				try {
					const { data, error } = await getSupabase()
						.from("categories")
						.update({ name })
						.eq("id", id)
						.select("id,name");
					if (error) throw error;
					if (!data || data.length === 0) {
						throw new Error(
							"Category could not be found or you do not have permission to rename it.",
						);
					}
					return { data: data[0] };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
		deleteCategory: builder.mutation<string, string>({
			queryFn: async (id) => {
				try {
					const { data, error } = await getSupabase()
						.from("categories")
						.delete()
						.eq("id", id)
						.select("id");
					if (error) throw error;
					if (!data || data.length === 0) {
						throw new Error(
							"Category could not be found or you do not have permission to delete it.",
						);
					}
					return { data: id };
				} catch (error) {
					return toQueryError(error);
				}
			},
		}),
	}),
	overrideExisting: false,
});

export const {
	useLazyGetCategoriesQuery,
	useCreateCategoryMutation,
	useRenameCategoryMutation,
	useDeleteCategoryMutation,
} = categoriesApi;
