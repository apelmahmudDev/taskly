import { Text, View } from "react-native";

import { styles } from "./tab-placeholder.styles";

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
