import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
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
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { saveProfile } from "../../src/services/auth";

export default function ProfileSetupScreen() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [capital, setCapital] = useState("");
  const [skills, setSkills] = useState("");

  // Location states
  const [locationAddress, setLocationAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 20.7453,
    longitude: 78.6022,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  // --------------------------------
  // USE CURRENT LOCATION
  // --------------------------------
  const handleCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please allow location access to use your current location."
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const { latitude: lat, longitude: lng } =
        currentLocation.coords;

      setLatitude(lat);
      setLongitude(lng);

      const newRegion: Region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setMapRegion(newRegion);

      // Convert coordinates → address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (addresses.length > 0) {
        const address = addresses[0];

        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.district,
          address.region,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationAddress(formattedAddress);

        // Automatically fill profile location fields
        if (address.region) {
          setState(address.region);
        }

        if (address.district) {
          setDistrict(address.district);
        }

        if (address.city) {
          setVillage(address.city);
        }
      }
    } catch (error) {
      console.error("CURRENT LOCATION ERROR:", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please try again."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // --------------------------------
  // SEARCH LOCATION
  // --------------------------------
  const handleSearchLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert(
        "Enter Location",
        "Please enter a village, town or city."
      );
      return;
    }

    try {
      setSearchLoading(true);

      const results = await Location.geocodeAsync(
        searchText.trim()
      );

      if (!results.length) {
        Alert.alert(
          "Location Not Found",
          "We couldn't find that location. Try entering a nearby city or village."
        );
        return;
      }

      const result = results[0];

      const lat = result.latitude;
      const lng = result.longitude;

      setLatitude(lat);
      setLongitude(lng);

      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      // Get readable address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (addresses.length > 0) {
        const address = addresses[0];

        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.district,
          address.region,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationAddress(formattedAddress);

        if (address.region) {
          setState(address.region);
        }

        if (address.district) {
          setDistrict(address.district);
        }

        if (address.city) {
          setVillage(address.city);
        }
      }
    } catch (error) {
      console.error("LOCATION SEARCH ERROR:", error);

      Alert.alert(
        "Search Error",
        "Unable to search for this location. Please try again."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // --------------------------------
  // MAP PRESS
  // --------------------------------
  const handleMapPress = async (event: any) => {
    const { latitude: lat, longitude: lng } =
      event.nativeEvent.coordinate;

    setLatitude(lat);
    setLongitude(lng);

    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (addresses.length > 0) {
        const address = addresses[0];

        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.district,
          address.region,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationAddress(formattedAddress);

        if (address.region) {
          setState(address.region);
        }

        if (address.district) {
          setDistrict(address.district);
        }

        if (address.city) {
          setVillage(address.city);
        }
      }
    } catch (error) {
      console.error("MAP LOCATION ERROR:", error);
    }
  };

  // --------------------------------
  // SAVE PROFILE
  // --------------------------------
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

    if (latitude === null || longitude === null) {
      Alert.alert(
        "Business Location Required",
        "Please search for your business location, use your current location, or select a location on the map."
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

        // New location information
        locationAddress: locationAddress.trim(),
        latitude,
        longitude,
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
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>U</Text>
        </View>

        <Text style={styles.title}>
          Complete Your Profile
        </Text>

        

        <View style={styles.form}>
          {/* ---------------- LOCATION ---------------- */}

          <View style={styles.sectionHeader}>
           

            
          </View>

          

          {/* SEARCH */}

          <Text style={styles.label}>
            Search Village / Town / City
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="e.g. Wardha, Maharashtra"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchLocation}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchLocation}
              disabled={searchLoading}
              activeOpacity={0.8}
            >
              {searchLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>
                  Search
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* CURRENT LOCATION */}

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleCurrentLocation}
            disabled={locationLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.locationButtonIcon}>◎</Text>

            <Text style={styles.currentLocationText}>
              {locationLoading
                ? "Finding your location..."
                : "Use Current Location"}
            </Text>
          </TouchableOpacity>

          {/* MAP */}

          <Text style={styles.mapLabel}>
            Select your business location
          </Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              onPress={handleMapPress}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {latitude !== null &&
                longitude !== null && (
                  <Marker
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    title="Business Location"
                    description={
                      locationAddress ||
                      "Selected business location"
                    }
                  />
                )}
            </MapView>
          </View>

          {/* SELECTED LOCATION */}

          {locationAddress ? (
            <View style={styles.selectedLocation}>
              <Text style={styles.selectedLocationIcon}>
                📍
              </Text>

              <View style={styles.selectedLocationContent}>
                <Text style={styles.selectedLocationTitle}>
                  Selected Location
                </Text>

                <Text style={styles.selectedLocationText}>
                  {locationAddress}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.mapHint}>
              Search for a location, use your current location,
              or tap directly on the map.
            </Text>
          )}

          {/* ---------------- EXISTING PROFILE FIELDS ---------------- */}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Business Information
          </Text>

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

          <Text style={styles.label}>
            Skills / Resources
          </Text>

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

          {/* CONTINUE */}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>

            <Text style={styles.arrow}>→</Text>
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },

  sectionIcon: {
    fontSize: 27,
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#777777",
    marginTop: 2,
  },

  locationInfo: {
    fontSize: 13,
    lineHeight: 19,
    color: "#626862",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 7,
    marginTop: 13,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#D8DED8",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#222222",
  },

  searchButton: {
    height: 52,
    paddingHorizontal: 17,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  orText: {
    textAlign: "center",
    color: "#858B85",
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 12,
  },

  currentLocationButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#E2EFE7",
    borderWidth: 1,
    borderColor: "#D0E2D6",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  locationButtonIcon: {
    fontSize: 28,
    color: "#126B4F",
    marginRight: 10,
  },

  currentLocationText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#126B4F",
  },

  mapLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginTop: 20,
    marginBottom: 8,
  },

  mapContainer: {
    height: 270,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D8DED8",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  selectedLocation: {
    flexDirection: "row",
    backgroundColor: "#EAF5EE",
    borderRadius: 12,
    padding: 13,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D4E7DA",
  },

  selectedLocationIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  selectedLocationContent: {
    flex: 1,
  },

  selectedLocationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#246B43",
    marginBottom: 3,
  },

  selectedLocationText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#444444",
  },

  mapHint: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777777",
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E5E0",
    marginVertical: 24,
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
    height: 56,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    flexDirection: "row",
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 9,
  },
});