import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeOnboarding } from "../../src/services/auth";

const { width, height } = Dimensions.get("window");
const scaleFont = (size: number): number => (width / 375) * size;

export default function BusinessTrackingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
  await completeOnboarding();
  router.replace("/(auth)/login");
};

  const handleSkip = async () => {
  await completeOnboarding();
  router.replace("/(auth)/login");
};

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Udyam<Text style={styles.logoNumber}>360</Text>
        </Text>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Visual */}
      <View style={styles.visualContainer}>

        <View style={styles.dashboardCard}>

          {/* Top bar */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.smallLabel}>
                MY BUSINESS
              </Text>

              <Text style={styles.businessName}>
                Business Overview
              </Text>
            </View>

            <View style={styles.businessIcon}>
              <Ionicons
                name="storefront-outline"
                size={24}
                color="#075E45"
              />
            </View>
          </View>

          {/* Main metric */}
          <View style={styles.revenueCard}>

            <View>
              <Text style={styles.metricLabel}>
                This Month
              </Text>

              <Text style={styles.metricValue}>
                ₹24,500
              </Text>

              <View style={styles.growthRow}>
                <Ionicons
                  name="trending-up"
                  size={17}
                  color="#168653"
                />

                <Text style={styles.growthText}>
                  +18% growth
                </Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={[styles.chartBar, styles.bar1]} />
              <View style={[styles.chartBar, styles.bar2]} />
              <View style={[styles.chartBar, styles.bar3]} />
              <View style={[styles.chartBar, styles.bar4]} />
              <View style={[styles.chartBar, styles.bar5]} />
            </View>

          </View>

          {/* Stats */}
          <View style={styles.statsRow}>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="#075E45"
                />
              </View>

              <Text style={styles.statLabel}>
                Sales
              </Text>

              <Text style={styles.statValue}>
                ₹24.5K
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={20}
                  color="#075E45"
                />
              </View>

              <Text style={styles.statLabel}>
                Expenses
              </Text>

              <Text style={styles.statValue}>
                ₹12.3K
              </Text>
            </View>

          </View>

          {/* AI insight */}
          <View style={styles.aiInsight}>

            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles"
                size={19}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.aiText}>
              Your business is growing this month!
            </Text>

          </View>

        </View>

      </View>

      {/* Text */}
      <View style={styles.textContainer}>

        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Track & Grow Your Business
        </Text>

        <Text style={styles.description}>
          Track your sales, expenses and progress
          to make better business decisions.
        </Text>

      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>

        <View style={styles.progressInactive} />

        <View style={styles.progressInactive} />

        <View style={styles.progressActive} />

      </View>

      {/* Get Started */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>

        <Ionicons
          name="arrow-forward"
          size={25}
          color="#FFFFFF"
        />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FAF5",
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#075E45",
    letterSpacing: -1,
  },

  logoNumber: {
    fontWeight: "800",
  },

  skipText: {
    fontSize: 18,
    color: "#34423C",
    fontWeight: "500",
  },

  visualContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: height * 0.56,
  },

  dashboardCard: {
  width: width - 45,
  maxHeight: 400,
  borderRadius: 40,
  backgroundColor: "#FFFDF5",
  padding: 20,

  shadowColor: "#075E45",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 6,
},

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#7C8B83",
  },

  businessName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#17231D",
    marginTop: 4,
  },

  businessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DDF1E5",
    alignItems: "center",
    justifyContent: "center",
  },

  revenueCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 25,
    backgroundColor: "#E8F5EC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metricLabel: {
    fontSize: 13,
    color: "#607068",
  },

  metricValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#075E45",
    marginTop: 3,
  },

  growthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  growthText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#168653",
  },

  chartContainer: {
    height: 70,
    width: 90,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  chartBar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: "#4EAD7C",
  },

  bar1: {
    height: 25,
  },

  bar2: {
    height: 38,
  },

  bar3: {
    height: 32,
  },

  bar4: {
    height: 52,
  },

  bar5: {
    height: 64,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#F4F9F5",
    borderRadius: 22,
    padding: 8,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DCEFE4",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#75837C",
    marginTop: 8,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18241E",
    marginTop: 2,
  },

  aiInsight: {
    marginTop: 10,
    backgroundColor: "#1e7e63",
    borderRadius: 20,
    padding: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  aiIcon: {
    width: 35,
    height: 30,
    borderRadius: 18,
    backgroundColor: "#299B68",
    alignItems: "center",
    justifyContent: "center",
  },

  aiText: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },

  title: {
  fontSize: scaleFont(32),
  lineHeight: scaleFont(40),
  fontWeight: "700",
  color: "#0C1511",
  textAlign: "center",
},

  description: {
  marginTop: 16,
  fontSize: scaleFont(18),
  lineHeight: scaleFont(28),
  color: "#394640",
  textAlign: "center",
  fontWeight: "400",
},

  progressContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 14,
  marginTop: 28,
  marginBottom: 28,
},

progressActive: {
  width: width * 0.22,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#075E45",
},

progressInactive: {
  width: width * 0.22,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#D8E7DF",
},

  button: {
  height: width * 0.16,
  borderRadius: width * 0.08,
  backgroundColor: "#005B43",

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  marginBottom: 18,

  shadowColor: "#005B43",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 5,
},

buttonText: {
  color: "#FFFFFF",
  fontSize: scaleFont(20),
  fontWeight: "600",
  marginRight: 10,
},
});