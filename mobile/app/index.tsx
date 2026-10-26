import { Redirect } from "expo-router";

/** The root layout's auth guard sends signed-out users to the login screen. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
