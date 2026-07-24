import { Button } from "@/components/ui/button";

type FilterChipProps = {
	label: string;
	selected?: boolean;
	onPress: () => void;
};

export function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
	return (
		<Button
			onPress={onPress}
			selected={selected}
			variant="chip"
		>
			{label}
		</Button>
	);
}
