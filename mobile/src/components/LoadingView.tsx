/** Centered loading state for first loads and detail fetches. */
import React from "react"; import { ActivityIndicator, StyleSheet, Text, View } from "react-native"; import { colors } from "../constants/theme";
export function LoadingView({ label = "Loading…" }: { label?: string }) { return <View accessibilityRole="progressbar" style={styles.root}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.text}>{label}</Text></View>; }
const styles = StyleSheet.create({ root: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }, text: { color: colors.muted } });
