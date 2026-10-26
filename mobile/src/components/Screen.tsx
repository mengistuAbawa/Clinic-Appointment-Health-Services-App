import React from "react";
import { SafeAreaView, StyleSheet, ViewProps } from "react-native";

export function Screen({ style, ...props }: ViewProps) {
  return <SafeAreaView {...props} style={[styles.screen, style]} />;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#F5F8F7", paddingHorizontal: 20 } });
