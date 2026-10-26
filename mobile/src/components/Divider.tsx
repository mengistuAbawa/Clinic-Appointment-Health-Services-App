import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export function Divider(props: ViewProps) {
  return <View accessibilityRole="none" {...props} style={[styles.divider, props.style]} />;
}

const styles = StyleSheet.create({ divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#DDE6E3", width: "100%" } });
