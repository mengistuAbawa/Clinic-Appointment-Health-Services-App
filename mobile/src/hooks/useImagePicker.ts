/** Requests library permission and selects a cropped, upload-ready avatar. */
import { useCallback } from "react";
import * as ImagePicker from "expo-image-picker";

export function useImagePicker() {
  const pickImage = useCallback(async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) throw new Error("Allow photo library access to choose a profile picture.");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.55,
      base64: true,
    });
    return result.canceled ? null : result.assets[0] ?? null;
  }, []);
  return { pickImage };
}
