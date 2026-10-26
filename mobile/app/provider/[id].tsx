/** Provider biography, clinic information, upcoming availability, and booking. */
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { providersApi } from "../../src/api/providers";
import { Provider } from "../../src/types";
import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingView } from "../../src/components/LoadingView";
import { formatDate, formatTime } from "../../src/utils/format";
import { apiMessage } from "../../src/api/client";
import { colors, spacing } from "../../src/constants/theme";

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProvider(await providersApi.getById(id));
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to load this provider."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !provider) return <LoadingView label="Loading provider…" />;
  if (error && !provider) return <ErrorState message={error} onRetry={() => { void load(); }} />;
  if (!provider) return <ErrorState message="Provider not found." onRetry={() => { void load(); }} />;

  const available = provider.slots?.slice(0, 5) ?? [];
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Back</Text></Pressable>
        <View style={styles.head}>
          <Avatar uri={provider.imageUrl} name={provider.name} size={88} />
          <View style={styles.identity}><Text style={styles.name}>{provider.name}</Text><Text style={styles.specialty}>{provider.specialty}</Text></View>
        </View>
        <Text style={styles.section}>About</Text>
        <Text style={styles.body}>{provider.bio}</Text>
        {provider.clinic ? <>
          <Text style={styles.section}>Clinic</Text>
          <Pressable accessibilityRole="link" onPress={() => router.push(`/clinic/${provider.clinicId}`)}>
            <Text style={styles.clinicName}>{provider.clinic.name}</Text>
            <Text style={styles.body}>{provider.clinic.address}</Text>
          </Pressable>
        </> : null}
        <Text style={styles.section}>Next available</Text>
        {available.length ? available.map((slot) => (
          <View key={slot.id} style={styles.slot}>
            <Text style={styles.slotDate}>{formatDate(slot.startTime)}</Text>
            <Text style={styles.slotTime}>{formatTime(slot.startTime)}</Text>
          </View>
        )) : <Text style={styles.body}>No upcoming times are available. Check again later.</Text>}
        {error ? <Text accessibilityRole="alert" style={styles.inlineError}>{error}</Text> : null}
        <Button title="Choose an appointment" onPress={() => router.push(`/booking/${provider.id}`)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  back: { alignSelf: "flex-start", paddingVertical: spacing.xs },
  backText: { color: colors.primary, fontWeight: "700", fontSize: 16 },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  identity: { flex: 1 },
  name: { color: colors.text, fontWeight: "800", fontSize: 21 },
  specialty: { color: colors.primary, marginTop: 5, fontWeight: "600" },
  section: { color: colors.text, fontWeight: "800", fontSize: 18, marginTop: spacing.sm },
  body: { color: colors.muted, lineHeight: 23 },
  clinicName: { color: colors.primary, fontWeight: "700", marginBottom: spacing.xs },
  slot: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md },
  slotDate: { color: colors.text, fontWeight: "600" },
  slotTime: { color: colors.primary, fontWeight: "700" },
  inlineError: { color: colors.danger },
});
