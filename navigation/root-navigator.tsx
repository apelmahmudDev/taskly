import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { CategoriesScreen } from "@/features/categories/screens/categories-screen";
import { TaskDetailScreen } from "@/features/tasks/screens/task-detail-screen";
import { TaskFormScreen } from "@/features/tasks/screens/task-form-screen";
import { TaskListScreen } from "@/features/tasks/screens/task-list-screen";
import type { MainTabParamList, RootStackParamList } from "./navigation-types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
	const insets = useSafeAreaInsets();

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: Colors.primary,
				tabBarInactiveTintColor: Colors.primarySoft,
				tabBarHideOnKeyboard: true,
				tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
				tabBarStyle: {
					height: 62 + insets.bottom,
					paddingTop: 8,
					paddingBottom: Math.max(insets.bottom, 10),
					backgroundColor: Colors.surface,
					borderTopColor: Colors.border,
				},
				tabBarIcon: ({ color, size }) => (
					<Ionicons
						name={route.name === "Tasks" ? "checkbox" : "folder"}
						size={size}
						color={color}
					/>
				),
			})}
		>
			<Tab.Screen name="Tasks" component={TaskListScreen} />
			<Tab.Screen name="Categories" component={CategoriesScreen} />
		</Tab.Navigator>
	);
}

export function RootNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainTabs" component={MainTabs} />
			<Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
			<Stack.Screen name="TaskForm" component={TaskFormScreen} />
		</Stack.Navigator>
	);
}
