import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { colors, radius, spacing } from '../../constants/theme';
import { getProfile } from '../../src/services/auth';

type MarketSignal = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function MarketScreen() {
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getProfile();

      if (profile) {
        setVillage(profile.village || '');
        setDistrict(profile.district || '');
        setState(profile.state || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const location =
    [village, district, state]
      .filter(Boolean)
      .join(', ') || 'Your area';

  const marketSignals: MarketSignal[] = [
    {
      title: 'Local Demand',
      description:
        'Demand indicators will be analysed from real market and locality data.',
      icon: 'trending-up-outline',
    },
    {
      title: 'Commodity Prices',
      description:
        'Relevant commodity and market-price trends will help identify changing opportunities.',
      icon: 'stats-chart-outline',
    },
    {
      title: 'Market Gaps',
      description:
        'Udyam360 will compare demand signals with local competition to identify underserved categories.',
      icon: 'search-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Market Intelligence</Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.primary}
          />

          <Text style={styles.pageSubtitle}>
            {location}
          </Text>
        </View>

        {/* Main introduction */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="analytics-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Understand your local market
            </Text>

            <Text style={styles.heroText}>
              Udyam360 will combine market signals, commodity
              trends and local competition to help identify
              potential business gaps.
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="construct-outline"
              size={22}
              color={colors.info}
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Market data integration
            </Text>

            <Text style={styles.statusText}>
              Real market data will be connected here next.
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              NEXT
            </Text>
          </View>
        </View>

        {/* Signals */}
        <Text style={styles.sectionTitle}>
          What Udyam360 will analyse
        </Text>

        {marketSignals.map((signal) => (
          <View
            key={signal.title}
            style={styles.signalCard}
          >
            <View style={styles.signalIcon}>
              <Ionicons
                name={signal.icon}
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.signalContent}>
              <Text style={styles.signalTitle}>
                {signal.title}
              </Text>

              <Text style={styles.signalDescription}>
                {signal.description}
              </Text>
            </View>
          </View>
        ))}

        {/* Opportunity connection */}
        <Text style={styles.sectionTitle}>
          From data to opportunity
        </Text>

        <View style={styles.flowCard}>
          <FlowItem
            icon="location-outline"
            title="Local Area"
          />

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.textSecondary}
          />

          <FlowItem
            icon="trending-up-outline"
            title="Demand"
          />

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.textSecondary}
          />

          <FlowItem
            icon="storefront-outline"
            title="Competition"
          />

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.textSecondary}
          />

          <FlowItem
            icon="bulb-outline"
            title="Opportunity"
          />
        </View>

        {/* Current location */}
        <View style={styles.locationCard}>
          <Ionicons
            name="map-outline"
            size={22}
            color={colors.primary}
          />

          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              Your market area
            </Text>

            <Text style={styles.locationValue}>
              {location}
            </Text>
          </View>
        </View>

        {/* Future note */}
        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.textSecondary}
          />

          <Text style={styles.noteText}>
            Market indicators are still being connected.
            Udyam360 will avoid showing estimated demand
            values until reliable data is available.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FlowItem({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.flowItem}>
      <Ionicons
        name={icon}
        size={18}
        color={colors.primary}
      />

      <Text style={styles.flowText}>{title}</Text>
    </View>
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

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: spacing.xl,
  },

  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: '500',
  },

  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  heroText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 5,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  statusText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.info,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  signalCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  signalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signalContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  signalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  signalDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 3,
  },

  flowCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  flowItem: {
    alignItems: 'center',
    flex: 1,
  },

  flowText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },

  locationContent: {
    marginLeft: spacing.md,
  },

  locationTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  locationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 3,
  },

  noteCard: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingHorizontal: 4,
  },

  noteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  errorText: {
    color: colors.textSecondary,
  },
});