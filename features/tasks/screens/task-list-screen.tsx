import Ionicons from "@expo/vector-icons/Ionicons";
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import type { TasksScreenProps } from "@/navigation/navigation-types";
import { persistCache } from "@/store/persistence/cache";
import { useLazyGetCategoriesQuery } from "@/store/services/categories-api";
import { useLazyGetTasksQuery } from "@/store/services/tasks-api";
import { setCategories } from "@/store/slices/categories-slice";
import { setRemoteTasks, toggleStar } from "@/store/slices/tasks-slice";
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
import { mergeRemoteTasks } from "../utils/task-mapper";

export function TaskListScreen({ navigation }: TasksScreenProps) {
	const dispatch = useAppDispatch();
	const {
		items: tasks,
		hydrated,
		lastRefreshed,
	} = useAppSelector((state) => state.tasks);
	const categories = useAppSelector((state) => state.categories.items);
	const [isOnline, setIsOnline] = useState(true);
	const [getTasks, tasksRequest] = useLazyGetTasksQuery();
	const [getCategories] = useLazyGetCategoriesQuery();
	const tasksRef = useRef(tasks);
	tasksRef.current = tasks;
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");
	const [status, setStatus] = useState<TaskStatusFilter>("All");
	const [sortBy, setSortBy] = useState<TaskSortOption>("Due date");
	const [filtersVisible, setFiltersVisible] = useState(false);
	const debouncedQuery = useDebouncedValue(query, 300);
	const hasActiveFilters = category !== "All" || status !== "All";

	useEffect(
		() =>
			NetInfo.addEventListener((state) =>
				setIsOnline(Boolean(state.isConnected)),
			),
		[],
	);
	useEffect(() => {
		if (!hydrated || !isOnline) return;
		void Promise.all([getTasks().unwrap(), getCategories().unwrap()])
			.then(([remoteTasks, remoteCategories]) => {
				dispatch(
					setRemoteTasks({
						tasks: mergeRemoteTasks(remoteTasks, tasksRef.current),
						refreshedAt: new Date().toISOString(),
					}),
				);
				dispatch(setCategories(remoteCategories));
				dispatch(persistCache());
			})
			.catch(() => undefined);
	}, [dispatch, getCategories, getTasks, hydrated, isOnline]);

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

	const renderTask = useCallback(
		({ item }: { item: TaskItem }) => (
			<TaskCard
				task={item}
				onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
				onToggle={() => undefined}
				onToggleStar={() => {
					dispatch(toggleStar(item.id));
					dispatch(persistCache());
				}}
			/>
		),
		[dispatch, navigation],
	);

	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<TaskListHeader isOnline={isOnline} />
			{tasksRequest.isFetching && (
				<ActivityIndicator
					accessibilityLabel="Refreshing tasks"
					color={Colors.primary}
				/>
			)}
			{lastRefreshed && (
				<Text style={styles.refreshed}>
					Last refreshed {new Date(lastRefreshed).toLocaleString()}
				</Text>
			)}
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
				categories={categories.map((item) => item.name)}
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
	refreshed: {
		color: Colors.icon,
		fontSize: 10,
		textAlign: "center",
		paddingBottom: 4,
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
