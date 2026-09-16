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

export default function AIAdvisorScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("./business-tracking");
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

      {/* Illustration */}
      <View style={styles.visualContainer}>
        <View style={styles.illustrationBackground}>

          {/* Decorative circles */}
          <View style={styles.circleOne} />
          <View style={styles.circleTwo} />
          <View style={styles.circleThree} />

          {/* AI central icon */}
          <View style={styles.aiIconOuter}>
            <View style={styles.aiIconInner}>
              <Ionicons
                name="sparkles"
                size={62}
                color="#075E45"
              />
            </View>
          </View>

          {/* Floating AI elements */}
          <View style={[styles.floatingCard, styles.cardTopLeft]}>
            <Ionicons
              name="bulb-outline"
              size={25}
              color="#075E45"
            />
          </View>

          <View style={[styles.floatingCard, styles.cardTopRight]}>
            <Ionicons
              name="trending-up-outline"
              size={25}
              color="#075E45"
            />
          </View>

          <View style={[styles.floatingCard, styles.cardBottom]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={25}
              color="#075E45"
            />
          </View>

          {/* AI response bubble */}
          <View style={styles.aiMessage}>
            <View style={styles.messageIcon}>
              <Ionicons
                name="sparkles"
                size={20}
                color="#075E45"
              />
            </View>

            <Text style={styles.messageText}>
              Smart recommendations{"\n"}
              for your business
            </Text>
          </View>

        </View>
      </View>

      {/* Text */}
      <View style={styles.textContainer}>

        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Your AI Business Advisor
        </Text>

        <Text style={styles.description}>
          Get personalized business ideas, market
          insights and guidance based on your
          local needs.
        </Text>

      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>

        <View style={styles.progressInactive} />

        <View style={styles.progressActive} />

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

illustrationBackground: {
  width: width - 48,
  height: width * 0.86,
  maxHeight: 430,
  borderRadius: 42,
  backgroundColor: "#FFF5D9",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
},

  circleOne: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#F9E9B8",
    top: -100,
    left: -70,
  },

  circleTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#FBEFCF",
    bottom: -100,
    right: -70,
  },

  circleThree: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF9E9",
    top: 35,
    right: 30,
  },

  aiIconOuter: {
    width: 145,
    height: 145,
    borderRadius: 75,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#075E45",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 5,
  },

  aiIconInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#DDF1E5",
    alignItems: "center",
    justifyContent: "center",
  },

  floatingCard: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  cardTopLeft: {
    top: 65,
    left: 45,
  },

  cardTopRight: {
    top: 80,
    right: 45,
  },

  cardBottom: {
    bottom: 115,
    left: 65,
  },

  aiMessage: {
    position: "absolute",
    bottom: 28,
    left: 18,
    right: 18,
    minHeight: 92,
    borderRadius: 50,
    backgroundColor: "#F7FFF9",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  messageIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: "#DCEFE4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  messageText: {
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