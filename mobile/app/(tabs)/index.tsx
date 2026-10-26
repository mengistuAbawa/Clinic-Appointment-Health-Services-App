/** Clinic discovery with cached results, search, filters, location, and paging. */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import { fetchClinics, resetClinics, restoreClinics } from "../../src/store/clinicsSlice";
import { fetchFavorites, toggleFavorite } from "../../src/store/favoritesSlice";
import { Clinic, Page } from "../../src/types";
import { ClinicCard } from "../../src/components/ClinicCard";
import { SearchBar } from "../../src/components/SearchBar";
import { FilterChips } from "../../src/components/FilterChips";
import { SkeletonCard } from "../../src/components/SkeletonCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { useLocation } from "../../src/hooks/useLocation";
import { colors, spacing } from "../../src/constants/theme";
import { cache } from "../../src/utils/storage";

type SortMode = "name" | "distance";

export default function ClinicsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const clinics = useSelector((state: RootState) => state.clinics);
  const favorites = useSelector((state: RootState) => state.favorites.data);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortMode>("name");
  const { location, locate, loading: locating, error: locationError } = useLocation();

  const params = useMemo(() => ({
    search,
    category: category === "All" ? undefined : category,
    page: 1,
    limit: 10,
    sort,
    lat: location?.latitude,
    lng: location?.longitude,
  }), [category, location?.latitude, location?.longitude, search, sort]);

  const load = useCallback(async (page = 1) => {
    const request = { ...params, page };
    if (page === 1) {
      const saved = await cache.get<Page<Clinic>>(`clinics:${JSON.stringify(request)}`);
      if (saved) dispatch(restoreClinics(saved));
    }
    return dispatch(fetchClinics(request));
  }, [dispatch, params]);

  useEffect(() => {
    dispatch(resetClinics());
    void load(1);
  }, [dispatch, load]);
  useEffect(() => { void dispatch(fetchFavorites()); }, [dispatch]);

  const favoriteIds = useMemo(() => new Set(favorites.map((favorite) => favorite.clinicId)), [favorites]);
  const handleEnd = useCallback(() => {
    if (!clinics.loading && clinics.hasMore) void load(clinics.page + 1);
  }, [clinics.hasMore, clinics.loading, clinics.page, load]);
  const renderItem = useCallback(({ item }: { item: Clinic }) => (
    <ClinicCard
      clinic={item}
      favorite={favoriteIds.has(item.id)}
      onPress={() => router.push(`/clinic/${item.id}`)}
      onFavorite={() => { void dispatch(toggleFavorite(item)); }}
    />
  ), [dispatch, favoriteIds]);

  const sortByDistance = async () => {
    const coordinates = location ?? await locate();
    if (coordinates) setSort("distance");
  };

  if (clinics.loading && !clinics.data.length && !clinics.error) {
    return <SafeAreaView style={styles.safe}><View style={styles.skeletons}><SkeletonCard /><SkeletonCard /></View></SafeAreaView>;
  }
  if (clinics.error && !clinics.data.length) {
    return <ErrorState message={clinics.error} onRetry={() => { void load(1); }} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Find care near you</Text>
        <Text style={styles.subtitle}>Clinics and specialists in Addis Ababa</Text>
        <SearchBar value={search} onChange={setSearch} />
        <FilterChips selected={category} onSelect={setCategory} />
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: sort === "name" }} onPress={() => setSort("name")} style={[styles.pill, sort === "name" && styles.selected]}>
            <Text style={[styles.actionText, sort === "name" && styles.selectedText]}>A–Z</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: sort === "distance" }} disabled={locating} onPress={() => { void sortByDistance(); }} style={[styles.pill, sort === "distance" && styles.selected]}>
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color={sort === "distance" ? colors.white : colors.primary} />
            <Text style={[styles.actionText, sort === "distance" && styles.selectedText]}>{locating ? "Locating…" : "Near me"}</Text>
          </Pressable>
        </View>
        {locationError ? <Text accessibilityRole="alert" style={styles.hint}>{locationError}</Text> : null}
        {clinics.error ? <View style={styles.staleError}>
          <Text accessibilityRole="alert" style={styles.hint}>{clinics.error}</Text>
          <Pressable accessibilityRole="button" onPress={() => { void load(1); }}><Text style={styles.retry}>Retry</Text></Pressable>
        </View> : null}
      </View>
      <FlatList
        data={clinics.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        onEndReached={handleEnd}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={clinics.loading && clinics.data.length > 0} onRefresh={() => { void load(1); }} tintColor={colors.primary} />}
        ListEmptyComponent={!clinics.loading ? <EmptyState title="No clinics found" message="Try another search or category." onAction={() => { setSearch(""); setCategory("All"); }} action="Clear filters" /> : undefined}
        ListFooterComponent={clinics.loading && clinics.data.length ? <ActivityIndicator color={colors.primary} style={styles.loadingMore} /> : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, gap: spacing.sm },
  greeting: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.muted, marginBottom: spacing.xs },
  actions: { flexDirection: "row", gap: spacing.sm },
  pill: { minHeight: 38, paddingHorizontal: spacing.md, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionText: { color: colors.primary, fontWeight: "700" },
  selectedText: { color: colors.white },
  hint: { color: colors.warning, fontSize: 12 },
  staleError: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  retry: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 },
  skeletons: { padding: spacing.md },
  loadingMore: { padding: spacing.md },
});
