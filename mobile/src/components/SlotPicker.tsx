/** Accessible, compact picker for a provider's available appointment slots. */
import React, { memo, useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { format } from "date-fns";
import { Slot } from "../types";
import { colors, radius, spacing } from "../constants/theme";
import { EmptyState } from "./EmptyState";

interface SlotPickerProps {
  slots: Slot[];
  selected: string | null;
  onSelect: (slot: Slot) => void;
}

interface SlotItemProps {
  slot: Slot;
  selected: boolean;
  onSelect: (slot: Slot) => void;
}

const SlotItem = memo(function SlotItem({ slot, selected, onSelect }: SlotItemProps) {
  const onPress = useCallback(() => onSelect(slot), [onSelect, slot]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Available at ${format(new Date(slot.startTime), "h:mm a")}`}
      onPress={onPress}
      style={[styles.slot, selected && styles.selected]}
    >
      <Text style={[styles.slotText, selected && styles.selectedText]}>
        {format(new Date(slot.startTime), "h:mm a")}
      </Text>
    </Pressable>
  );
});

export const SlotPicker = memo(function SlotPicker({ slots, selected, onSelect }: SlotPickerProps) {
  const renderItem = useCallback(({ item }: { item: Slot }) => (
    <SlotItem slot={item} selected={item.id === selected} onSelect={onSelect} />
  ), [onSelect, selected]);

  if (slots.length === 0) {
    return <EmptyState title="No times available" message="Choose another date to see more appointment times." />;
  }

  return (
    <FlatList
      data={slots}
      renderItem={renderItem}
      keyExtractor={(slot) => slot.id}
      numColumns={3}
      scrollEnabled={false}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
    />
  );
});

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { gap: spacing.sm },
  slot: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.primary, backgroundColor: colors.primary },
  slotText: { color: colors.text, fontWeight: "600" },
  selectedText: { color: colors.white },
});
