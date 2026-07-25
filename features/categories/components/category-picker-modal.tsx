import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import type { Category } from "@/features/tasks/types";

type CategoryPickerModalProps = {
	visible: boolean;
	categories: Category[];
	selectedId: string;
	onSelect: (category: Category) => void;
	onClose: () => void;
};

export function CategoryPickerModal({
	visible,
	categories,
	selectedId,
	onSelect,
	onClose,
}: CategoryPickerModalProps) {
	return (
		<Modal
			animationType="slide"
			transparent
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<Pressable
					accessibilityLabel="Close category picker"
					style={styles.backdrop}
					onPress={onClose}
				/>
				<View style={styles.bottomSheet}>
					<View style={styles.sheetHandle} />
					<View style={styles.sheetHeader}>
						<Text style={styles.sheetTitle}>Choose category</Text>
						<Pressable
							accessibilityLabel="Close category picker"
							hitSlop={10}
							onPress={onClose}
							style={styles.closeButton}
						>
							<Ionicons name="close" size={22} color={Colors.text} />
						</Pressable>
					</View>
					<View style={styles.chipRow}>
						{categories.map((category) => (
							<Button
								key={category.id}
								variant="chip"
								selected={selectedId === category.id}
								onPress={() => {
									onSelect(category);
									onClose();
								}}
							>
								{category.name}
							</Button>
						))}
					</View>
					{categories.length === 0 && (
						<Text style={styles.emptyText}>
							Add a category from the Categories tab first.
						</Text>
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: { flex: 1, justifyContent: "flex-end" },
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(46, 46, 46, 0.45)",
	},
	bottomSheet: {
		backgroundColor: Colors.background,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 22,
		paddingTop: 10,
		paddingBottom: 30,
	},
	sheetHandle: {
		alignSelf: "center",
		width: 42,
		height: 5,
		borderRadius: 3,
		backgroundColor: Colors.primarySoft,
		marginBottom: 14,
	},
	sheetHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 22,
	},
	sheetTitle: { color: Colors.text, fontSize: 21, fontWeight: "800" },
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.surface,
	},
	chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
	emptyText: { color: Colors.text, fontSize: 13, fontWeight: "700" },
});
