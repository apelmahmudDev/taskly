import { Pressable, Text } from "react-native";

import { styles } from "./filter-chip.styles";

type FilterChipProps = {
	label: string;
	selected?: boolean;
	onPress: () => void;
};

export function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected }}
			onPress={onPress}
			style={({ pressed }) => [styles.chip, selected && styles.selectedChip, pressed && styles.pressed]}
		>
			<Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
		</Pressable>
	);
}
