/** Memoized provider summary card that opens the provider detail screen. */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider } from "../types";
import { colors, radius, spacing } from "../constants/theme";
import { Avatar } from "./Avatar";
export const ProviderCard = React.memo(function ProviderCard({ provider, onPress }: { provider: Provider; onPress: () => void }) { return <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}><Avatar uri={provider.imageUrl} name={provider.name} size={52} /><View style={styles.info}><Text style={styles.name}>{provider.name}</Text><Text style={styles.specialty}>{provider.specialty}</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} /></Pressable>; });
const styles = StyleSheet.create({ row: { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: colors.border, borderWidth: 1, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm }, info: { flex: 1 }, name: { fontWeight: "700", color: colors.text }, specialty: { color: colors.muted, marginTop: 4 } });
