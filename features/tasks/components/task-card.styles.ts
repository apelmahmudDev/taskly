import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";

export const styles = StyleSheet.create({
	card: { minHeight: 70, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.surface, flexDirection: "row", alignItems: "center", shadowColor: Colors.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 2 },
	checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
	checkedBox: { borderColor: Colors.primary, backgroundColor: Colors.primary },
	details: { flex: 1, minWidth: 0 },
	title: { color: Colors.text, fontSize: 14, lineHeight: 20, fontWeight: "700" },
	completedTitle: { color: Colors.icon },
	metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
	categoryDot: { width: 7, height: 7, borderRadius: 4 },
	category: { color: Colors.icon, fontSize: 10 },
	endContent: { marginLeft: 8, flexDirection: "row", alignItems: "center", gap: 10 },
	due: { color: Colors.primary, fontSize: 9, fontWeight: "700" },
	urgentDue: { color: Colors.danger },
});
