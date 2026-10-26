/** Subscribes to NetInfo and exposes the current network reachability state. */
import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
export function useNetworkStatus(): boolean { const [online, setOnline] = useState(true); useEffect(() => NetInfo.addEventListener((state: NetInfoState) => setOnline(Boolean(state.isConnected && state.isInternetReachable !== false))), []); return online; }
