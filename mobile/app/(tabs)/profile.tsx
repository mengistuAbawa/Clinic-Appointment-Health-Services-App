/** Profile editor with secure sign-out, avatar selection, and soft deletion. */
import React, { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState, AppDispatch } from "../../src/store";
import { logoutUser, updateUser } from "../../src/store/authSlice";
import { profileSchema } from "../../src/utils/validation";
import { usersApi } from "../../src/api/users";
import { apiMessage } from "../../src/api/client";
import { cache } from "../../src/utils/storage";
import { useImagePicker } from "../../src/hooks/useImagePicker";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { Avatar } from "../../src/components/Avatar";
import { ErrorState } from "../../src/components/ErrorState";
import { colors, spacing } from "../../src/constants/theme";

type ProfileValues = { name: string; phone: string };
const CACHED_USER_KEY = "session-user";

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const { pickImage } = useImagePicker();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  useEffect(() => {
    reset({ name: user?.name ?? "", phone: user?.phone ?? "" });
  }, [reset, user?.name, user?.phone]);

  if (!user) return <ErrorState message="Your profile could not be loaded. Sign in again to continue." onRetry={() => { void dispatch(logoutUser()); }} />;

  const save = async (values: ProfileValues) => {
    setSaving(true);
    setNotice("");
    try {
      const updated = await usersApi.update({ name: values.name.trim(), phone: values.phone.trim() });
      dispatch(updateUser(updated));
      await cache.set(CACHED_USER_KEY, updated);
      setNotice("Profile saved.");
    } catch (error) {
      setNotice(apiMessage(error, "Could not save your profile. Try again."));
    } finally {
      setSaving(false);
    }
  };

  const chooseAvatar = async () => {
    try {
      const asset = await pickImage();
      if (!asset) return;
      if (!asset.base64) throw new Error("The selected image could not be prepared. Choose another photo.");
      const avatarUrl = `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`;
      if (avatarUrl.length > 900_000) throw new Error("Choose a smaller photo. The avatar must be under 900 KB.");
      setSaving(true);
      const updated = await usersApi.update({ avatarUrl });
      dispatch(updateUser(updated));
      await cache.set(CACHED_USER_KEY, updated);
      setNotice("Profile photo saved.");
    } catch (error) {
      Alert.alert("Avatar not saved", apiMessage(error, "Please choose another photo and try again."));
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = () => Alert.alert(
    "Delete account?",
    "Your account will be deactivated and you will be signed out.",
    [
      { text: "Keep account", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await usersApi.remove();
            await dispatch(logoutUser());
          } catch (error) {
            Alert.alert("Unable to delete account", apiMessage(error, "Check your connection and try again."));
          }
        },
      },
    ],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Your profile</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" disabled={saving} onPress={() => void chooseAvatar()} style={styles.avatar}>
          <Avatar uri={user.avatarUrl} name={user.name} size={88} />
          <Text style={styles.change}>{saving ? "Saving…" : "Change photo"}</Text>
        </Pressable>
        <Text style={styles.email}>{user.email}</Text>
        <Controller control={control} name="name" render={({ field }) => (
          <Input label="Full name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.name?.message} autoCapitalize="words" />
        )} />
        <Controller control={control} name="phone" render={({ field }) => (
          <Input label="Phone number" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} keyboardType="phone-pad" error={errors.phone?.message} />
        )} />
        {notice ? <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text> : null}
        <Button title="Save changes" loading={saving} onPress={handleSubmit(save)} />
        <View style={styles.separation} />
        <Button title="Sign out" variant="secondary" onPress={() => Alert.alert("Sign out?", undefined, [
          { text: "Stay", style: "cancel" },
          { text: "Sign out", style: "destructive", onPress: () => { void dispatch(logoutUser()); } },
        ])} />
        <View style={{ height: spacing.xs }} />
        <Button title="Delete account" variant="danger" onPress={deleteAccount} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 25, fontWeight: "800", color: colors.text },
  avatar: { alignItems: "center", padding: spacing.md, gap: spacing.sm },
  change: { color: colors.primary, fontWeight: "700" },
  email: { color: colors.muted, textAlign: "center", marginBottom: spacing.md },
  notice: { color: colors.primary },
  separation: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});
