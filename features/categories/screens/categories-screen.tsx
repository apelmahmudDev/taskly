import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { TASKS } from "@/features/tasks/data/tasks";
import { CategoryCard } from "../components/category-card";

const INITIAL_CATEGORIES = ["Work", "Personal", "Shopping", "Health"];
const TASK_COUNT_BY_CATEGORY = TASKS.reduce<Record<string, number>>(
	(counts, task) => ({
		...counts,
		[task.category]: (counts[task.category] ?? 0) + 1,
	}),
	{},
);

export function CategoriesScreen() {
	const [categories, setCategories] = useState(INITIAL_CATEGORIES);
	const [name, setName] = useState("");

	const addCategory = () => {
		const trimmedName = name.trim();
		if (!trimmedName || categories.includes(trimmedName)) return;
		setCategories((current) => [...current, trimmedName]);
		setName("");
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<Text style={styles.title}>Categories</Text>
			<View style={styles.addRow}>
				<View style={styles.inputContainer}>
					<Ionicons
						name="search-outline"
						size={20}
						color={Colors.primary}
						style={styles.searchIcon}
					/>
					<Input
						value={name}
						onChangeText={setName}
						onSubmitEditing={addCategory}
						placeholder="Category name"
						style={styles.input}
					/>
				</View>
				<Pressable
					onPress={addCategory}
					accessibilityLabel="Add category"
					style={styles.addButton}
				>
					<Ionicons name="add" size={24} color={Colors.background} />
				</Pressable>
			</View>
			<FlatList
				data={categories}
				keyExtractor={(item) => item}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<CategoryCard
						name={item}
						taskCount={TASK_COUNT_BY_CATEGORY[item] ?? 0}
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
		position: "relative",
	},
	input: {
		width: "100%",
		minHeight: 48,
		height: 48,
		borderRadius: 16,
		paddingLeft: 44,
	},
	searchIcon: {
		position: "absolute",
		left: 15,
		top: 14,
		zIndex: 1,
	},
	addButton: {
		width: 48,
		height: 48,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	list: { padding: 18, gap: 10 },
});
