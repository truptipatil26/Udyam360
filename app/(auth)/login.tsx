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

import { login } from "../../src/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  console.log("LOGIN BUTTON PRESSED");

  try {
    if (!email.trim() || !password) {
      Alert.alert("Missing Information", "Please enter email and password.");
      return;
    }

    console.log("CHECKING LOGIN...");

    
    
    const success = await login(
      email.trim().toLowerCase(),
      password
    );

    console.log("LOGIN RESULT:", success);

    if (!success) {
      Alert.alert(
        "Login Failed",
        "Incorrect email or password."
      );
      return;
    }

    console.log("LOGIN SUCCESSFUL");
    console.log("GOING TO HOME");

    router.replace("/(auth)/profile-setup");
    
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    Alert.alert(
      "Something went wrong",
      "Unable to login. Please try again."
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
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>U</Text>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Log in to continue with Udyam360
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B1B1B",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 7,
    marginTop: 14,
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

  loginButton: {
    height: 54,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  signupText: {
    color: "#666666",
    fontSize: 14,
  },

  signupLink: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "700",
  },
});