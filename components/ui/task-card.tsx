import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { TaskItem } from "@/types/task";
import { styles } from "./task-card.styles";

type TaskCardProps = {
	task: TaskItem;
	onPress: () => void;
	onToggle: () => void;
	onToggleStar: () => void;
};

function TaskCardComponent({ task, onPress, onToggle, onToggleStar }: TaskCardProps) {
	return (
		<View style={styles.card}>
			<Pressable
				accessibilityLabel={`Mark ${task.title} as ${task.completed ? "open" : "done"}`}
				accessibilityRole="checkbox"
				accessibilityState={{ checked: Boolean(task.completed) }}
				onPress={onToggle}
				style={[styles.checkbox, task.completed && styles.checkedBox]}
			>
				{task.completed && <Ionicons name="checkmark" size={15} color={Colors.background} />}
			</Pressable>

			<Pressable accessibilityRole="button" accessibilityLabel={`Open ${task.title}`} onPress={onPress} style={styles.details}>
				<Text numberOfLines={1} style={[styles.title, task.completed && styles.completedTitle]}>{task.title}</Text>
				<View style={styles.metaRow}>
					<View style={[styles.categoryDot, { backgroundColor: task.categoryColor }]} />
					<Text style={styles.category}>{task.category}</Text>
				</View>
			</Pressable>

			<View style={styles.endContent}>
				<Text style={[styles.due, task.urgent && styles.urgentDue]}>{task.due}</Text>
				<Pressable accessibilityLabel={task.starred ? "Remove from starred" : "Add to starred"} hitSlop={10} onPress={onToggleStar}>
					<Ionicons name={task.starred ? "star" : "star-outline"} size={22} color={task.starred ? (task.urgent ? Colors.danger : Colors.primary) : Colors.icon} />
				</Pressable>
			</View>
		</View>
	);
}

export const TaskCard = memo(TaskCardComponent);
