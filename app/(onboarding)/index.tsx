import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const scaleFont = (size: number): number => (width / 375) * size;

export default function OnboardingScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("./ai-advisor");
  };

  const handleSkip = () => {
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

      {/* Main Visual */}
      <View style={styles.visualContainer}>

        <View style={styles.mapCard}>

          {/* Decorative map-like background */}
          <View style={styles.mapBackground}>

            <View style={[styles.mapLine, styles.line1]} />
            <View style={[styles.mapLine, styles.line2]} />
            <View style={[styles.mapLine, styles.line3]} />

            {/* Location markers */}

            <View style={[styles.marker, styles.mainMarker]}>
              <Ionicons
                name="leaf"
                size={30}
                color="#FFFFFF"
              />
            </View>

            <View style={[styles.marker, styles.marketMarker]}>
              <Ionicons
                name="cart-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View style={[styles.marker, styles.serviceMarker]}>
              <Ionicons
                name="bicycle-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>

            {/* Demand label */}
            <View style={styles.demandLabel}>
              <Text style={styles.demandText}>
                High Demand
              </Text>
            </View>

            {/* AI insight */}
            <View style={styles.insightCard}>

              <View style={styles.insightIcon}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color="#075E45"
                />
              </View>

              <Text style={styles.insightText}>
                Found 3 new market{"\n"}
                opportunities near you.
              </Text>

            </View>

          </View>

        </View>

      </View>

      {/* Text */}
      <View style={styles.textContainer}>

        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Find Local Opportunities
        </Text>

        <Text style={styles.description}>
          Discover what people are buying in your
          village and nearby markets to find
          better business opportunities.
        </Text>

      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>

        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />

      </View>

      {/* Next button */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          Next
        </Text>

        <Ionicons
          name="arrow-forward"
          size={22}
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

  mapCard: {
    width: width - 48,
    height: width * 0.86,
    maxHeight: 430,
    borderRadius: 42,
    overflow: "hidden",
    backgroundColor: "#DCEFE3",

    shadowColor: "#0B6B4D",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },

  mapBackground: {
    flex: 1,
    backgroundColor: "#DDF2E5",
    position: "relative",
  },

  mapLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#B9D9C7",
    opacity: 0.5,
    borderStyle: "dashed",
  },

  line1: {
    width: "120%",
    top: "35%",
    left: "-10%",
    transform: [{ rotate: "18deg" }],
  },

  line2: {
    width: "100%",
    top: "60%",
    left: "5%",
    transform: [{ rotate: "-25deg" }],
  },

  line3: {
    width: "100%",
    top: "20%",
    left: "15%",
    transform: [{ rotate: "65deg" }],
  },

  marker: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#F3FAF5",
  },
  markerLabel: {
  position: "absolute",
  top: 64,
  fontSize: 12,
  fontWeight: "600",
  color: "#26352E",
  textAlign: "center",
},


  mainMarker: {
    backgroundColor: "#07815C",
    left: "48%",
    top: "30%",
  },

  marketMarker: {
    backgroundColor: "#D9B936",
    right: "18%",
    top: "56%",
  },

  serviceMarker: {
    backgroundColor: "#7D8D83",
    left: "18%",
    top: "58%",
  },

  demandLabel: {
    flexDirection: "row",
  alignItems: "center",
    position: "absolute",
    top: "43%",
    left: "32%",
    backgroundColor: "#F6FFFA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  demandText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#075E45",
    marginLeft: 6,
  },

  insightCard: {
    position: "absolute",
    bottom: 25,
    left: 18,
    right: 18,

    minHeight: 105,
    borderRadius: 20,
    backgroundColor: "#F4FFF8",

    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: "#DCEFE4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  insightText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 25,
    color: "#26352E",
    fontWeight: "500",
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },

  title: {
  fontSize: scaleFont(32),   // instead of 34
  lineHeight: scaleFont(40),
  fontWeight: "700",
  color: "#0C1511",
  textAlign: "center",
},

  description: {
    marginTop: 16,
    fontSize: scaleFont(18),   // instead of 20
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