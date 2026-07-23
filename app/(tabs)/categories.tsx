import { StyleSheet, Text, View } from "react-native";

export default function CategoriesScreen() {
	return (
		<View>
			<Text>Task list</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		bottom: -90,
		left: -35,
		position: "absolute",
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
