import { format, isValid, parseISO } from "date-fns";

function parseDate(value: string) {
	if (!value) return null;
	const isoDate = parseISO(value);
	if (isValid(isoDate)) return isoDate;
	const fallback = new Date(value.replace(" at ", " "));
	return isValid(fallback) ? fallback : null;
}

export function formatDate(value: string, fallback = "Unavailable") {
	const date = parseDate(value);
	return date ? format(date, "MMM d, yyyy") : fallback;
}

export function formatDateTime(value: string, fallback = "Unavailable") {
	const date = parseDate(value);
	return date ? format(date, "MMM d, yyyy 'at' h:mm a") : fallback;
}
