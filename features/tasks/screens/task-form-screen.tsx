import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { TASKS } from "@/features/tasks/data/tasks";
import type { TaskFormScreenProps } from "@/navigation/navigation-types";
import { styles } from "./task-form-screen.styles";

export function TaskFormScreen({ navigation, route }: TaskFormScreenProps) {
	const existingTask = TASKS.find((task) => task.id === route.params?.taskId);
	const [title, setTitle] = useState(existingTask?.title ?? "");
	const [description, setDescription] = useState(
		existingTask?.description ?? "",
	);
	const [category, setCategory] = useState(existingTask?.category ?? "Work");
	const [dueDate, setDueDate] = useState(existingTask?.due ?? "");

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
			<View style={styles.header}>
				<Pressable
					onPress={navigation.goBack}
					accessibilityLabel="Go back"
					style={styles.headerButton}
				>
					<Ionicons name="arrow-back" size={25} color={Colors.text} />
				</Pressable>
				<Text style={styles.headerTitle}>
					{existingTask ? "Edit Task" : "Add Task"}
				</Text>
				<View style={styles.headerButton} />
			</View>
			<ScrollView
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
			>
				<Field label="Title">
					<TextInput
						value={title}
						onChangeText={setTitle}
						placeholder="Task title"
						placeholderTextColor={Colors.primarySoft}
						style={styles.input}
					/>
				</Field>
				<Field label="Description">
					<TextInput
						value={description}
						onChangeText={setDescription}
						placeholder="Task description"
						placeholderTextColor={Colors.primarySoft}
						multiline
						style={[styles.input, styles.descriptionInput]}
					/>
				</Field>
				<Field label="Category">
					<TextInput
						value={category}
						onChangeText={setCategory}
						placeholder="Category"
						placeholderTextColor={Colors.primarySoft}
						style={styles.input}
					/>
				</Field>
				<Field label="Due date">
					<TextInput
						value={dueDate}
						onChangeText={setDueDate}
						placeholder="May 15, 2025"
						placeholderTextColor={Colors.primarySoft}
						style={styles.input}
					/>
				</Field>
				<Pressable
					disabled={!title.trim()}
					style={({ pressed }) => [
						styles.saveButton,
						!title.trim() && styles.disabledButton,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.saveButtonText}>
						{existingTask ? "Save Changes" : "Create Task"}
					</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			{children}
		</View>
	);
}
