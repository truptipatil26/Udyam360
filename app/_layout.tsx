import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { isLoggedIn, getProfile } from "../src/services/auth";
import { LanguageProvider } from "../src/services/i18n/LanguageContext";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const loggedIn = await isLoggedIn();
        const profile = await getProfile();

        const firstSegment = segments[0];

        const insideAuthGroup = firstSegment === "(auth)";
        const insideTabsGroup = firstSegment === "(tabs)";

        if (!loggedIn) {
          // User is not logged in → Login
          if (!insideAuthGroup) {
            router.replace("/(auth)/login");
          }
        } else if (!profile) {
          // User is logged in but profile is not completed
          if (firstSegment !== "(auth)") {
            router.replace("/(auth)/profile-setup");
          }
        } else {
          // User is logged in and profile is completed
          if (insideAuthGroup) {
            router.replace("/(tabs)");
          }
        }

        setCheckingAuth(false);
      } catch (error) {
        console.error("AUTH CHECK ERROR:", error);
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [segments]);

  if (checkingAuth) {
    return null;
  }

  return (
  <LanguageProvider>
    <SafeAreaProvider>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  </LanguageProvider>
);
}