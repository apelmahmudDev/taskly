import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { SyncStatus } from "./sync-status";

type TaskListHeaderProps = { isOnline: boolean };

export function TaskListHeader({ isOnline }: TaskListHeaderProps) {
	return (
		<View style={styles.header}>
			<Text style={styles.title}>Taskly</Text>
			<SyncStatus isOnline={isOnline} />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 14,
	},
	title: { color: Colors.text, fontSize: 26, lineHeight: 32, fontWeight: "800" },
});
