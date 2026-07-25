import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import type { TaskDetailScreenProps } from "@/navigation/navigation-types";
import { persistCache } from "@/store/persistence/cache";
import {
	useDeleteTaskMutation,
	useSetTaskCompletedMutation,
} from "@/store/services/tasks-api";
import {
	removeTask,
	toggleStar,
	updateTask,
} from "@/store/slices/tasks-slice";
import { formatDate, formatDateTime } from "@/utils/format-date";
import { getMutationErrorMessage } from "@/utils/get-mutation-error-message";
import { styles } from "./task-detail-screen.styles";

export function TaskDetailScreen({ navigation, route }: TaskDetailScreenProps) {
	const dispatch = useAppDispatch();

	const task = useAppSelector((state) =>
		state.tasks.items.find((item) => item.id === route.params.taskId),
	);

	const completed = Boolean(task?.completed);
	const [starred, setStarred] = useState(Boolean(task?.starred));
	const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
	const [setTaskCompleted, { isLoading: isUpdatingStatus }] =
		useSetTaskCompletedMutation();

	if (!task)
		return (
			<SafeAreaView style={styles.safeArea}>
				<Text style={styles.title}>Task not found</Text>
			</SafeAreaView>
		);

	const deleteConfirmedTask = async () => {
		try {
			await deleteTask(task.id).unwrap();
			dispatch(removeTask(task.id));
			await dispatch(persistCache()).unwrap();
			navigation.goBack();
		} catch (error) {
			Alert.alert("Could not delete task", getMutationErrorMessage(error));
		}
	};

	const toggleTaskStatus = async () => {
		try {
			const updatedTask = await setTaskCompleted({
				id: task.id,
				completed: !completed,
			}).unwrap();
			dispatch(updateTask(updatedTask));
			await dispatch(persistCache()).unwrap();
		} catch (error) {
			Alert.alert("Could not update task", getMutationErrorMessage(error));
		}
	};

	const confirmDelete = () => {
		Alert.alert(
			"Delete task?",
			`Are you sure you want to delete “${task.title}”? This cannot be undone.`,
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes",
					style: "destructive",
					onPress: () => void deleteConfirmedTask(),
				},
			],
		);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
			<View style={styles.header}>
				<Pressable
					accessibilityLabel="Go back"
					hitSlop={12}
					onPress={navigation.goBack}
					style={styles.headerButton}
				>
					<Ionicons name="arrow-back" size={25} color={Colors.text} />
				</Pressable>
				<View style={styles.headerActions}>
					<Pressable
						accessibilityLabel={
							starred ? "Remove from starred" : "Add to starred"
						}
						hitSlop={12}
						onPress={() => {
							setStarred((value) => !value);
							dispatch(toggleStar(task.id));
							dispatch(persistCache());
						}}
						style={styles.headerButton}
					>
						<Ionicons
							name={starred ? "star" : "star-outline"}
							size={20}
							color={starred ? Colors.primary : Colors.text}
						/>
					</Pressable>
					<Pressable
						accessibilityLabel="Delete task"
						hitSlop={12}
						onPress={confirmDelete}
						disabled={isDeleting}
						style={styles.headerButton}
					>
						{isDeleting ? (
							<ActivityIndicator size="small" color={Colors.danger} />
						) : (
							<Ionicons name="trash-outline" size={20} color={Colors.danger} />
						)}
					</Pressable>
				</View>
			</View>
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.title}>{task.title}</Text>
				<View style={styles.categoryBadge}>
					<Ionicons name="briefcase-outline" size={16} color={Colors.primary} />
					<Text style={styles.categoryText}>{task.category}</Text>
				</View>

				<View style={styles.dueRow}>
					<View style={styles.dueDate}>
						<Ionicons name="calendar-outline" size={17} color={Colors.icon} />
						<Text style={styles.dueText}>
							{formatDate(task.due, "No due date")}
						</Text>
					</View>
					<View style={styles.statusBadge}>
						<Text style={styles.statusText}>{completed ? "Done" : "Open"}</Text>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Description</Text>
				<Text style={styles.description}>{task.description}</Text>

				<View style={styles.metadataCard}>
					<MetadataRow
						icon="document-text-outline"
						label="Created"
						value={formatDateTime(task.createdAt)}
					/>
					<View style={styles.divider} />
					<MetadataRow
						icon="time-outline"
						label="Last Updated"
						value={formatDateTime(task.updatedAt)}
					/>
					<View style={styles.divider} />
					<MetadataRow
						icon="information-circle-outline"
						label="Status"
						value={completed ? "Done" : "Open"}
						showStatus
					/>
				</View>

				<View style={styles.actionRow}>
					<Pressable
						onPress={() => navigation.navigate("TaskForm", { taskId: task.id })}
						style={({ pressed }) => [
							styles.secondaryAction,
							pressed && styles.pressed,
						]}
					>
						<Ionicons name="create" size={20} color={Colors.text} />
						<Text style={styles.secondaryActionText}>Edit Task</Text>
					</Pressable>

					<Pressable
						onPress={() => void toggleTaskStatus()}
						disabled={isUpdatingStatus}
						style={({ pressed }) => [
							styles.primaryAction,
							isUpdatingStatus && styles.disabledAction,
							pressed && styles.pressed,
						]}
					>
						{isUpdatingStatus ? (
							<ActivityIndicator size="small" color={Colors.background} />
						) : (
							<Ionicons
								name={completed ? "arrow-undo-outline" : "checkmark"}
								size={19}
								color={Colors.background}
							/>
						)}
						<Text style={styles.primaryActionText}>
							{isUpdatingStatus
								? "Updating…"
								: completed
									? "Mark Open"
									: "Mark Complete"}
						</Text>
					</Pressable>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

type MetadataRowProps = {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	value: string;
	showStatus?: boolean;
};

function MetadataRow({
	icon,
	label,
	value,
	showStatus = false,
}: MetadataRowProps) {
	return (
		<View style={styles.metadataRow}>
			<Ionicons name={icon} size={16} color={Colors.icon} />
			<Text style={styles.metadataLabel}>{label}</Text>
			<View style={styles.metadataValueGroup}>
				{showStatus && <View style={styles.statusDot} />}
				<Text style={styles.metadataValue}>{value}</Text>
			</View>
		</View>
	);
}
