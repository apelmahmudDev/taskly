import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { navigationTheme } from "@/navigation/navigation-theme";
import { RootNavigator } from "@/navigation/root-navigator";
import { store } from "@/store";
import { hydrateCache } from "@/store/persistence/cache";

store.dispatch(hydrateCache());

export default function App() {
	return (
		<Provider store={store}>
			<SafeAreaProvider
				style={{ flex: 1, backgroundColor: Colors.background }}
			>
				<NavigationContainer theme={navigationTheme}>
					<RootNavigator />
					<StatusBar
						style="dark"
						hidden={false}
						backgroundColor={Colors.background}
						translucent={false}
					/>
				</NavigationContainer>
			</SafeAreaProvider>
		</Provider>
	);
}
