import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: Colors.background },
	taskListContent: {
		flexGrow: 1,
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 96,
	},
	emptyText: {
		color: Colors.icon,
		textAlign: "center",
		marginTop: 36,
		fontSize: 14,
	},
	fab: {
		position: "absolute",
		right: 22,
		bottom: 20,
		width: 58,
		height: 58,
		borderRadius: 29,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		shadowColor: Colors.text,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 7,
		elevation: 6,
	},
	fabPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
});
