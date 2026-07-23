import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { store } from "@/store";
import { Colors } from "@/constants/theme";
import { Provider } from "react-redux";

export const unstable_settings = {
	anchor: "(tabs)",
};

const navigationTheme = {
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

export default function RootLayout() {
	return (
		<Provider store={store}>
			<ThemeProvider value={navigationTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="modal"
						options={{ presentation: "modal", title: "Modal" }}
					/>
				</Stack>
				<StatusBar style="dark" />
			</ThemeProvider>
		</Provider>
	);
}
