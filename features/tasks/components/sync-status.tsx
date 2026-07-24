import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type SyncStatusProps = { isOnline: boolean };

export function SyncStatus({ isOnline }: SyncStatusProps) {
	return (
		<View style={styles.container}>
			<View style={[styles.dot, !isOnline && styles.offlineDot]} />
			<Text style={styles.label}>{isOnline ? "Online" : "Offline"}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flexDirection: "row", alignItems: "center", gap: 6 },
	dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary },
	offlineDot: { backgroundColor: Colors.danger },
	label: { color: Colors.text, fontSize: 12, fontWeight: "600" },
});
