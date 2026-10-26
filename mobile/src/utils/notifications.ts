/** Local booking confirmations, 30-minute reminders, and cancellation cleanup. */
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Appointment } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("appointments", {
      name: "Appointments",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

export async function notifyBooking(appointment: Appointment): Promise<void> {
  if (!(await ensureNotificationPermission())) return;
  const notificationData = { appointmentId: appointment.id };
  const platformContent = Platform.OS === "android" ? { channelId: "appointments" } : {};

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Appointment confirmed",
      body: `Your visit with ${appointment.provider.name} is booked.`,
      data: notificationData,
      ...platformContent,
    },
    trigger: null,
  });

  const reminder = new Date(new Date(appointment.slot.startTime).getTime() - 30 * 60 * 1000);
  if (reminder.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Appointment reminder",
        body: `Your appointment with ${appointment.provider.name} starts in 30 minutes.`,
        data: notificationData,
        ...platformContent,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder },
    });
  }
}

export async function cancelAppointmentNotifications(appointmentId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matching = scheduled.filter((notification) => notification.content.data?.appointmentId === appointmentId);
  await Promise.all(matching.map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier)));
}
