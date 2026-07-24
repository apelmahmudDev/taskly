import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { styles } from "./categories-screen.styles";

const INITIAL_CATEGORIES = ["Work", "Personal", "Shopping", "Health"];

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
				<Input
					value={name}
					onChangeText={setName}
					onSubmitEditing={addCategory}
					placeholder="Category name"
					style={styles.input}
				/>
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
					<View style={styles.categoryCard}>
						<View style={styles.categoryIcon}>
							<Ionicons
								name="folder-outline"
								size={20}
								color={Colors.primary}
							/>
						</View>
						<Text style={styles.categoryName}>{item}</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}
