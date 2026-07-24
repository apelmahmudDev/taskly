import type { ReactNode } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	type PressableProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Colors } from "@/constants/theme";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "chip";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
	children: ReactNode;
	selected?: boolean;
	variant?: ButtonVariant;
	style?: StyleProp<ViewStyle>;
};

export function Button({
	children,
	disabled = false,
	selected = false,
	variant = "primary",
	style,
	...pressableProps
}: ButtonProps) {
	const isPrimary = variant === "primary";
	const isSecondary = variant === "secondary";
	const isTertiary = variant === "tertiary";
	const isChip = variant === "chip";
	const hasLightLabel = isPrimary || (isChip && selected);
	const isDisabled = disabled === true;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled, ...(isChip && { selected }) }}
			disabled={isDisabled}
			style={({ pressed }) => [
				styles.button,
				isPrimary && styles.primary,
				isSecondary && styles.secondary,
				isTertiary && styles.tertiary,
				isChip && styles.chip,
				isChip && selected && styles.selectedChip,
				pressed && styles.pressed,
				isDisabled && styles.disabled,
				style,
			]}
			{...pressableProps}
		>
			<Text
				style={[
					styles.label,
					isTertiary && styles.tertiaryLabel,
					isChip && styles.chipLabel,
					hasLightLabel && styles.lightLabel,
					isChip && selected && styles.selectedChipLabel,
				]}
			>
				{children}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		minHeight: 48,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 14,
	},
	primary: {
		backgroundColor: Colors.primary,
	},
	secondary: {
		backgroundColor: Colors.surface,
		borderWidth: 1,
		borderColor: Colors.borderSoft,
	},
	tertiary: {
		minHeight: 40,
		paddingVertical: 8,
		backgroundColor: "transparent",
	},
	chip: {
		minHeight: 36,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.borderSoft,
		backgroundColor: Colors.background,
	},
	selectedChip: {
		borderColor: Colors.primary,
		backgroundColor: Colors.primary,
	},
	label: {
		color: Colors.text,
		fontSize: 15,
		fontWeight: "700",
		textAlign: "center",
	},
	lightLabel: {
		color: Colors.background,
	},
	tertiaryLabel: {
		color: Colors.primary,
	},
	chipLabel: {
		fontSize: 12,
		fontWeight: "500",
	},
	selectedChipLabel: {
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.82,
	},
	disabled: {
		opacity: 0.45,
	},
});
