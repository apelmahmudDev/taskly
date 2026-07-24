import { useState } from "react";
import {
	StyleSheet,
	TextInput,
	type TextInputProps,
} from "react-native";

import { Colors } from "@/constants/theme";

export function Input({
	onBlur,
	onFocus,
	placeholderTextColor = Colors.primarySoft,
	selectionColor = Colors.primary,
	style,
	...textInputProps
}: TextInputProps) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<TextInput
			placeholderTextColor={placeholderTextColor}
			selectionColor={selectionColor}
			style={[
				styles.input,
				textInputProps.multiline && styles.multiline,
				isFocused && styles.focused,
				style,
			]}
			onFocus={(event) => {
				setIsFocused(true);
				onFocus?.(event);
			}}
			onBlur={(event) => {
				setIsFocused(false);
				onBlur?.(event);
			}}
			{...textInputProps}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		minHeight: 50,
		borderRadius: 13,
		paddingHorizontal: 15,
		color: Colors.text,
		backgroundColor: Colors.surface,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(46, 46, 46, 0.1)",
	},
	focused: {
		borderWidth: 1,
		borderColor: Colors.borderSoft,
	},
	multiline: {
		paddingTop: 14,
		textAlignVertical: "top",
	},
});
