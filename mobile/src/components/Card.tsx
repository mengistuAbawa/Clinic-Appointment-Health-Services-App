import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({ card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, shadowColor: "#102A24", shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 } });
