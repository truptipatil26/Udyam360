import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

import {
  isLoggedIn,
  getProfile,
  isOnboardingCompleted,
} from "../src/services/auth";import { LanguageProvider } from "../src/services/i18n/LanguageContext";

// Keep native splash visible while the app is starting
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  // Splash animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animated loading dots
    useEffect(() => {
      const createDotAnimation = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),

            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),

            Animated.timing(dot, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),

            Animated.delay(800),
          ])
        );
      };

      const animation1 = createDotAnimation(dot1Anim, 0);
      const animation2 = createDotAnimation(dot2Anim, 250);
      const animation3 = createDotAnimation(dot3Anim, 500);

      animation1.start();
      animation2.start();
      animation3.start();

      return () => {
        animation1.stop();
        animation2.stop();
        animation3.stop();
      };
    }, []);

  // Authentication check
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const loggedIn = await isLoggedIn();
        const profile = await getProfile();
        const onboardingDone = await isOnboardingCompleted();

        setOnboardingCompleted(onboardingDone);

        const firstSegment = segments[0];

const insideAuthGroup = firstSegment === "(auth)";
const insideOnboardingGroup = firstSegment === "(onboarding)";

if (!onboardingDone && !insideOnboardingGroup) {
  router.replace("/(onboarding)");
  return;
}

if (!loggedIn) {
  if (!insideAuthGroup && !insideOnboardingGroup) {
    router.replace("/(auth)/login");
  }
} else if (!profile) {
  if (!insideAuthGroup && !insideOnboardingGroup) {
    router.replace("/(auth)/profile-setup");
  }
} else {
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

  // Hide native splash once React Native has loaded
  useEffect(() => {
    if (!checkingAuth) {
      SplashScreen.hideAsync();

      // Keep custom splash visible for a polished startup
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [checkingAuth]);

  // Custom Udyam360 splash
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/splash-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* App name */}
          <Text style={styles.appName}>Udyam360</Text>

          {/* Small divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.leaf}>🌿</Text>
            <View style={styles.divider} />
          </View>

          {/* Hindi tagline */}
          <Text style={styles.tagline}>
            आपके स्थानीय संसाधनों से{"\n"}
            बेहतर व्यवसाय के अवसर खोजें
          </Text>

          {/* Loading dots */}
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                styles.dotDark,
                { opacity: dot1Anim },
              ]}
            />

            <Animated.View
              style={[
                styles.dot,
                styles.dotMedium,
                { opacity: dot2Anim },
              ]}
            />

            <Animated.View
              style={[
                styles.dot,
                styles.dotLight,
                { opacity: dot3Anim },
              ]}
            />
          </View>
        </Animated.View>

        <Text style={styles.bottomText}>
          आपका AI Business Advisor
        </Text>
      </View>
    );
  }

  if (checkingAuth) {
    return null;
  }

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />

        <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="(onboarding)" />
  <Stack.Screen name="(tabs)" />
</Stack>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#F8FBF6",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  logoContainer: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  logo: {
    width: 145,
    height: 145,
  },

  appName: {
    fontSize: 42,
    fontWeight: "700",
    color: "#064E3B",
    letterSpacing: -1,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 18,
  },

  divider: {
    width: 65,
    height: 2,
    backgroundColor: "#2E9B70",
  },

  leaf: {
    fontSize: 20,
    marginHorizontal: 12,
  },

  tagline: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 30,
    fontWeight: "600",
    color: "#18794E",
  },

  dotsContainer: {
    flexDirection: "row",
    marginTop: 55,
    gap: 12,
  },

  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  dotDark: {
    backgroundColor: "#12805C",
  },

  dotMedium: {
    backgroundColor: "#4CAF80",
  },

  dotLight: {
    backgroundColor: "#9BD7B7",
  },

  bottomText: {
    position: "absolute",
    bottom: 45,
    fontSize: 13,
    color: "#6B8F7D",
    fontWeight: "500",
  },
});