// app/(tabs)/opportunities.tsx

import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { colors, radius, spacing } from '../../constants/theme';
import { getProfile } from '../../src/services/auth';
import {
  CompetitionAnalysis,
  getCompetitionAnalysis,
} from '../../src/services/competitorApi';

const CATEGORIES = [
  'grocery',
  'dairy',
  'pharmacy',
  'restaurant',
  'clothing',
  'salon',
];

export default function OpportunitiesScreen() {
  const router = useRouter();
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [capital, setCapital] = useState('');
  const [skills, setSkills] = useState('');

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [category, setCategory] = useState('grocery');
  const [customCategory, setCustomCategory] = useState('');

  const [analysis, setAnalysis] =
    useState<CompetitionAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    const profile = await getProfile();

    if (!profile) {
      return;
    }

    setVillage(profile.village || '');
    setDistrict(profile.district || '');
    setState(profile.state || '');
    setCapital(profile.capital || '');
    setSkills(profile.skills || '');

    setLatitude(
      typeof profile.latitude === 'number'
        ? profile.latitude
        : null
    );

    setLongitude(
      typeof profile.longitude === 'number'
        ? profile.longitude
        : null
    );

    setLocationAddress(profile.locationAddress || '');
    
    // Try to extract pincode from locationAddress if available
    if (profile.locationAddress) {
      const pinMatch = profile.locationAddress.match(/\b\d{6}\b/);
      if (pinMatch) {
        setPincode(pinMatch[0]);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const analyzeOpportunity = async () => {
    if (!pincode.trim()) {
      Alert.alert(
        'Pincode Required',
        'Please enter a 6-digit Pincode to analyze density.'
      );
      return;
    }

    const selectedCategory =
      customCategory.trim() || category.trim();

    if (!selectedCategory) {
      Alert.alert(
        'Category Required',
        'Please select or enter a business category.'
      );
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      const result = await getCompetitionAnalysis(
        pincode.trim(),
        selectedCategory.toLowerCase()
      );

      if (!result) {
        Alert.alert(
          'No Data Found',
          `No registered business data could be found for PIN ${pincode} in this category.`
        );
        return;
      }

      setAnalysis(result);
    } catch (error) {
      console.error('Opportunity analysis error:', error);

      Alert.alert(
        'Unable to Analyze',
        'We could not get the competition analysis right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await loadProfile();

    setRefreshing(false);
  };

  const getCompetitionDescription = () => {
    if (!analysis) return '';

    return `${analysis.category_businesses.toLocaleString()} registered businesses in ${analysis.basic_category} were recorded for PIN ${analysis.pincode}. The density score is ${analysis.density_score.toFixed(2)}.`;
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}

        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>
              Opportunity Gap Detector
            </Text>

            <Text style={styles.pageSubtitle}>
              Discover business opportunities around your location.
            </Text>
          </View>

          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Location */}

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="location"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.locationInfo}>
            <Text style={styles.smallLabel}>
              ANALYZING LOCATION
            </Text>

            <Text style={styles.locationTitle}>
              {village || 'Your village'}
              {district ? `, ${district}` : ''}
            </Text>

            <Text style={styles.locationAddress}>
              {locationAddress ||
                `${district || 'Your district'}, ${state || 'Maharashtra'}`}
            </Text>
          </View>
        </View>

        {/* Pincode Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit Pincode"
          placeholderTextColor={colors.textSecondary}
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          maxLength={6}
        />

        {/* Category */}

        <Text style={styles.sectionTitle}>
          What business are you considering?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((item) => {
            const selected =
              category === item && !customCategory;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,
                  selected && styles.categoryChipSelected,
                ]}
                onPress={() => {
                  setCategory(item);
                  setCustomCategory('');
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}
                >
                  {item.charAt(0).toUpperCase() +
                    item.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Custom category */}

        <TextInput
          style={styles.input}
          placeholder="Or enter another business category"
          placeholderTextColor={colors.textSecondary}
          value={customCategory}
          onChangeText={setCustomCategory}
          onFocus={() => {
            setCategory('');
          }}
        />

        {/* Analyze button */}

        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={analyzeOpportunity}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="search"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.analyzeButtonText}>
                Analyze Opportunity
              </Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>

        {/* Loading */}

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              Loading registered-business density for your location...
            </Text>
          </View>
        )}

        {/* Results */}

        {analysis && !loading && (
          <>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultEyebrow}>
                  REGISTERED BUSINESS DENSITY
                </Text>

                <Text style={styles.resultTitle}>
                  {analysis.basic_category.charAt(0).toUpperCase() +
                    analysis.basic_category.slice(1)}
                </Text>
              </View>

              <View style={styles.competitionBadge}>
                <Text style={styles.competitionBadgeText}>
                  {analysis.competition_level}
                </Text>
              </View>
            </View>

            {/* Main result card */}

            <View style={styles.resultCard}>
              <View style={styles.resultCardTop}>
                <View style={styles.robotCircle}>
                  <Ionicons
                    name="sparkles"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.resultCardTitleWrap}>
                  <Text style={styles.resultCardLabel}>
                    OPPORTUNITY SIGNAL
                  </Text>

                  <Text style={styles.resultCardTitle}>
                    {analysis.competition_level}
                  </Text>
                </View>
              </View>

              <Text style={styles.resultDescription}>
                {getCompetitionDescription()}
              </Text>
            </View>

            <TouchableOpacity
  style={styles.exploreButton}
  activeOpacity={0.8}
  onPress={() => {
    if (!analysis) return;

    router.push({
      pathname: '/opportunity-details',
      params: {
        category: analysis.basic_category,
        competitionLevel: analysis.competition_level,
        densityCategory: analysis.basic_category,
        pincode: analysis.pincode,
        categoryBusinesses: String(analysis.category_businesses),
        totalBusinesses: String(analysis.total_businesses),
        densityScore: String(analysis.density_score),
        capital,
        skills,
        village,
        district,
      },
    });
  }}
>
  <Text style={styles.exploreButtonText}>
    Explore Opportunity
  </Text>

  <Ionicons
    name="arrow-forward"
    size={19}
    color="#FFFFFF"
  />
</TouchableOpacity>

            {/* Registered-business density statistics */}

            <Text style={styles.sectionTitle}>
              Registered Business Density
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="storefront-outline" size={23} color={colors.primary} />
                <Text style={styles.statNumber}>
                  {analysis.category_businesses.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>
                  Businesses in {analysis.basic_category}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="business-outline" size={23} color={colors.primary} />
                <Text style={styles.statNumber}>
                  {analysis.total_businesses.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total businesses</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="analytics-outline" size={23} color={colors.primary} />
                <Text style={styles.statNumber}>
                  {analysis.density_score.toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Density score</Text>
              </View>
            </View>

            <Text style={styles.loadingText}>
              PIN {analysis.pincode}
            </Text>
          </>
        )}

        {/* Initial state */}

        {!analysis && !loading && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="bulb-outline"
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Find a local opportunity
            </Text>

            <Text style={styles.emptyText}>
              Select a business category and let Udyam360
              analyze the competition around your location.
            </Text>
          </View>
        )}

        {/* Profile information */}

        <View style={styles.profileInfo}>
          <Text style={styles.profileInfoTitle}>
            Your business profile
          </Text>

          <View style={styles.profileRow}>
            <Ionicons
              name="wallet-outline"
              size={19}
              color={colors.primary}
            />

            <Text style={styles.profileText}>
              Capital: ₹{capital || '0'}
            </Text>
          </View>

          <View style={styles.profileRow}>
            <Ionicons
              name="construct-outline"
              size={19}
              color={colors.primary}
            />

            <Text
              style={styles.profileText}
              numberOfLines={2}
            >
              Skills: {skills || 'Not specified'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exploreButton: {
  height: 50,
  borderRadius: radius.lg,
  backgroundColor: colors.primary,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  marginTop: spacing.lg,
},

exploreButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '800',
},

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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  pageTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 34,
  },

  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 21,
  },

  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  locationInfo: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  locationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 3,
  },

  locationAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  categoryScroll: {
    paddingBottom: spacing.sm,
  },

  categoryChip: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },

  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  categoryTextSelected: {
    color: '#FFFFFF',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  analyzeButton: {
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },

  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  loadingText: {
    marginLeft: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  resultEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.primary,
  },

  resultTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },

  competitionBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 145,
  },

  competitionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },

  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },

  resultCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  robotCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  resultCardTitleWrap: {
    flex: 1,
  },

  resultCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  resultCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 3,
  },

  resultDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.md,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 125,
    justifyContent: 'center',
  },

  statNumber: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },

  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  nearestCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 7,
  },

  profileInfo: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  profileInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  profileText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 10,
  },
});