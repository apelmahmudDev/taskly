import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		height: 64,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerButton: {
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		color: Colors.text,
		fontSize: 19,
		fontWeight: "800",
	},
	content: {
		paddingHorizontal: 22,
		paddingTop: 14,
		paddingBottom: 30,
	},
	field: { marginBottom: 18 },
	label: {
		marginBottom: 8,
		color: Colors.text,
		fontSize: 13,
		fontWeight: "700",
	},
	descriptionInput: {
		height: 120,
	},
	categorySelector: {
		height: 48,
		borderWidth: 1,
		borderColor: Colors.borderSoft,
		borderRadius: 12,
		paddingHorizontal: 14,
		backgroundColor: Colors.surface,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	categoryValue: {
		color: Colors.text,
		fontSize: 14,
	},
	placeholder: {
		color: Colors.icon,
	},
	statusOptions: {
		flexDirection: "row",
		gap: 8,
	},
	dateModalContainer: { flex: 1, justifyContent: "flex-end" },
	dateBackdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(46, 46, 46, 0.45)",
	},
	dateSheet: {
		backgroundColor: Colors.background,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 22,
		paddingTop: 12,
		paddingBottom: 30,
	},
	dateDoneButton: {
		height: 50,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	saveButton: {
		height: 50,
		marginTop: 8,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
	},
	saveButtonText: {
		color: Colors.background,
		fontSize: 14,
		fontWeight: "800",
	},
	disabledButton: {
		opacity: 0.45,
	},
	pressed: { opacity: 0.82 },
});
