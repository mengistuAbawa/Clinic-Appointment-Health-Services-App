/** Clinic contact details, native map, and linked provider list. */
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { clinicsApi } from "../../src/api/clinics";
import { Clinic, Provider } from "../../src/types";
import { ProviderCard } from "../../src/components/ProviderCard";
import { ClinicMap } from "../../src/components/ClinicMap";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingView } from "../../src/components/LoadingView";
import { apiMessage } from "../../src/api/client";
import { colors, spacing } from "../../src/constants/theme";

export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setClinic(await clinicsApi.get(id));
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to load this clinic."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !clinic) return <LoadingView label="Loading clinic…" />;
  if (error && !clinic) return <ErrorState message={error} onRetry={() => { void load(); }} />;
  if (!clinic) return <ErrorState message="Clinic not found." onRetry={() => { void load(); }} />;

  const renderProvider = ({ item }: { item: Provider }) => (
    <ProviderCard provider={item} onPress={() => router.push(`/provider/${item.id}`)} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Back</Text></Pressable>
        <Text style={styles.title}>{clinic.name}</Text>
        <Text style={styles.address}>{clinic.address}</Text>
        <Text style={styles.category}>{clinic.category}</Text>
        <Text selectable style={styles.phone}>{clinic.phone}</Text>
        <ClinicMap clinic={clinic} />
        <Text style={styles.section}>Providers</Text>
        {error ? <Text accessibilityRole="alert" style={styles.inlineError}>{error}</Text> : null}
        <FlatList
          data={clinic.providers ?? []}
          keyExtractor={(provider) => provider.id}
          renderItem={renderProvider}
          scrollEnabled={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={<EmptyState title="No providers listed" message="This clinic has not added provider profiles yet." />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  back: { alignSelf: "flex-start", paddingVertical: spacing.xs, marginBottom: spacing.sm },
  backText: { color: colors.primary, fontWeight: "700", fontSize: 16 },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  address: { color: colors.muted, marginTop: spacing.sm },
  category: { color: colors.primary, fontWeight: "700", marginTop: spacing.sm },
  phone: { color: colors.primary, marginTop: spacing.sm, textDecorationLine: "underline" },
  section: { color: colors.text, fontSize: 19, fontWeight: "800", marginBottom: spacing.md },
  inlineError: { color: colors.warning, marginBottom: spacing.sm },
});
