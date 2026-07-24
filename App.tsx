import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { navigationTheme } from "@/navigation/navigation-theme";
import { RootNavigator } from "@/navigation/root-navigator";
import { store } from "@/store";

export default function App() {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<NavigationContainer theme={navigationTheme}>
					<RootNavigator />
					<StatusBar style="dark" />
				</NavigationContainer>
			</SafeAreaProvider>
		</Provider>
	);
}
