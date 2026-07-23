import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.tabIconSelected,
				tabBarInactiveTintColor: Colors.tabIconDefault,
				tabBarStyle: {
					backgroundColor: Colors.surface,
					borderTopColor: Colors.border,
				},
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Tasks",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="categories"
				options={{
					title: "Categories",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="folder.fill" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
