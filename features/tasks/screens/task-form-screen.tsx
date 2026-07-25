import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { CategoryPickerModal } from "@/features/categories/components/category-picker-modal";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import type { TaskFormScreenProps } from "@/navigation/navigation-types";
import { persistCache } from "@/store/persistence/cache";
import {
	useCreateTaskMutation,
	useEditTaskMutation,
} from "@/store/services/tasks-api";
import { addTask, updateTask } from "@/store/slices/tasks-slice";
import { FilterChip } from "../components/filter-chip";
import { styles } from "./task-form-screen.styles";

export function TaskFormScreen({ navigation, route }: TaskFormScreenProps) {
	const dispatch = useAppDispatch();
	const tasks = useAppSelector((state) => state.tasks.items);
	const categories = useAppSelector((state) => state.categories.items);
	const existingTask = tasks.find((task) => task.id === route.params?.taskId);
	const [createTask, createState] = useCreateTaskMutation();
	const [editTask, editState] = useEditTaskMutation();
	const [title, setTitle] = useState(existingTask?.title ?? "");
	const [description, setDescription] = useState(
		existingTask?.description ?? "",
	);
	const initialCategory =
		categories.find((item) => item.id === existingTask?.categoryId) ??
		categories[0];

	const [categoryId, setCategoryId] = useState(initialCategory?.id ?? "");
	const [categoryName, setCategoryName] = useState(
		initialCategory?.name ?? existingTask?.category ?? "",
	);
	const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
	const parsedDueDate = existingTask?.due ? new Date(existingTask.due) : null;
	const [dueDate, setDueDate] = useState<Date>(
		parsedDueDate && !Number.isNaN(parsedDueDate.getTime())
			? parsedDueDate
			: new Date(),
	);
	const [datePickerVisible, setDatePickerVisible] = useState(false);
	const [completed, setCompleted] = useState(Boolean(existingTask?.completed));
	const isLoading = createState.isLoading || editState.isLoading;

	useEffect(() => {
		if (categoryId || categories.length === 0) return;
		const fallback =
			categories.find((item) => item.id === existingTask?.categoryId) ??
			categories[0];
		setCategoryId(fallback.id);
		setCategoryName(fallback.name);
	}, [categories, categoryId, existingTask?.categoryId]);

	const save = async () => {
		if (!categoryId) {
			Alert.alert("Choose a category", "Select a category before saving.");
			return;
		}
		try {
			const input = {
				title: title.trim(),
				description: description.trim(),
				categoryId,
				dueDate: dueDate.toISOString(),
			};
			const task = existingTask
				? await editTask({
						id: existingTask.id,
						changes: { ...input, completed },
					}).unwrap()
				: await createTask(input).unwrap();
			dispatch(existingTask ? updateTask(task) : addTask(task));
			await dispatch(persistCache()).unwrap();
			navigation.goBack();
		} catch (error) {
			const message =
				typeof error === "object" && error && "error" in error
					? String(error.error)
					: "Please try again.";
			Alert.alert(
				existingTask ? "Could not update task" : "Could not create task",
				message,
			);
		}
	};
	const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
		if (Platform.OS === "android") setDatePickerVisible(false);
		if (event.type === "set" && selected) setDueDate(selected);
	};

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
					<Input
						value={title}
						onChangeText={setTitle}
						placeholder="Task title"
					/>
				</Field>
				<Field label="Description">
					<Input
						value={description}
						onChangeText={setDescription}
						placeholder="Task description"
						multiline
						style={styles.descriptionInput}
					/>
				</Field>
				<Field label="Category">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Choose category"
						onPress={() => setCategoryPickerVisible(true)}
						style={({ pressed }) => [
							styles.categorySelector,
							pressed && styles.pressed,
						]}
					>
						<Text
							style={[
								styles.categoryValue,
								!categoryName && styles.placeholder,
							]}
						>
							{categoryName || "Select a category"}
						</Text>
						<Ionicons name="chevron-down" size={18} color={Colors.icon} />
					</Pressable>
				</Field>
				<Field label="Due date">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Choose due date"
						onPress={() => setDatePickerVisible(true)}
						style={({ pressed }) => [
							styles.categorySelector,
							pressed && styles.pressed,
						]}
					>
						<Text
							style={[styles.categoryValue, !dueDate && styles.placeholder]}
						>
							{dueDate ? format(dueDate, "MMM d, yyyy") : "Select a due date"}
						</Text>
						<Ionicons name="calendar-outline" size={18} color={Colors.icon} />
					</Pressable>
				</Field>
				{existingTask && (
					<Field label="Status">
						<View style={styles.statusOptions}>
							<FilterChip
								label="Open"
								selected={!completed}
								onPress={() => setCompleted(false)}
							/>
							<FilterChip
								label="Done"
								selected={completed}
								onPress={() => setCompleted(true)}
							/>
						</View>
					</Field>
				)}
				<Pressable
					disabled={!title.trim() || isLoading}
					onPress={save}
					style={({ pressed }) => [
						styles.saveButton,
						(!title.trim() || isLoading) && styles.disabledButton,
						pressed && styles.pressed,
					]}
				>
					{isLoading && (
						<ActivityIndicator size="small" color={Colors.background} />
					)}
					<Text style={styles.saveButtonText}>
						{isLoading
							? "Saving…"
							: existingTask
								? "Save Changes"
								: "Create Task"}
					</Text>
				</Pressable>
			</ScrollView>

			<CategoryPickerModal
				visible={categoryPickerVisible}
				categories={categories}
				selectedId={categoryId}
				onSelect={(selected) => {
					setCategoryId(selected.id);
					setCategoryName(selected.name);
				}}
				onClose={() => setCategoryPickerVisible(false)}
			/>

			{datePickerVisible && Platform.OS === "android" && (
				<DateTimePicker
					value={dueDate ?? new Date()}
					mode="date"
					display="default"
					onChange={onDateChange}
				/>
			)}

			{Platform.OS === "ios" && (
				<Modal
					animationType="slide"
					transparent
					visible={datePickerVisible}
					onRequestClose={() => setDatePickerVisible(false)}
				>
					<View style={styles.dateModalContainer}>
						<Pressable
							style={styles.dateBackdrop}
							onPress={() => setDatePickerVisible(false)}
						/>
						<View style={styles.dateSheet}>
							<DateTimePicker
								value={dueDate ?? new Date()}
								mode="date"
								display="spinner"
								onChange={onDateChange}
							/>
							<Pressable
								style={styles.dateDoneButton}
								onPress={() => setDatePickerVisible(false)}
							>
								<Text style={styles.saveButtonText}>Done</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			)}
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
