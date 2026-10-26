import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { addDays, format, isSameDay, startOfDay } from "date-fns";

export function DateScroller({
  selectedDate,
  onSelect,
  days = 14,
}: {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  days?: number;
}) {
  const today = startOfDay(new Date());
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {Array.from({ length: days }, (_, index) => {
        const date = addDays(today, index);
        const selected = isSameDay(date, selectedDate);
        return (
          <Pressable
            key={date.toISOString()}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(date)}
            style={[styles.day, selected && styles.daySelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{format(date, "EEE")}</Text>
            <Text style={[styles.number, selected && styles.labelSelected]}>{format(date, "d")}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10, paddingVertical: 8 },
  day: { minWidth: 56, alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 14, backgroundColor: "#FFFFFF" },
  daySelected: { backgroundColor: "#176B5B" },
  label: { color: "#63736F", fontSize: 12, fontWeight: "600" },
  number: { color: "#172B27", fontSize: 16, fontWeight: "700" },
  labelSelected: { color: "#FFFFFF" },
});
