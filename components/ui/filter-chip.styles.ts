import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";

export const styles = StyleSheet.create({
	chip: { minHeight: 36, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.surface, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", shadowColor: Colors.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
	selectedChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
	label: { color: Colors.text, fontSize: 12, fontWeight: "500" },
	selectedLabel: { color: Colors.background, fontWeight: "700" },
	pressed: { opacity: 0.8 },
});
