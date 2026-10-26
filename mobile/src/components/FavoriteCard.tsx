import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clinic } from "../types";

export function FavoriteCard({ clinic, onRemove }: { clinic: Clinic; onRemove: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{clinic.name}</Text>
        <Text style={styles.address}>{clinic.address}</Text>
        <Text style={styles.category}>{clinic.category}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${clinic.name} from favorites`} onPress={onRemove} style={styles.remove}>
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({ container: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, gap: 8, marginBottom: 12 }, card: { gap: 5 }, name: { color: "#172B27", fontSize: 16, fontWeight: "700" }, address: { color: "#63736F" }, category: { color: "#176B5B", fontSize: 12, fontWeight: "700" }, remove: { alignSelf: "flex-end", padding: 8 }, removeText: { color: "#A33B3B", fontWeight: "600" } });
