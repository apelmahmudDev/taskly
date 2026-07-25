import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { persistCache } from "@/store/persistence/cache";
import { useLazyGetCategoriesQuery } from "@/store/services/categories-api";
import { useLazyGetTasksQuery } from "@/store/services/tasks-api";
import { setCategories } from "@/store/slices/categories-slice";
import { setRemoteTasks } from "@/store/slices/tasks-slice";
import { getMutationErrorMessage } from "@/utils/get-mutation-error-message";
import { mergeRemoteTasks } from "../utils/task-mapper";

type RefreshMode = "background" | "pull";

export function useTaskSync() {
	const dispatch = useAppDispatch();
	const tasks = useAppSelector((state) => state.tasks.items);
	const hydrated = useAppSelector((state) => state.tasks.hydrated);
	const [isOnline, setIsOnline] = useState(true);
	const [refreshMode, setRefreshMode] = useState<RefreshMode | null>(null);
	const [getTasks] = useLazyGetTasksQuery();
	const [getCategories] = useLazyGetCategoriesQuery();

	const tasksRef = useRef(tasks);
	tasksRef.current = tasks;

	useEffect(
		() =>
			NetInfo.addEventListener((state) =>
				setIsOnline(Boolean(state.isConnected)),
			),
		[],
	);

	const refreshTasks = useCallback(
		async (mode: RefreshMode) => {
			if (!isOnline) {
				if (mode === "pull") {
					Alert.alert(
						"You're offline",
						"Connect to the internet to refresh your tasks.",
					);
				}
				return;
			}

			setRefreshMode(mode);

			try {
				const [remoteTasks, remoteCategories] = await Promise.all([
					getTasks().unwrap(),
					getCategories().unwrap(),
				]);
				dispatch(
					setRemoteTasks({
						tasks: mergeRemoteTasks(remoteTasks, tasksRef.current),
						refreshedAt: new Date().toISOString(),
					}),
				);
				dispatch(setCategories(remoteCategories));
				await dispatch(persistCache()).unwrap();
			} catch (error) {
				if (mode === "pull") {
					Alert.alert(
						"Could not refresh tasks",
						getMutationErrorMessage(
							error,
							"Your cached tasks are still available. Please try again.",
						),
					);
				}
			} finally {
				setRefreshMode(null);
			}
		},
		[dispatch, getCategories, getTasks, isOnline],
	);

	useEffect(() => {
		if (!hydrated || !isOnline) return;
		void refreshTasks("background");
	}, [hydrated, isOnline, refreshTasks]);

	return { isOnline, refreshMode, refreshTasks };
}
