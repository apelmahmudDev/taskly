import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type MainTabParamList = {
	Tasks: undefined;
	Categories: undefined;
};

export type RootStackParamList = {
	MainTabs: NavigatorScreenParams<MainTabParamList>;
	TaskDetail: { taskId: string };
	TaskForm: { taskId?: string } | undefined;
};

export type TasksScreenProps = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, "Tasks">,
	NativeStackScreenProps<RootStackParamList, "MainTabs">
>;

export type CategoriesScreenProps = BottomTabScreenProps<MainTabParamList, "Categories">;
export type TaskDetailScreenProps = NativeStackScreenProps<RootStackParamList, "TaskDetail">;
export type TaskFormScreenProps = NativeStackScreenProps<RootStackParamList, "TaskForm">;
