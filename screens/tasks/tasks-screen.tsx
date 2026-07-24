import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import {
	FlatList,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterChip } from "@/components/ui/filter-chip";
import { TaskCard } from "@/components/ui/task-card";
import { Colors } from "@/constants/theme";
import { TASKS } from "@/data/tasks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TasksScreenProps } from "@/navigation/types";
import type { TaskItem } from "@/types/task";
import { styles } from "./tasks-screen.styles";

const CATEGORY_FILTERS = ["All", "Work", "Personal", "Shopping", "Health"];
const STATUS_FILTERS = ["All", "Open", "Done"];

export function TasksScreen({ navigation }: TasksScreenProps) {
	const [tasks, setTasks] = useState(TASKS);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");
	const [status, setStatus] = useState("All");
	const debouncedQuery = useDebouncedValue(query, 300);

	const visibleTasks = useMemo(() => {
		const normalizedQuery = debouncedQuery.trim().toLowerCase();
		return tasks.filter((task) => {
			const matchesQuery = task.title.toLowerCase().includes(normalizedQuery);
			const matchesCategory = category === "All" || task.category === category;
			const matchesStatus =
				status === "All" ||
				(status === "Done" ? task.completed : !task.completed);
			return matchesQuery && matchesCategory && matchesStatus;
		});
	}, [category, debouncedQuery, status, tasks]);

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
			<View style={styles.header}>
				<Text style={styles.title}>Taskly</Text>
				<View style={styles.headerActions}>
					<View style={styles.offlineStatus}>
						<View style={styles.onlineDot} />
						<Text style={styles.offlineText}>Offline</Text>
					</View>
					<Pressable
						accessibilityLabel="Open task menu"
						hitSlop={10}
						style={styles.iconButton}
					>
						<Ionicons name="menu-outline" size={24} color={Colors.text} />
					</Pressable>
				</View>
			</View>
			<View style={styles.searchRow}>
				<View style={styles.searchBox}>
					<Ionicons name="search-outline" size={20} color={Colors.primary} />
					<TextInput
						accessibilityLabel="Search tasks"
						placeholder="Search tasks..."
						placeholderTextColor={Colors.primarySoft}
						selectionColor={Colors.primary}
						style={styles.searchInput}
						value={query}
						onChangeText={setQuery}
					/>
				</View>
				<Pressable
					accessibilityLabel="Filter tasks"
					style={styles.filterButton}
				>
					<Ionicons name="filter" size={20} color={Colors.text} />
				</Pressable>
			</View>
			<ScrollView
				horizontal
				style={styles.categoryScroller}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.chipRow}
			>
				{CATEGORY_FILTERS.map((item) => (
					<FilterChip
						key={item}
						label={item}
						selected={category === item}
						onPress={() => setCategory(item)}
					/>
				))}
			</ScrollView>
			<View style={styles.statusRow}>
				<View style={styles.statusChips}>
					{STATUS_FILTERS.map((item) => (
						<FilterChip
							key={item}
							label={item}
							selected={status === item}
							onPress={() => setStatus(item)}
						/>
					))}
				</View>
				<Pressable
					style={styles.sortButton}
					accessibilityLabel="Sort by due date"
				>
					<Text style={styles.sortLabel}>Sort: Due Date</Text>
					<Ionicons name="chevron-down" size={14} color={Colors.text} />
				</Pressable>
			</View>
			<FlatList
				data={visibleTasks}
				renderItem={renderTask}
				keyExtractor={(item) => item.id}
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
		</SafeAreaView>
	);
}
