import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
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
import { useCreateCategoryMutation } from "@/store/services/categories-api";
import { addCategory } from "@/store/slices/categories-slice";
import { CategoryCard } from "../components/category-card";

export function CategoriesScreen() {
	const dispatch = useAppDispatch();
	const categories = useAppSelector((state) => state.categories.items);
	const tasks = useAppSelector((state) => state.tasks.items);
	const [createCategory, { isLoading }] = useCreateCategoryMutation();
	const [name, setName] = useState("");

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
		} catch (error) {
			const message =
				typeof error === "object" && error && "error" in error
					? String(error.error)
					: "Please try again.";
			Alert.alert("Could not add category", message);
		}
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
						taskCount={
							tasks.filter((task) => task.categoryId === item.id).length
						}
					/>
				)}
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
