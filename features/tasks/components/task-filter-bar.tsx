import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";

type TaskFilterBarProps = {
	query: string;
	hasActiveFilters: boolean;
	onQueryChange: (query: string) => void;
	onOpenFilters: () => void;
};

export function TaskFilterBar({ query, hasActiveFilters, onQueryChange, onOpenFilters }: TaskFilterBarProps) {
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	return (
		<View style={styles.row}>
			<View style={[styles.searchBox, isSearchFocused && styles.focusedSearchBox]}>
				<Ionicons name="search-outline" size={20} color={Colors.primary} />
				<TextInput
					accessibilityLabel="Search tasks"
					placeholder="Search tasks..."
					placeholderTextColor={Colors.primarySoft}
					selectionColor={Colors.primary}
					style={styles.input}
					value={query}
					onChangeText={onQueryChange}
					onFocus={() => setIsSearchFocused(true)}
					onBlur={() => setIsSearchFocused(false)}
				/>
			</View>
			<Pressable
				accessibilityLabel="Open advanced filters"
				accessibilityHint="Filter tasks by category and status, or change their sort order"
				onPress={onOpenFilters}
				style={[styles.filterButton, hasActiveFilters && styles.activeFilterButton]}
			>
				<Ionicons name="options-outline" size={21} color={hasActiveFilters ? Colors.background : Colors.text} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row", paddingHorizontal: 18, gap: 10 },
	searchBox: {
		flex: 1,
		height: 48,
		borderRadius: 16,
		paddingHorizontal: 15,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		backgroundColor: Colors.surface,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(46, 46, 46, 0.1)",
	},
	focusedSearchBox: { borderWidth: 1, borderColor: Colors.borderSoft },
	input: { flex: 1, height: "100%", paddingVertical: 0, color: Colors.text, fontSize: 14 },
	filterButton: {
		width: 48,
		height: 48,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.surface,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(46, 46, 46, 0.1)",
	},
	activeFilterButton: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});
