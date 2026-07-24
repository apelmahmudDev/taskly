import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type TabPlaceholderProps = {
	title: string;
};

export function TabPlaceholder({ title }: TabPlaceholderProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
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
