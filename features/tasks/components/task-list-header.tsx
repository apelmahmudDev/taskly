import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { SyncStatus } from "./sync-status";

type TaskListHeaderProps = {
	isOnline: boolean;
	lastRefreshed: string | null;
	isRefreshing: boolean;
};

export function TaskListHeader({
	isOnline,
	lastRefreshed,
	isRefreshing,
}: TaskListHeaderProps) {
	const refreshLabel = isRefreshing
		? "Refreshing…"
		: lastRefreshed
			? `Last refreshed ${new Date(lastRefreshed).toLocaleTimeString([], {
					hour: "numeric",
					minute: "2-digit",
				})}`
			: "Not refreshed yet";

	return (
		<View style={styles.header}>
			<Text style={styles.title}>Taskly</Text>
			<View style={styles.meta}>
				<SyncStatus isOnline={isOnline} />
				<View style={styles.refreshPill}>
					<Ionicons
						name={isRefreshing ? "sync" : "time-outline"}
						size={13}
						color={Colors.primary}
					/>
					<Text style={styles.refreshText}>{refreshLabel}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 14,
	},
	title: {
		color: Colors.text,
		fontSize: 26,
		lineHeight: 32,
		fontWeight: "800",
	},
	meta: {
		alignItems: "flex-end",
		gap: 6,
	},
	refreshPill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 10,
		backgroundColor: "rgba(127, 156, 122, 0.1)",
	},
	refreshText: {
		color: Colors.primary,
		fontSize: 10,
		lineHeight: 13,
		fontWeight: "600",
	},
});
