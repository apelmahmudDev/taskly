import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: Colors.background },
	title: {
		paddingHorizontal: 22,
		paddingTop: 20,
		color: Colors.text,
		fontSize: 26,
		fontWeight: "800",
	},
	addRow: {
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 18,
		marginTop: 22,
	},
	input: {
		flex: 1,
		height: 48,
		borderRadius: 14,
	},
	addButton: {
		width: 48,
		height: 48,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	list: { padding: 18, gap: 10 },
	categoryCard: {
		height: 62,
		borderRadius: 14,
		paddingHorizontal: 14,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.surface,
	},
	categoryIcon: {
		width: 38,
		height: 38,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.background,
	},
	categoryName: {
		marginLeft: 12,
		color: Colors.text,
		fontSize: 15,
		fontWeight: "700",
	},
});
