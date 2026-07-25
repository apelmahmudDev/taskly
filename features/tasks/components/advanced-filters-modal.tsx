import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { TaskSortOption, TaskStatusFilter } from "@/utils/filter-and-sort-tasks";
import { styles } from "./advanced-filters-modal.styles";
import { FilterChip } from "./filter-chip";

const STATUS_FILTERS: TaskStatusFilter[] = ["All", "Open", "Done"];
const SORT_OPTIONS: TaskSortOption[] = ["Due date", "Created time"];

type AdvancedFiltersModalProps = {
	visible: boolean;
	category: string;
	status: TaskStatusFilter;
	sortBy: TaskSortOption;
	onCategoryChange: (category: string) => void;
	onStatusChange: (status: TaskStatusFilter) => void;
	onSortChange: (sortBy: TaskSortOption) => void;
	onClose: () => void;
	categories: string[];
};

export function AdvancedFiltersModal({
	visible,
	category,
	status,
	sortBy,
	onCategoryChange,
	onStatusChange,
	onSortChange,
	onClose,
	categories,
}: AdvancedFiltersModalProps) {
	const resetFilters = () => {
		onCategoryChange("All");
		onStatusChange("All");
		onSortChange("Due date");
	};

	return (
		<Modal
			animationType="slide"
			transparent
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<Pressable
					accessibilityLabel="Close advanced filters"
					style={styles.backdrop}
					onPress={onClose}
				/>
				<View style={styles.bottomSheet}>
					<View style={styles.sheetHandle} />
					<View style={styles.sheetHeader}>
						<Text style={styles.sheetTitle}>Advanced filters</Text>
						<Pressable
							accessibilityLabel="Close advanced filters"
							hitSlop={10}
							onPress={onClose}
							style={styles.closeButton}
						>
							<Ionicons name="close" size={22} color={Colors.text} />
						</Pressable>
					</View>

					<Text style={styles.sectionLabel}>Category</Text>
					<View style={styles.sheetChipRow}>
						{["All", ...categories].map((item) => (
							<FilterChip
								key={item}
								label={item}
								selected={category === item}
								onPress={() => onCategoryChange(item)}
							/>
						))}
					</View>

					<Text style={styles.sectionLabel}>Status</Text>
					<View style={styles.sheetChipRow}>
						{STATUS_FILTERS.map((item) => (
							<FilterChip
								key={item}
								label={item}
								selected={status === item}
								onPress={() => onStatusChange(item)}
							/>
						))}
					</View>

					<Text style={styles.sectionLabel}>Sort by</Text>
					<View style={styles.sheetChipRow}>
						{SORT_OPTIONS.map((item) => (
							<FilterChip
								key={item}
								label={item}
								selected={sortBy === item}
								onPress={() => onSortChange(item)}
							/>
						))}
					</View>

					<View style={styles.sheetActions}>
						<Pressable onPress={resetFilters} style={styles.clearButton}>
							<Text style={styles.clearButtonText}>Reset</Text>
						</Pressable>
						<Pressable onPress={onClose} style={styles.applyButton}>
							<Text style={styles.applyButtonText}>Show results</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}
