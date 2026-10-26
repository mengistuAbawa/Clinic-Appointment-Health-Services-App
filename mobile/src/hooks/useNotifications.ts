/** Notification permission, booking confirmation, and scheduled reminders. */
import { useCallback } from "react";
import * as Notifications from "expo-notifications";
import { Appointment } from "../types";
import { notifyBooking } from "../utils/notifications";

export function useNotifications() {
  const requestPermission = useCallback(async () => {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  }, []);

  const scheduleReminder = useCallback(async (title: string, body: string, at: Date) => {
    if (at.getTime() <= Date.now() || !(await requestPermission())) return null;
    return Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
    });
  }, [requestPermission]);

  const confirmBooking = useCallback((appointment: Appointment) => notifyBooking(appointment), []);
  return { requestPermission, scheduleReminder, confirmBooking };
}
