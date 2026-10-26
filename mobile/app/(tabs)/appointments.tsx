/** Upcoming and past appointments with caching, pagination, and cancellation. */
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import { fetchAppointments, restoreAppointments } from "../../src/store/appointmentsSlice";
import { appointmentsApi } from "../../src/api/appointments";
import { AppointmentCard } from "../../src/components/AppointmentCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingView } from "../../src/components/LoadingView";
import { SkeletonCard } from "../../src/components/SkeletonCard";
import { Button } from "../../src/components/Button";
import { colors, spacing } from "../../src/constants/theme";
import { cache } from "../../src/utils/storage";
import { cancelAppointmentNotifications } from "../../src/utils/notifications";
import { Appointment, Page } from "../../src/types";

type AppointmentTab = "upcoming" | "past";

export default function AppointmentsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.appointments);
  const [tab, setTab] = useState<AppointmentTab>("upcoming");

  const load = useCallback(async (page = 1) => {
    if (page === 1) {
      const saved = await cache.get<Page<Appointment>>(`appointments:${tab}`);
      if (saved) dispatch(restoreAppointments(saved));
    }
    return dispatch(fetchAppointments({ status: tab, page }));
  }, [dispatch, tab]);

  useEffect(() => { void load(); }, [load]);

  const handleEnd = useCallback(() => {
    if (!state.loading && state.hasMore) void load(state.page + 1);
  }, [load, state.hasMore, state.loading, state.page]);

  const selectTab = useCallback((next: AppointmentTab) => {
    if (next === tab) return;
    setTab(next);
    dispatch(restoreAppointments({ data: [], page: 1, limit: 10, total: 0, hasMore: true }));
  }, [dispatch, tab]);

  const cancel = useCallback((id: string) => {
    Alert.alert("Cancel appointment?", "This will release the reserved time.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel visit",
        style: "destructive",
        onPress: async () => {
          try {
            await appointmentsApi.cancel(id);
            try { await cancelAppointmentNotifications(id); } catch { /* A notification cleanup failure does not reverse the API cancellation. */ }
            await load();
          } catch (error) {
            Alert.alert("Could not cancel", error instanceof Error ? error.message : "Check your connection and try again.");
          }
        },
      },
    ]);
  }, [load]);

  const renderItem = useCallback(({ item }: { item: Appointment }) => (
    <AppointmentCard appointment={item} onCancel={tab === "upcoming" ? () => cancel(item.id) : undefined} />
  ), [cancel, tab]);

  if (state.loading && !state.data.length && !state.error) {
    return <SafeAreaView style={styles.safe}><View style={styles.skeletons}><SkeletonCard /><SkeletonCard /></View></SafeAreaView>;
  }
  if (state.error && !state.data.length) {
    return <ErrorState message={state.error} onRetry={() => void load()} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Your appointments</Text>
        <View style={styles.tabs}>
          <Button title="Upcoming" variant={tab === "upcoming" ? "primary" : "secondary"} onPress={() => selectTab("upcoming")} />
          <Button title="Past" variant={tab === "past" ? "primary" : "secondary"} onPress={() => selectTab("past")} />
        </View>
        {state.error ? <Text accessibilityRole="alert" style={styles.staleError}>{state.error}</Text> : null}
      </View>
      <FlatList
        data={state.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        onEndReachedThreshold={0.4}
        onEndReached={handleEnd}
        refreshControl={<RefreshControl refreshing={state.loading && state.data.length > 0} onRefresh={() => void load()} tintColor={colors.primary} />}
        ListFooterComponent={state.loading && state.data.length ? <Text style={styles.loadingMore}>Loading more…</Text> : undefined}
        ListEmptyComponent={<EmptyState title={tab === "upcoming" ? "No upcoming visits" : "No past visits"} message={tab === "upcoming" ? "Book a provider to see your next appointment here." : "Completed and cancelled visits will appear here."} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, gap: spacing.md },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  tabs: { flexDirection: "row", gap: spacing.sm },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 },
  skeletons: { padding: spacing.md },
  staleError: { color: colors.warning, fontSize: 13 },
  loadingMore: { color: colors.muted, textAlign: "center", padding: spacing.md },
});
