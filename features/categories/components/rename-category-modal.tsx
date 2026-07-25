import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";

type RenameCategoryModalProps = {
	visible: boolean;
	name: string;
	isSaving: boolean;
	onNameChange: (name: string) => void;
	onSave: () => void;
	onClose: () => void;
};

export function RenameCategoryModal({
	visible,
	name,
	isSaving,
	onNameChange,
	onSave,
	onClose,
}: RenameCategoryModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={isSaving ? undefined : onClose}
		>
			<View style={styles.overlay}>
				<Pressable
					style={StyleSheet.absoluteFill}
					onPress={isSaving ? undefined : onClose}
					accessibilityLabel="Close rename category"
				/>
				<SafeAreaView style={styles.sheet} edges={["bottom"]}>
					<Text style={styles.title}>Rename category</Text>
					<Input
						value={name}
						onChangeText={onNameChange}
						onSubmitEditing={onSave}
						placeholder="Category name"
						autoFocus
						editable={!isSaving}
					/>
					<View style={styles.actions}>
						<Pressable
							disabled={isSaving}
							onPress={onClose}
							style={styles.button}
						>
							<Text style={styles.cancelText}>Cancel</Text>
						</Pressable>
						<Pressable
							disabled={isSaving || !name.trim()}
							onPress={onSave}
							style={[
								styles.button,
								styles.saveButton,
								(isSaving || !name.trim()) && styles.disabled,
							]}
						>
							{isSaving ? (
								<ActivityIndicator size="small" color={Colors.background} />
							) : (
								<Text style={styles.saveText}>Save</Text>
							)}
						</Pressable>
					</View>
				</SafeAreaView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.3)",
	},
	sheet: {
		padding: 22,
		gap: 18,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		backgroundColor: Colors.background,
	},
	title: {
		color: Colors.text,
		fontSize: 20,
		fontWeight: "800",
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
	},
	button: {
		minWidth: 88,
		height: 44,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	saveButton: {
		backgroundColor: Colors.primary,
	},
	cancelText: {
		color: Colors.text,
		fontWeight: "700",
	},
	saveText: {
		color: Colors.background,
		fontWeight: "800",
	},
	disabled: {
		opacity: 0.5,
	},
});
