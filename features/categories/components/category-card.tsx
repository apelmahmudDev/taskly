import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type CategoryCardProps = {
	name: string;
	taskCount: number;
	onRename: () => void;
	onDelete: () => void;
	isDeleting?: boolean;
};

function CategoryCardComponent({
	name,
	taskCount,
	onRename,
	onDelete,
	isDeleting,
}: CategoryCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Ionicons name="folder-outline" size={20} color={Colors.primary} />
			</View>
			<View style={styles.details}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.taskCount}>
					{taskCount} {taskCount === 1 ? "task" : "tasks"}
				</Text>
			</View>
			<Pressable
				onPress={onRename}
				disabled={isDeleting}
				accessibilityRole="button"
				accessibilityLabel={`Rename ${name}`}
				style={styles.action}
			>
				<Ionicons name="pencil-outline" size={18} color={Colors.primary} />
			</Pressable>
			<Pressable
				onPress={onDelete}
				disabled={isDeleting}
				accessibilityRole="button"
				accessibilityLabel={`Delete ${name}`}
				style={styles.action}
			>
				{isDeleting ? (
					<ActivityIndicator size="small" color={Colors.danger} />
				) : (
					<Ionicons name="trash-outline" size={18} color={Colors.danger} />
				)}
			</Pressable>
		</View>
	);
}

export const CategoryCard = memo(CategoryCardComponent);

const styles = StyleSheet.create({
	card: {
		height: 62,
		borderRadius: 14,
		paddingHorizontal: 14,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.surface,
	},
	icon: {
		width: 38,
		height: 38,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.background,
	},
	details: {
		flex: 1,
		marginLeft: 12,
	},
	name: {
		color: Colors.text,
		fontSize: 15,
		fontWeight: "700",
	},
	taskCount: {
		marginTop: 2,
		color: Colors.icon,
		fontSize: 11,
	},
	action: {
		width: 38,
		height: 38,
		alignItems: "center",
		justifyContent: "center",
	},
});
