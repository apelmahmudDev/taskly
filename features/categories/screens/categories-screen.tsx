import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { persistCache } from "@/store/persistence/cache";
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useRenameCategoryMutation,
} from "@/store/services/categories-api";
import {
	addCategory,
	removeCategory,
	updateCategory,
} from "@/store/slices/categories-slice";
import {
	clearTaskCategory,
	renameTaskCategory,
} from "@/store/slices/tasks-slice";
import { getMutationErrorMessage } from "@/utils/get-mutation-error-message";
import type { Category } from "@/features/tasks/types";
import { CategoryCard } from "../components/category-card";
import { RenameCategoryModal } from "../components/rename-category-modal";

export function CategoriesScreen() {
	const dispatch = useAppDispatch();
	const categories = useAppSelector((state) => state.categories.items);
	const tasks = useAppSelector((state) => state.tasks.items);
	const [createCategory, { isLoading }] = useCreateCategoryMutation();
	const [renameCategory, { isLoading: isRenaming }] =
		useRenameCategoryMutation();
	const [deleteCategory] = useDeleteCategoryMutation();
	const [name, setName] = useState("");
	const [categoryToRename, setCategoryToRename] = useState<Category | null>(null);
	const [renameName, setRenameName] = useState("");
	const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
	const taskCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const task of tasks) {
			if (task.categoryId) counts[task.categoryId] = (counts[task.categoryId] ?? 0) + 1;
		}
		return counts;
	}, [tasks]);

	const handleAddCategory = async () => {
		const trimmedName = name.trim();
		if (
			!trimmedName ||
			categories.some(
				(item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
			)
		)
			return;
		try {
			const created = await createCategory(trimmedName).unwrap();
			dispatch(addCategory(created));
			await dispatch(persistCache()).unwrap();
			setName("");
			Keyboard.dismiss();
		} catch (error) {
			Alert.alert("Could not add category", getMutationErrorMessage(error));
		}
	};

	const openRename = (category: Category) => {
		setCategoryToRename(category);
		setRenameName(category.name);
	};

	const handleRenameCategory = async () => {
		if (!categoryToRename) return;
		const trimmedName = renameName.trim();
		if (!trimmedName) return;
		if (
			categories.some(
				(item) =>
					item.id !== categoryToRename.id &&
					item.name.toLowerCase() === trimmedName.toLowerCase(),
			)
		) {
			Alert.alert("Category already exists", "Choose a different category name.");
			return;
		}
		if (trimmedName === categoryToRename.name) {
			setCategoryToRename(null);
			return;
		}

		try {
			const updated = await renameCategory({
				id: categoryToRename.id,
				name: trimmedName,
			}).unwrap();
			dispatch(updateCategory(updated));
			dispatch(renameTaskCategory({ categoryId: updated.id, name: updated.name }));
			await dispatch(persistCache()).unwrap();
			setCategoryToRename(null);
		} catch (error) {
			Alert.alert("Could not rename category", getMutationErrorMessage(error));
		}
	};

	const handleDeleteCategory = async (category: Category) => {
		setDeletingCategoryId(category.id);
		try {
			await deleteCategory(category.id).unwrap();
			dispatch(removeCategory(category.id));
			dispatch(clearTaskCategory(category.id));
			await dispatch(persistCache()).unwrap();
		} catch (error) {
			Alert.alert("Could not delete category", getMutationErrorMessage(error));
		} finally {
			setDeletingCategoryId(null);
		}
	};

	const confirmDelete = (category: Category) => {
		const taskCount = taskCounts[category.id] ?? 0;
		const detail = taskCount
			? ` ${taskCount} ${taskCount === 1 ? "task" : "tasks"} will become Uncategorized.`
			: "";
		Alert.alert(
			"Delete category?",
			`Delete “${category.name}”?${detail}`,
			[
				{ text: "No", style: "cancel" },
				{ text: "Yes", style: "destructive", onPress: () => void handleDeleteCategory(category) },
			],
		);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<Text style={styles.title}>Categories</Text>
			<View style={styles.addRow}>
				<View style={styles.inputContainer}>
					<Input
						value={name}
						onChangeText={setName}
						onSubmitEditing={handleAddCategory}
						placeholder="Category name"
						style={styles.input}
					/>
				</View>
				<Pressable
					onPress={handleAddCategory}
					disabled={isLoading || !name.trim()}
					accessibilityLabel="Add category"
					style={[
						styles.addButton,
						(isLoading || !name.trim()) && styles.disabledButton,
					]}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color={Colors.background} />
					) : (
						<Ionicons name="add" size={24} color={Colors.background} />
					)}
				</Pressable>
			</View>
			<FlatList
				data={categories}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<CategoryCard
						name={item.name}
						taskCount={taskCounts[item.id] ?? 0}
						onRename={() => openRename(item)}
						onDelete={() => confirmDelete(item)}
						isDeleting={deletingCategoryId === item.id}
					/>
				)}
			/>
			<RenameCategoryModal
				visible={categoryToRename !== null}
				name={renameName}
				isSaving={isRenaming}
				onNameChange={setRenameName}
				onSave={handleRenameCategory}
				onClose={() => setCategoryToRename(null)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: Colors.background },
	title: {
		paddingHorizontal: 22,
		paddingTop: 20,
		color: Colors.text,
		fontSize: 26,
		fontWeight: "800",
	},
	addRow: {
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 18,
		marginTop: 22,
	},
	inputContainer: {
		flex: 1,
	},
	input: {
		width: "100%",
		minHeight: 48,
		height: 48,
		borderRadius: 16,
	},
	addButton: {
		width: 48,
		height: 48,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	disabledButton: { opacity: 0.5 },
	list: { padding: 18, gap: 10 },
});
