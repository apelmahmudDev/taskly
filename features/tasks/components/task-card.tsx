import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { TaskItem } from "../types";
import { formatTaskDate } from "../utils/format-task-date";

type TaskCardProps = {
	task: TaskItem;
	onPress: () => void;
	onToggle: () => void;
	onToggleStar: () => void;
};

function TaskCardComponent({
	task,
	onPress,
	onToggle,
	onToggleStar,
}: TaskCardProps) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`Open ${task.title}`}
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
		>
			<Pressable
				accessibilityLabel={`Mark ${task.title} as ${task.completed ? "open" : "done"}`}
				accessibilityRole="checkbox"
				accessibilityState={{ checked: Boolean(task.completed) }}
				onPress={(event) => {
					event.stopPropagation();
					onToggle();
				}}
				style={[styles.checkbox, task.completed && styles.checkedBox]}
			>
				{task.completed && (
					<Ionicons name="checkmark" size={15} color={Colors.background} />
				)}
			</Pressable>

			<View style={styles.details}>
				<Text
					numberOfLines={1}
					style={[styles.title, task.completed && styles.completedTitle]}
				>
					{task.title}
				</Text>
				<View style={styles.metaRow}>
					<Text style={styles.category}>{task.category}</Text>
				</View>
			</View>

			<View style={styles.endContent}>
				<Text style={[styles.due, task.urgent && styles.urgentDue]}>
					{formatTaskDate(task.due)}
				</Text>
				<Pressable
					accessibilityLabel={
						task.starred ? "Remove from starred" : "Add to starred"
					}
					hitSlop={10}
					onPress={(event) => {
						event.stopPropagation();
						onToggleStar();
					}}
				>
					<Ionicons
						name={task.starred ? "star" : "star-outline"}
						size={22}
						color={
							task.starred
								? task.urgent
									? Colors.danger
									: Colors.primary
								: Colors.icon
						}
					/>
				</Pressable>
			</View>
		</Pressable>
	);
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
	card: {
		minHeight: 70,
		marginBottom: 8,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		backgroundColor: Colors.surface,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(46, 46, 46, 0.1)",
	},
	pressedCard: {
		opacity: 0.82,
	},
	checkbox: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 1.5,
		borderColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	checkedBox: {
		borderColor: Colors.primary,
		backgroundColor: Colors.primary,
	},
	details: {
		flex: 1,
		minWidth: 0,
	},
	title: {
		color: Colors.text,
		fontSize: 14,
		lineHeight: 20,
		fontWeight: "700",
	},
	completedTitle: {
		color: Colors.icon,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		marginTop: 2,
	},
	category: {
		color: Colors.icon,
		fontSize: 10,
	},
	endContent: {
		marginLeft: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	due: {
		color: Colors.primary,
		fontSize: 9,
		fontWeight: "700",
	},
	urgentDue: {
		color: Colors.danger,
	},
});
