import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";

export const styles = StyleSheet.create({
	modalContainer: { flex: 1, justifyContent: "flex-end" },
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(46, 46, 46, 0.45)",
	},
	bottomSheet: {
		backgroundColor: Colors.background,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 22,
		paddingTop: 10,
		paddingBottom: 30,
	},
	sheetHandle: {
		alignSelf: "center",
		width: 42,
		height: 5,
		borderRadius: 3,
		backgroundColor: Colors.primarySoft,
		marginBottom: 14,
	},
	sheetHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 22,
	},
	sheetTitle: { color: Colors.text, fontSize: 21, fontWeight: "800" },
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.surface,
	},
	sectionLabel: {
		color: Colors.text,
		fontSize: 13,
		fontWeight: "700",
		marginBottom: 10,
	},
	sheetChipRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 20,
	},
	sheetActions: { flexDirection: "row", gap: 10, marginTop: 6 },
	clearButton: {
		height: 50,
		paddingHorizontal: 24,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: Colors.primary,
	},
	clearButtonText: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
	applyButton: {
		flex: 1,
		height: 50,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	applyButtonText: { color: Colors.background, fontSize: 14, fontWeight: "800" },
});
