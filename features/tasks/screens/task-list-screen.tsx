import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { TASKS } from "@/features/tasks/data/tasks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TasksScreenProps } from "@/navigation/navigation-types";
import { AdvancedFiltersModal } from "../components/advanced-filters-modal";
import { TaskCard } from "../components/task-card";
import { TaskFilterBar } from "../components/task-filter-bar";
import { TaskListHeader } from "../components/task-list-header";
import type { TaskItem } from "../types";
import {
	selectVisibleTasks,
	type TaskSortOption,
	type TaskStatusFilter,
} from "../utils/filter-and-sort-tasks";

export function TaskListScreen({ navigation }: TasksScreenProps) {
	const [tasks, setTasks] = useState(TASKS);
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

	const updateTask = useCallback((id: string, change: Partial<TaskItem>) => {
		setTasks((current) =>
			current.map((task) => (task.id === id ? { ...task, ...change } : task)),
		);
	}, []);

	const renderTask = useCallback(
		({ item }: { item: TaskItem }) => (
			<TaskCard
				task={item}
				onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
				onToggle={() => updateTask(item.id, { completed: !item.completed })}
				onToggleStar={() => updateTask(item.id, { starred: !item.starred })}
			/>
		),
		[navigation, updateTask],
	);

	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<TaskListHeader isOnline={false} />
			<TaskFilterBar
				query={query}
				hasActiveFilters={hasActiveFilters}
				onQueryChange={setQuery}
				onOpenFilters={() => setFiltersVisible(true)}
			/>
			<FlatList
				data={visibleTasks}
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
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: Colors.background },
	taskList: { backgroundColor: Colors.background },
	taskListContent: {
		flexGrow: 1,
		paddingHorizontal: 18,
		paddingTop: 14,
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
	fabPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
});
