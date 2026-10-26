/** Saved clinic list with optimistic favorite actions and retry states. */
import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import { fetchFavorites, toggleFavorite } from "../../src/store/favoritesSlice";
import { Favorite } from "../../src/types";
import { ClinicCard } from "../../src/components/ClinicCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { SkeletonCard } from "../../src/components/SkeletonCard";
import { colors, spacing } from "../../src/constants/theme";

export default function FavoritesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.favorites);
  const savedIds = useMemo(() => new Set(state.data.map((favorite) => favorite.clinicId)), [state.data]);
  const load = useCallback(() => dispatch(fetchFavorites()), [dispatch]);
  useEffect(() => { void load(); }, [load]);

  const renderItem = useCallback(({ item }: { item: Favorite }) => (
    <ClinicCard
      clinic={item.clinic}
      favorite={savedIds.has(item.clinicId)}
      onPress={() => router.push(`/clinic/${item.clinicId}`)}
      onFavorite={() => { void dispatch(toggleFavorite(item.clinic)); }}
    />
  ), [dispatch, savedIds]);

  if (state.loading && !state.data.length) {
    return <SafeAreaView style={styles.safe}><View style={styles.skeletons}><SkeletonCard /><SkeletonCard /></View></SafeAreaView>;
  }
  if (state.error && !state.data.length) return <ErrorState message={state.error} onRetry={() => { void load(); }} />;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={state.data}
        keyExtractor={(item) => item.clinicId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        refreshControl={<RefreshControl refreshing={state.loading && state.data.length > 0} onRefresh={() => { void load(); }} tintColor={colors.primary} />}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>Saved clinics</Text>{state.error ? <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text> : null}</View>}
        ListEmptyComponent={<EmptyState title="No saved clinics yet" message="Tap the heart on a clinic to keep it here." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingBottom: spacing.md, gap: spacing.sm },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  list: { padding: spacing.md, flexGrow: 1 },
  skeletons: { padding: spacing.md },
  error: { color: colors.warning, fontSize: 13 },
});
