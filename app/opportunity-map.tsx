import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../constants/theme';
import { getMapData, MapData, Competitor } from '../src/services/mapApi';

export default function OpportunityMapScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    category?: string;
    lat?: string;
    lon?: string;
  }>();

  const category = params.category || 'grocery';

  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadMapData = useCallback(async () => {
    try {
      setError('');

      const lat = Number(params.lat);
      const lon = Number(params.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error('Location coordinates are missing.');
      }

      const data = await getMapData(lat, lon, category, 5);

      setMapData(data);
    } catch (err) {
      console.error('Map data error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load map data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, params.lat, params.lon]);

  useFocusEffect(
    useCallback(() => {
      loadMapData();
    }, [loadMapData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMapData();
  };

  const getCompetitorCoordinates = (competitor: Competitor) => {
    const lat = competitor.lat ?? competitor.latitude;
    const lon = competitor.lon ?? competitor.longitude;

    if (
      typeof lat !== 'number' ||
      typeof lon !== 'number'
    ) {
      return null;
    }

    return {
      latitude: lat,
      longitude: lon,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Analysing your local area...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !mapData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="map-outline"
              size={32}
              color={colors.primary}
            />
          </View>

          <Text style={styles.errorTitle}>
            Map data unavailable
          </Text>

          <Text style={styles.errorText}>
            {error || 'Something went wrong while loading the map.'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadMapData}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const proposedLocation = {
    latitude: mapData.proposed_location.lat,
    longitude: mapData.proposed_location.lon,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Competition Map
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Local {category} Competition
        </Text>

        <Text style={styles.subtitle}>
          Businesses detected around your proposed location.
        </Text>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              ...proposedLocation,
              latitudeDelta: 0.06,
              longitudeDelta: 0.06,
            }}
          >
            {/* Proposed location */}
            <Marker
              coordinate={proposedLocation}
              title="Your Proposed Location"
              description={`Potential ${category} business location`}
            >
              <View style={styles.userMarker}>
                <Ionicons
                  name="location"
                  size={22}
                  color="#FFFFFF"
                />
              </View>
            </Marker>

            {/* 5 km analysis radius */}
            <Circle
              center={proposedLocation}
              radius={5000}
              strokeWidth={1}
              fillColor="rgba(46, 125, 50, 0.08)"
              strokeColor={colors.primary}
            />

            {/* Competitors */}
            {mapData.competitors.map(
              (competitor, index) => {
                const coordinates =
                  getCompetitorCoordinates(competitor);

                if (!coordinates) {
                  return null;
                }

                return (
                  <Marker
                    key={`${competitor.business_name || 'competitor'}-${index}`}
                    coordinate={coordinates}
                    title={
                      competitor.business_name ||
                      `Competitor ${index + 1}`
                    }
                    description={
                      competitor.distance_m != null
                        ? `${Math.round(
                            competitor.distance_m
                          )} m away`
                        : category
                    }
                  >
                    <View style={styles.competitorMarker}>
                      <Ionicons
                        name="storefront"
                        size={18}
                        color="#FFFFFF"
                      />
                    </View>
                  </Marker>
                );
              }
            )}
          </MapView>

          {/* Map legend */}
          <View style={styles.legend}>
            <View style={styles.legendRow}>
              <View style={styles.legendProposed} />
              <Text style={styles.legendText}>
                Proposed location
              </Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendCompetitor} />
              <Text style={styles.legendText}>
                Competitor
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="analytics-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              {mapData.competitor_count === 0
                ? 'No competitors detected'
                : `${mapData.competitor_count} competitors detected`}
            </Text>

            <Text style={styles.summaryText}>
              Analysis radius: {mapData.radius_km} km
            </Text>
          </View>
        </View>

        {/* Empty state */}
        {mapData.competitor_count === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons
              name="search-outline"
              size={28}
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>
              Potential market gap
            </Text>

            <Text style={styles.emptyText}>
              No {category} competitors were returned by the
              current backend analysis within {mapData.radius_km}
              km of the proposed location.
            </Text>

            <Text style={styles.disclaimer}>
              This indicates limited detected competition, not
              guaranteed business demand or profitability.
            </Text>
          </View>
        )}

        {/* Competitor list */}
        {mapData.competitors.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Nearby Competitors
            </Text>

            {mapData.competitors.map(
              (competitor, index) => (
                <View
                  key={`${competitor.business_name || 'competitor'}-card-${index}`}
                  style={styles.competitorCard}
                >
                  <View style={styles.storeIcon}>
                    <Ionicons
                      name="storefront-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.competitorInfo}>
                    <Text style={styles.competitorName}>
                      {competitor.business_name ||
                        `Competitor ${index + 1}`}
                    </Text>

                    {competitor.distance_m != null && (
                      <Text style={styles.distance}>
                        {Math.round(
                          competitor.distance_m
                        )}{' '}
                        m away
                      </Text>
                    )}
                  </View>
                </View>
              )
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  headerSpacer: {
    width: 42,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: spacing.lg,
  },

  mapContainer: {
    height: 360,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },

  map: {
    flex: 1,
  },

  userMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  competitorMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  legend: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },

  legendProposed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 7,
  },

  legendCompetitor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555555',
    marginRight: 7,
  },

  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  summaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  disclaimer: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  competitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  storeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  competitorInfo: {
    marginLeft: spacing.md,
  },

  competitorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  distance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  errorIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});