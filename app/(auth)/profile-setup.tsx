import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { saveProfile } from "../../src/services/auth";

export default function ProfileSetupScreen() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [capital, setCapital] = useState("");
  const [skills, setSkills] = useState("");

  const handleContinue = async () => {
  if (
    !state.trim() ||
    !district.trim() ||
    !village.trim() ||
    !capital.trim() ||
    !skills.trim()
  ) {
    Alert.alert(
      "Missing Information",
      "Please fill in all the fields."
    );
    return;
  }

  try {
    await saveProfile({
      state: state.trim(),
      district: district.trim(),
      village: village.trim(),
      capital: capital.trim(),
      skills: skills.trim(),
    });

    console.log("PROFILE SAVED SUCCESSFULLY");

    router.replace("/(tabs)");
  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);

    Alert.alert(
      "Something went wrong",
      "Unable to save your profile. Please try again."
    );
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>U</Text>
        </View>

        <Text style={styles.title}>
          Complete Your Profile
        </Text>

        <Text style={styles.subtitle}>
          Tell us about your location, capital and skills so Udyam360
          can suggest the right opportunities for you.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>State</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Maharashtra"
            placeholderTextColor="#999"
            value={state}
            onChangeText={setState}
          />

          <Text style={styles.label}>District</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Nagpur"
            placeholderTextColor="#999"
            value={district}
            onChangeText={setDistrict}
          />

          <Text style={styles.label}>Village / Town</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your village or town"
            placeholderTextColor="#999"
            value={village}
            onChangeText={setVillage}
          />

          <Text style={styles.label}>Available Capital</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. ₹50,000"
            placeholderTextColor="#999"
            value={capital}
            onChangeText={setCapital}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Skills / Resources</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Farming, tailoring, dairy, food processing"
            placeholderTextColor="#999"
            value={skills}
            onChangeText={setSkills}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF7",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1B1B1B",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 7,
    marginTop: 13,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D8DED8",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#222222",
  },

  textArea: {
    height: 100,
    paddingTop: 14,
  },

  continueButton: {
    height: 54,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});