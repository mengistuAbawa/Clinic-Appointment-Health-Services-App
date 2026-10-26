/** Requests location permission and returns a one-shot current coordinate. */
import { useCallback, useState } from "react";
import * as Location from "expo-location";
export function useLocation(): { location: Location.LocationObjectCoords | null; loading: boolean; error: string | null; locate: () => Promise<Location.LocationObjectCoords | null> } {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const locate = useCallback(async () => { setLoading(true); setError(null); try { const permission = await Location.requestForegroundPermissionsAsync(); if (!permission.granted) throw new Error("Allow location access to sort clinics by distance."); const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }); setLocation(result.coords); return result.coords; } catch (e) { setError(e instanceof Error ? e.message : "Could not get your location"); return null; } finally { setLoading(false); } }, []);
  return { location, loading, error, locate };
}
