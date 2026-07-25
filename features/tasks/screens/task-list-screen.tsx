import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import type { TasksScreenProps } from "@/navigation/navigation-types";
import { persistCache } from "@/store/persistence/cache";
import { useSetTaskCompletedMutation } from "@/store/services/tasks-api";
import { toggleStar, updateTask } from "@/store/slices/tasks-slice";
import { getMutationErrorMessage } from "@/utils/get-mutation-error-message";
import { AdvancedFiltersModal } from "../components/advanced-filters-modal";
import { TaskCard } from "../components/task-card";
import { TaskFilterBar } from "../components/task-filter-bar";
import { TaskListHeader } from "../components/task-list-header";
import { useTaskSync } from "@/hooks/use-task-sync";
import type { TaskItem } from "@/types/task";
import {
	selectVisibleTasks,
	type TaskSortOption,
	type TaskStatusFilter,
} from "@/utils/filter-and-sort-tasks";

export function TaskListScreen({ navigation }: TasksScreenProps) {
	const dispatch = useAppDispatch();
	const { items: tasks, lastRefreshed } = useAppSelector(
		(state) => state.tasks,
	);
	const categories = useAppSelector((state) => state.categories.items);
	const { isOnline, refreshMode, refreshTasks } = useTaskSync();
	const [setTaskCompleted] = useSetTaskCompletedMutation();
	const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(
		() => new Set(),
	);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");
	const [status, setStatus] = useState<TaskStatusFilter>("All");
	const [sortBy, setSortBy] = useState<TaskSortOption>("Due date");
	const [filtersVisible, setFiltersVisible] = useState(false);
	const debouncedQuery = useDebouncedValue(query, 300);
	const hasActiveFilters = category !== "All" || status !== "All";

	const visibleTasks = useMemo(
		() =>
			selectVisibleTasks(tasks, {
				query: debouncedQuery,
				category,
				status,
				sortBy,
			}),
		[category, debouncedQuery, sortBy, status, tasks],
	);

	const toggleTaskStatus = useCallback(
		async (task: TaskItem) => {
			setPendingTaskIds((current) => new Set(current).add(task.id));
			try {
				const updatedTask = await setTaskCompleted({
					id: task.id,
					completed: !task.completed,
				}).unwrap();
				dispatch(updateTask(updatedTask));
				await dispatch(persistCache()).unwrap();
			} catch (error) {
			Alert.alert("Could not update task", getMutationErrorMessage(error));
			} finally {
				setPendingTaskIds((current) => {
					const next = new Set(current);
					next.delete(task.id);
					return next;
				});
			}
		},
		[dispatch, setTaskCompleted],
	);

	const renderTask = useCallback(
		({ item }: { item: TaskItem }) => (
			<TaskCard
				task={item}
				onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
				onToggle={() => void toggleTaskStatus(item)}
				toggleDisabled={pendingTaskIds.has(item.id)}
				onToggleStar={() => {
					dispatch(toggleStar(item.id));
					dispatch(persistCache());
				}}
			/>
		),
		[dispatch, navigation, pendingTaskIds, toggleTaskStatus],
	);

	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<TaskListHeader
				isOnline={isOnline}
				isRefreshing={refreshMode === "background"}
				lastRefreshed={lastRefreshed}
			/>
			<TaskFilterBar
				query={query}
				hasActiveFilters={hasActiveFilters}
				onQueryChange={setQuery}
				onOpenFilters={() => setFiltersVisible(true)}
			/>
			<FlatList
				data={visibleTasks}
				refreshing={refreshMode === "pull"}
				onRefresh={() => void refreshTasks("pull")}
				renderItem={renderTask}
				keyExtractor={(item) => item.id}
				style={styles.taskList}
				contentContainerStyle={styles.taskListContent}
				ListEmptyComponent={
					<Text style={styles.emptyText}>No tasks match these filters.</Text>
				}
			/>
			<Pressable
				accessibilityLabel="Add a task"
				onPress={() => navigation.navigate("TaskForm")}
				style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
			>
				<Ionicons name="add" size={32} color={Colors.background} />
			</Pressable>

			<AdvancedFiltersModal
				visible={filtersVisible}
				category={category}
				status={status}
				sortBy={sortBy}
				onCategoryChange={setCategory}
				onStatusChange={setStatus}
				onSortChange={setSortBy}
				onClose={() => setFiltersVisible(false)}
				categories={categories.map((item) => item.name)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	taskList: {
		backgroundColor: Colors.background,
		marginTop: 12,
	},
	taskListContent: {
		flexGrow: 1,
		paddingHorizontal: 18,
		paddingTop: 0,
		paddingBottom: 96,
	},
	emptyText: {
		color: Colors.icon,
		textAlign: "center",
		marginTop: 36,
		fontSize: 14,
	},
	fab: {
		position: "absolute",
		right: 22,
		bottom: 20,
		width: 58,
		height: 58,
		borderRadius: 29,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		shadowColor: Colors.text,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 7,
		elevation: 6,
	},
	fabPressed: {
		transform: [{ scale: 0.96 }],
		opacity: 0.9,
	},
});
