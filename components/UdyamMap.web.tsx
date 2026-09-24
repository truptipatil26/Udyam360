import React from "react";
import { View, StyleSheet, Text } from "react-native";

const WebMap = (props: any) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.title}>Map available on mobile</Text>
      <Text style={styles.subtitle}>
        Open Udyam360 in Expo Go on Android or iOS to use the interactive map.
      </Text>
    </View>
  );
};

const WebMarker = (_props: any) => null;
const WebCircle = (_props: any) => null;

export const MapView = WebMap;
export const Marker = WebMarker;
export const Circle = WebCircle;
export const PROVIDER_GOOGLE = undefined;

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 250,
    backgroundColor: "#EAF2EC",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  icon: {
    fontSize: 42,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#246B43",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },
});