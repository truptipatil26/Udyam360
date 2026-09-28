// app/opportunity-details.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../constants/theme';

export default function OpportunityDetailsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    category?: string;
    competitionLevel?: string;
    densityCategory?: string;
    pincode?: string;
    categoryBusinesses?: string;
    totalBusinesses?: string;
    densityScore?: string;
    capital?: string;
    skills?: string;
    village?: string;
    district?: string;
  }>();

  const category = params.category || 'Business Opportunity';
  const competitionLevel = params.competitionLevel || 'Unknown';

  const densityCategory = params.densityCategory || category;
  const pincode = params.pincode || 'Unknown';
  const categoryBusinesses = params.categoryBusinesses || '0';
  const totalBusinesses = params.totalBusinesses || '0';
  const densityScore = params.densityScore || '0';

  const capital = params.capital || 'Not specified';
  const skills = params.skills || 'Not specified';

  const isLowCompetition =
    competitionLevel.toLowerCase().includes('low') ||
    competitionLevel.toLowerCase().includes('no');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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

          <Text style={styles.headerTitle}>Opportunity Details</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="storefront-outline"
              size={34}
              color={colors.primary}
            />
          </View>

          <Text style={styles.categoryTitle}>{category}</Text>

          <View
            style={[
              styles.competitionBadge,
              isLowCompetition
                ? styles.lowCompetitionBadge
                : styles.otherCompetitionBadge,
            ]}
          >
            <Text
              style={[
                styles.competitionText,
                isLowCompetition
                  ? styles.lowCompetitionText
                  : styles.otherCompetitionText,
              ]}
            >
              {competitionLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Demand placeholder */}
        <View style={styles.demandCard}>
          <View style={styles.demandIcon}>
            <Ionicons
              name="trending-up-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.demandContent}>
            <Text style={styles.demandLabel}>MARKET DEMAND</Text>
            <Text style={styles.demandTitle}>
              Demand analysis coming next
            </Text>
            <Text style={styles.demandBody}>
              Udyam360 will combine local market demand with competition data
              to identify stronger business opportunities.
            </Text>
          </View>
        </View>

        {/* Competition overview */}
        <Text style={styles.sectionTitle}>Registered Business Density</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categoryBusinesses}</Text>
            <Text style={styles.statLabel}>Businesses in {densityCategory}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalBusinesses}</Text>
            <Text style={styles.statLabel}>Total businesses</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{densityScore}</Text>
            <Text style={styles.statLabel}>Density score</Text>
          </View>
        </View>

        <Text style={styles.locationText}>
          PIN {pincode}
        </Text>

        {/* Why this opportunity */}
        <Text style={styles.sectionTitle}>Why this opportunity?</Text>

        <View style={styles.infoCard}>
          <Ionicons
            name="bulb-outline"
            size={25}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            {categoryBusinesses} registered businesses in {densityCategory} (the broader density category for {category}) were recorded for PIN {pincode}, out of {totalBusinesses} businesses overall. The density score is {densityScore}.
          </Text>
        </View>

        {/* User profile */}
        <Text style={styles.sectionTitle}>Your Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons
              name="cash-outline"
              size={21}
              color={colors.primary}
            />

            <View>
              <Text style={styles.profileLabel}>Available Capital</Text>
              <Text style={styles.profileValue}>₹{capital}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Ionicons
              name="construct-outline"
              size={21}
              color={colors.primary}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.profileLabel}>Skills</Text>
              <Text style={styles.profileValue}>{skills}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        {(params.village || params.district) && (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.textSecondary}
            />

            <Text style={styles.locationText}>
              {[params.village, params.district]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.secondaryButtonText}>
            Check Eligibility for Loan
          </Text>
        </TouchableOpacity>
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

  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.md,
    textTransform: 'capitalize',
  },

  competitionBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },

  lowCompetitionBadge: {
    backgroundColor: colors.primaryLight,
  },

  otherCompetitionBadge: {
    backgroundColor: '#F2F2F2',
  },

  competitionText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  lowCompetitionText: {
    color: colors.primary,
  },

  otherCompetitionText: {
    color: colors.textSecondary,
  },

  demandCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },

  demandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  demandContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  demandLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },

  demandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 3,
  },

  demandBody: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },

  statLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  infoText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  profileLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  profileValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: 4,
  },

  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },

  secondaryButton: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});