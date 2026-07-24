import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type CategoryCardProps = {
	name: string;
	taskCount: number;
};

function CategoryCardComponent({ name, taskCount }: CategoryCardProps) {
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
			<Ionicons
				name="chevron-forward"
				size={18}
				color={Colors.icon}
				style={styles.chevron}
			/>
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
	chevron: { opacity: 0.45 },
});
