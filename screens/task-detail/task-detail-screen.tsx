import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { TASKS } from "@/data/tasks";
import type { TaskDetailScreenProps } from "@/navigation/types";
import { styles } from "./task-detail-screen.styles";

export function TaskDetailScreen({ navigation, route }: TaskDetailScreenProps) {
	const task =
		TASKS.find((item) => item.id === route.params.taskId) ?? TASKS[0];
	const [completed, setCompleted] = useState(Boolean(task.completed));
	const [starred, setStarred] = useState(Boolean(task.starred));

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
						onPress={() => setStarred((value) => !value)}
						style={styles.headerButton}
					>
						<Ionicons
							name={starred ? "star" : "star-outline"}
							size={25}
							color={starred ? Colors.primary : Colors.text}
						/>
					</Pressable>
					<Pressable
						accessibilityLabel="More options"
						hitSlop={12}
						style={styles.headerButton}
					>
						<Ionicons name="ellipsis-vertical" size={23} color={Colors.text} />
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
						<Text style={styles.dueText}>{task.due}</Text>
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
						value={task.createdAt}
					/>
					<View style={styles.divider} />
					<MetadataRow
						icon="time-outline"
						label="Last Updated"
						value={task.updatedAt}
					/>
					<View style={styles.divider} />
					<MetadataRow
						icon="information-circle-outline"
						label="Status"
						value={completed ? "Done" : "Open"}
						showStatus
					/>
				</View>
				<Pressable
					onPress={() => setCompleted((value) => !value)}
					style={({ pressed }) => [
						styles.primaryAction,
						pressed && styles.pressed,
					]}
				>
					<Ionicons
						name={completed ? "arrow-undo-outline" : "checkmark"}
						size={19}
						color={Colors.background}
					/>
					<Text style={styles.primaryActionText}>
						{completed ? "Mark as Open" : "Mark as Complete"}
					</Text>
				</Pressable>
				<Pressable
					onPress={() => navigation.navigate("TaskForm", { taskId: task.id })}
					style={({ pressed }) => [
						styles.secondaryAction,
						pressed && styles.pressed,
					]}
				>
					<Ionicons name="pencil-outline" size={19} color={Colors.text} />
					<Text style={styles.secondaryActionText}>Edit Task</Text>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						styles.secondaryAction,
						pressed && styles.pressed,
					]}
				>
					<Ionicons name="trash-outline" size={19} color={Colors.danger} />
					<Text style={styles.deleteActionText}>Delete Task</Text>
				</Pressable>
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
				{showStatus && (
					<Ionicons name="chevron-down" size={13} color={Colors.icon} />
				)}
			</View>
		</View>
	);
}
