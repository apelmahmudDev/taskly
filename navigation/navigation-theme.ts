import { DefaultTheme, type Theme } from "@react-navigation/native";

import { Colors } from "@/constants/theme";

export const navigationTheme: Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.primary,
		background: Colors.background,
		card: Colors.surface,
		text: Colors.text,
		border: Colors.border,
		notification: Colors.danger,
	},
};
