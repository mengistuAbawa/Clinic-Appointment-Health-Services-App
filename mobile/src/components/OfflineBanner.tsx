/** Compact network outage banner displayed above the app navigation. */
import React from "react"; import { StyleSheet, Text, View } from "react-native"; import { colors } from "../constants/theme";
export function OfflineBanner() { return <View accessibilityRole="alert" style={styles.banner}><Text style={styles.text}>You’re offline. Showing saved information where available.</Text></View>; }
const styles = StyleSheet.create({ banner: { backgroundColor: "#FFF2CC", padding: 9, alignItems: "center" }, text: { color: "#614700", fontSize: 13, fontWeight: "600" } });
