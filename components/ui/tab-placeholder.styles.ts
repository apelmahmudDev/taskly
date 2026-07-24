import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.background,
	},
	title: {
		color: Colors.text,
		fontSize: 18,
		fontWeight: "700",
	},
});
