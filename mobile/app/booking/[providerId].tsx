/** Date and slot selection, atomic booking, and local reminder scheduling. */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { addDays, format, startOfDay } from "date-fns";
import { clinicsApi } from "../../src/api/clinics";
import { appointmentsApi } from "../../src/api/appointments";
import { Provider, Slot } from "../../src/types";
import { DateScroller } from "../../src/components/DateScroller";
import { SlotPicker } from "../../src/components/SlotPicker";
import { Button } from "../../src/components/Button";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingView } from "../../src/components/LoadingView";
import { useNotifications } from "../../src/hooks/useNotifications";
import { apiMessage } from "../../src/api/client";
import { colors, spacing } from "../../src/constants/theme";

export default function BookingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providerLoading, setProviderLoading] = useState(true);
  const [providerError, setProviderError] = useState("");
  const [date, setDate] = useState(() => startOfDay(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [booking, setBooking] = useState(false);
  const { confirmBooking } = useNotifications();
  const dateOptions = useMemo(() => Array.from({ length: 14 }, (_, index) => addDays(startOfDay(new Date()), index)), []);

  const loadProvider = useCallback(async () => {
    setProviderLoading(true);
    setProviderError("");
    try {
      setProvider(await clinicsApi.provider(providerId));
    } catch (error) {
      setProviderError(apiMessage(error, "Unable to load provider details."));
    } finally {
      setProviderLoading(false);
    }
  }, [providerId]);

  const loadSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError("");
    setSlots([]);
    setSelected(null);
    try {
      setSlots(await clinicsApi.slots(providerId, format(date, "yyyy-MM-dd")));
    } catch (error) {
      setSlotsError(apiMessage(error, "Unable to load appointment times."));
    } finally {
      setSlotsLoading(false);
    }
  }, [date, providerId]);

  useEffect(() => { void loadProvider(); }, [loadProvider]);
  useEffect(() => { void loadSlots(); }, [loadSlots]);

  const confirm = useCallback(() => {
    if (!selected || !provider || booking) return;
    const dateLabel = format(new Date(selected.startTime), "EEE, MMM d 'at' h:mm a");
    Alert.alert("Confirm appointment", `Book ${provider.name} on ${dateLabel}?`, [
      { text: "Back", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setBooking(true);
          try {
            const appointment = await appointmentsApi.create(selected.id);
            try { await confirmBooking(appointment); } catch { /* Notification permission or OS scheduling cannot undo a successful booking. */ }
            Alert.alert("Appointment booked", "Your visit is confirmed.", [
              { text: "View appointments", onPress: () => router.replace("/(tabs)/appointments") },
            ]);
          } catch (error) {
            Alert.alert("Booking failed", apiMessage(error, "That time may have just been taken. Refresh and try again."));
            await loadSlots();
          } finally {
            setBooking(false);
          }
        },
      },
    ]);
  }, [booking, confirmBooking, loadSlots, provider, selected]);

  if (providerLoading && !provider) return <LoadingView label="Loading provider…" />;
  if (providerError && !provider) return <ErrorState message={providerError} onRetry={() => { void loadProvider(); }} />;
  if (!provider) return <ErrorState message="Provider not found." onRetry={() => { void loadProvider(); }} />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Back</Text></Pressable>
        <Text style={styles.title}>Choose a time</Text>
        <Text style={styles.subtitle}>{provider.name} · {provider.specialty}</Text>
        <DateScroller selectedDate={date} onSelect={setDate} days={dateOptions.length} />
        <View style={styles.sectionHeader}>
          <Text style={styles.section}>{format(date, "MMMM d, yyyy")}</Text>
          {slotsLoading ? <Text style={styles.checking}>Checking times…</Text> : null}
        </View>
        {slotsLoading ? <LoadingView label="Checking available times…" /> : slotsError ? <>
          <Text accessibilityRole="alert" style={styles.error}>{slotsError}</Text>
          <Button title="Retry" variant="secondary" onPress={() => { void loadSlots(); }} />
        </> : <SlotPicker slots={slots} selected={selected?.id ?? null} onSelect={setSelected} />}
        <View style={styles.confirm}>
          <Button title="Confirm appointment" loading={booking} disabled={!selected || slotsLoading || Boolean(slotsError)} onPress={confirm} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1, gap: spacing.sm },
  back: { alignSelf: "flex-start", paddingVertical: spacing.xs },
  backText: { color: colors.primary, fontWeight: "700", fontSize: 16 },
  title: { color: colors.text, fontWeight: "800", fontSize: 25, marginTop: spacing.sm },
  subtitle: { color: colors.muted },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm },
  section: { color: colors.text, fontWeight: "700" },
  checking: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, marginVertical: spacing.sm },
  confirm: { marginTop: spacing.lg },
});
