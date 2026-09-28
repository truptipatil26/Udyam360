import React, { useCallback, useState } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing } from "../constants/theme";
import { getUser, getProfile, saveProfile } from "../src/services/auth";

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [capital, setCapital] = useState("");
  const [skills, setSkills] = useState("");

  useFocusEffect(
  useCallback(() => {
    const loadProfile = async () => {
      const user = await getUser();
      const profile = await getProfile();

      if (user) {
        setName(user.name);
      }

      if (profile) {
        setState(profile.state || "");
        setDistrict(profile.district || "");
        setVillage(profile.village || "");
        setCapital(profile.capital || "");
        setSkills(profile.skills || "");
      }
    };

    loadProfile();
  }, [])
);

  const handleSave = async () => {
    if (
      !name.trim() ||
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
      const existingProfile = await getProfile();

      await saveProfile({
        state: state.trim(),
        district: district.trim(),
        village: village.trim(),
        capital: capital.trim(),
        skills: skills.trim(),

        // Preserve existing location data
        locationAddress: existingProfile?.locationAddress,
        latitude: existingProfile?.latitude,
        longitude: existingProfile?.longitude,
      });

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      Alert.alert(
        "Something went wrong",
        "Unable to update your profile."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={{ width: 42 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Name</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>State</Text>

          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="e.g. Maharashtra"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>District</Text>

          <TextInput
            style={styles.input}
            value={district}
            onChangeText={setDistrict}
            placeholder="e.g. Wardha"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Village / Town</Text>

          <TextInput
            style={styles.input}
            value={village}
            onChangeText={setVillage}
            placeholder="Your village or town"
            placeholderTextColor="#999"
          />

          {/* Location */}
          <Text style={styles.label}>📍 Location</Text>

          <TouchableOpacity
            style={styles.locationButton}
            activeOpacity={0.8}
            onPress={() => router.push("/update-location")}
          >
            <View style={styles.locationIcon}>
              <Ionicons
                name="location-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.locationTextWrap}>
              <Text style={styles.locationTitle}>
                Update Location
              </Text>

              <Text style={styles.locationSubtitle}>
                Change your map location
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <Text style={styles.label}>Available Capital</Text>

          <TextInput
            style={styles.input}
            value={capital}
            onChangeText={setCapital}
            placeholder="e.g. ₹50,000"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Skills / Resources</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            value={skills}
            onChangeText={setSkills}
            placeholder="e.g. Farming, tailoring, dairy"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
  },

  textArea: {
    height: 100,
    paddingTop: 14,
  },

  locationButton: {
    minHeight: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  locationTextWrap: {
    flex: 1,
    marginLeft: 12,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  locationSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  saveButton: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});