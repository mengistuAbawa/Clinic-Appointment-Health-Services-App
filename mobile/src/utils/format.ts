/** Human-readable date and time formatting for appointment cards and slots. */
import { format, isToday, isTomorrow, parseISO } from "date-fns";
export function formatDate(value: string): string { const date = parseISO(value); return isToday(date) ? `Today, ${format(date, "MMM d")}` : isTomorrow(date) ? `Tomorrow, ${format(date, "MMM d")}` : format(date, "EEE, MMM d"); }
export function formatTime(value: string): string { return format(parseISO(value), "h:mm a"); }
