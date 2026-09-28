//update-location.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { MapView, Marker, type Region } from "../components/UdyamMap";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors, radius, spacing } from "../constants/theme";
import { getProfile, saveProfile } from "../src/services/auth";

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;

  address?: {
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
  };
};

const DEFAULT_REGION: Region = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

export default function UpdateLocationScreen() {
  const router = useRouter();

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [address, setAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [searching, setSearching] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);


  const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedVillage, setSelectedVillage] = useState("");

  useEffect(() => {
    loadSavedLocation();
  }, []);

  // Load previously saved location
  const loadSavedLocation = async () => {
    try {
      const profile = await getProfile();

      if (
        profile?.latitude !== undefined &&
        profile?.longitude !== undefined
      ) {
        const lat = profile.latitude;
        const lon = profile.longitude;

        setLatitude(lat);
        setLongitude(lon);

        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });

        setAddress(profile.locationAddress || "");
      }
    } catch (error) {
      console.error("LOAD LOCATION ERROR:", error);
    }
  };

  // Search location using OpenStreetMap
  const searchLocation = async () => {
    const query = searchText.trim();

    if (!query) {
      return;
    }

    Keyboard.dismiss();
    setSearching(true);

    try {
      const url =
        "https://nominatim.openstreetmap.org/search" +
        `?q=${encodeURIComponent(query)}` +
        "&format=json" +
        "&addressdetails=1" +
        "&limit=5" +
        "&countrycodes=in";

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Udyam360/1.0",
        },
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: SearchResult[] = await response.json();

      setSearchResults(data);

      if (data.length === 0) {
        Alert.alert(
          "Location not found",
          "Try entering a village, town, district, or nearby landmark."
        );
      }
    } catch (error) {
      console.error("LOCATION SEARCH ERROR:", error);

      Alert.alert(
        "Search Error",
        "Unable to search for this location. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  // Select a search result
const selectSearchResult = async (
  item: SearchResult
) => {
  const lat = Number(item.lat);
  const lon = Number(item.lon);

  setLatitude(lat);
  setLongitude(lon);

  setRegion({
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  setSearchResults([]);
  Keyboard.dismiss();

  setResolvingLocation(true);

  try {
    const details = await getLocationDetails(lat, lon);

    setSelectedState(details.state);
    setSelectedDistrict(details.district);
    setSelectedVillage(details.village);

    setAddress(details.address || item.display_name);
    setSearchText(details.address || item.display_name);
  } catch (error) {
    console.error("SELECT LOCATION ERROR:", error);

    setAddress(item.display_name);
    setSearchText(item.display_name);
  } finally {
    setResolvingLocation(false);
  }
};

  const getLocationDetails = async (
  lat: number,
  lon: number
) => {
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse" +
      `?lat=${lat}` +
      `&lon=${lon}` +
      "&format=json" +
      "&addressdetails=1";

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Udyam360/1.0",
      },
    });

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    const location = data.address || {};

    const state =
      location.state ||
      location.region ||
      "";

    const district =
      location.state_district ||
      location.district ||
      location.county ||
      location.stateDistrict ||
      "";

    const village =
      location.village ||
      location.hamlet ||
      location.town ||
      location.city_district ||
      location.city ||
      location.municipality ||
      location.suburb ||
      "";

    return {
      address: data.display_name || "",
      state,
      district,
      village,
    };
  } catch (error) {
    console.error("LOCATION DETAILS ERROR:", error);

    return {
      address: "",
      state: "",
      district: "",
      village: "",
    };
  }
};
  // Get address from coordinates
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (results.length > 0) {
        const result = results[0];

        const parts = [
          result.name,
          result.street,
          result.subregion,
          result.city,
          result.region,
          result.country,
        ].filter(Boolean);

        const uniqueParts = [...new Set(parts)];

        return uniqueParts.join(", ");
      }
    } catch (error) {
      console.error("REVERSE GEOCODE ERROR:", error);
    }

    return "";
  };

  // User taps directly on map
  const handleMapPress = async (event: any) => {
  const {
    latitude: lat,
    longitude: lon,
  } = event.nativeEvent.coordinate;

  setLatitude(lat);
  setLongitude(lon);

setRegion((previous: Region) => ({    ...previous,
    latitude: lat,
    longitude: lon,
  }));

  setResolvingLocation(true);

  try {
    const details = await getLocationDetails(lat, lon);

    setSelectedState(details.state);
    setSelectedDistrict(details.district);
    setSelectedVillage(details.village);

    if (details.address) {
      setAddress(details.address);
      setSearchText(details.address);
    }
  } catch (error) {
    console.error("MAP LOCATION ERROR:", error);
  } finally {
    setResolvingLocation(false);
  }
};


  // Use device's current location
const useCurrentLocation = async () => {
  setLoadingLocation(true);
  setResolvingLocation(true);

  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
      Alert.alert(
        "Location Permission Required",
        "Please allow location access to use your current location."
      );
      return;
    }

    const currentPosition =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    const lat = currentPosition.coords.latitude;
    const lon = currentPosition.coords.longitude;

    const details = await getLocationDetails(lat, lon);

    setSelectedState(details.state);
    setSelectedDistrict(details.district);
    setSelectedVillage(details.village);

    setAddress(details.address);
    setSearchText(details.address);

    setLatitude(lat);
    setLongitude(lon);

    setRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  } catch (error) {
    console.error("CURRENT LOCATION ERROR:", error);

    Alert.alert(
      "Unable to Get Location",
      "Please check that your device location is turned on and try again."
    );
  } finally {
    setLoadingLocation(false);
    setResolvingLocation(false);
  }
};

  // Save selected location
  const handleSave = async () => {
    if (latitude === null || longitude === null) {
      Alert.alert(
        "Select Location",
        "Please search for a location, use your current location, or tap on the map."
      );
      return;
    }

    setSaving(true);

    try {
      const existingProfile = await getProfile();

await saveProfile({
  ...(existingProfile || {
    state: "",
    district: "",
    village: "",
    capital: "",
    skills: "",
  }),

  state:
    selectedState ||
    existingProfile?.state ||
    "",

  district:
    selectedDistrict ||
    existingProfile?.district ||
    "",

  village:
    selectedVillage ||
    existingProfile?.village ||
    "",

  locationAddress: address,
  latitude,
  longitude,
});

      Alert.alert(
        "Location Saved",
        "Your location has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("SAVE LOCATION ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to save your location. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Update Location</Text>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />

          <TextInput
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setSearchResults([]);
            }}
            placeholder="Search village, town, district..."
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={searchLocation}
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSearchResults([]);
              }}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchLocation}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.white}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Search results */}
        {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
            <FlatList
            data={searchResults}
            keyExtractor={(item, index) =>
                `${item.lat}-${item.lon}-${index}`
            }
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            style={styles.resultsList}
            renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.resultItem}
                onPress={() => selectSearchResult(item)}
                activeOpacity={0.7}
                >
                <View style={styles.resultIcon}>
                    <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.primary}
                    />
                </View>

                <Text
                    style={styles.resultText}
                    numberOfLines={3}
                >
                    {item.display_name}
                </Text>
                </TouchableOpacity>
            )}
            />
        </View>
        )}
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {latitude !== null && longitude !== null && (
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
            title="Selected Location"
            description={address || "Your selected location"}
          />
        )}
      </MapView>

      {/* Current location */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={useCurrentLocation}
        disabled={loadingLocation}
        activeOpacity={0.85}
      >
        {loadingLocation ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        ) : (
          <Ionicons
            name="locate"
            size={20}
            color={colors.primary}
          />
        )}

        <Text style={styles.currentLocationText}>
          {loadingLocation
            ? "Getting your location..."
            : "Use Current Location"}
        </Text>
      </TouchableOpacity>

      {/* Selected location */}
      <View style={styles.bottomSection}>
        <Text style={styles.selectedLabel}>
          Selected Location
        </Text>

        <View style={styles.addressRow}>
          <Ionicons
            name="location"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.addressText}>
            {address ||
              "Search for a location or tap on the map"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving ||
                resolvingLocation ||
                latitude === null ||
                longitude === null) &&
                styles.saveButtonDisabled,
            ]}
          onPress={handleSave}
          disabled={
            saving ||
            resolvingLocation ||
            latitude === null ||
            longitude === null
            }
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
                size="small"
                color={colors.white}
            />
            ) : resolvingLocation ? (
            <>
                <ActivityIndicator
                size="small"
                color={colors.white}
                />
                <Text style={styles.saveButtonText}>
                Finding Location...
                </Text>
            </>
            ) : (
            <>
                <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.white}
                />
                <Text style={styles.saveButtonText}>
                Save Location
                </Text>
            </>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
resultsList: {
  maxHeight: 300,
},
    
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECE9",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.textPrimary,
    marginLeft: 4,
  },

  searchSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    zIndex: 10,
  },

  searchBox: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#DDE4DF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 9,
  },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  resultsContainer: {
  position: "absolute",
  top: 68,
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.white,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: "#E0E5E1",
  maxHeight: 300,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  zIndex: 100,
},
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EF",
  },

  resultIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  resultText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },

  map: {
    flex: 1,
    marginTop: spacing.md,
  },

  currentLocationButton: {
    position: "absolute",
    right: 16,
    bottom: 245,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 23,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  currentLocationText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  bottomSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: 13,
    paddingBottom: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 8,
  },

  selectedLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 7,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  addressText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
    marginLeft: 8,
  },

  saveButton: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
  },
});