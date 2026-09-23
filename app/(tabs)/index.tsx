// app/(tabs)/index.tsx

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLanguage } from '../../src/services/i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, shadows } from '../../constants/theme';
import { formatINR, getGreeting } from '../../utils/format';
import {
  currentUser,
  opportunityScore,
  capitalInfo,
  marketPotential,
  topRecommendation,
  nearbyOpportunities,
  marketPulse,
} from '../../data/mockData';
import { getUser, getProfile } from '../../src/services/auth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SectionHeader from '../../components/ui/SectionHeader';
import StatTile from '../../components/ui/StatTile';
import ScoreGauge from '../../components/ui/ScoreGauge';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [userName, setUserName] = useState(currentUser.name);
  const [village, setVillage] = useState(currentUser.location);
  const [district, setDistrict] = useState(currentUser.district);
  const [capital, setCapital] = useState('');
  const [avatarInitials, setAvatarInitials] = useState(
  currentUser.avatarInitials
);
const [locationAddress, setLocationAddress] = useState("");

  useFocusEffect(
  useCallback(() => {
    const loadUserData = async () => {
      const user = await getUser();
      const profile = await getProfile();

      if (user) {
        setUserName(user.name);

        const initials = user.name
          .trim()
          .split(/\s+/)
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        setAvatarInitials(initials);
      }

      if (profile) {
        setVillage(profile.village);
        setDistrict(profile.district);
        setCapital(profile.capital);
        setLocationAddress(
          profile.locationAddress || ""
        );
      }
    };

    loadUserData();
  }, [])
);

  return (    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileHeaderButton}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {avatarInitials}
              </Text>
            </View>

            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>
                {getGreeting()}, {userName.split(' ')[0]}
              </Text>

              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={colors.textSecondary}
                />

                <Text
                  style={styles.locationText}
                  numberOfLines={1}
                >
                  {locationAddress || `${village}, ${district}`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellWrap}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.textPrimary}
            />

            {currentUser.notificationsCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>
                  {currentUser.notificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* AI Opportunity Score */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreCardRow}>
            <ScoreGauge score={opportunityScore.score} label="/ 100" />
            <View style={styles.scoreCardDetails}>
              <Text style={styles.scoreCardLabel}>{t.aiOpportunityScore}</Text>
              <Text style={styles.scoreCardHeadline}>{opportunityScore.label}</Text>
              <View style={styles.trendRow}>
                <Ionicons
                  name={opportunityScore.trend === 'up' ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={colors.success}
                />
                <Text style={styles.trendText}>{opportunityScore.trendValue}</Text>
              </View>
              <Text style={styles.updatedText}>Updated {opportunityScore.updatedAt}</Text>
            </View>
          </View>
        </Card>

        {/* Capital + Market Potential */}
        <View style={styles.statsRow}>
          <StatTile
            icon="wallet-outline"
            iconColor={colors.primary}
            iconBg={colors.primaryLight}
            label={t.availableCapital}
            value={
              capital
                ? `₹${Number(capital.replace(/,/g, '')).toLocaleString('en-IN')}`
                : '₹0'
            }
            subLabel={`${capitalInfo.schemesEligible} ${t.govtSchemesEligible}`}
          />
          <View style={{ width: spacing.md }} />
          <StatTile
            icon="trending-up-outline"
            iconColor={colors.accentDark}
            iconBg={colors.accentLight}
            label={t.marketPotential}
            value={`${marketPotential.score}/100`}
            subLabel={`${marketPotential.demandLevel} demand · +${marketPotential.growthPercent}%`}
          />
        </View>

        {/* Top Recommended Business */}
        <View style={styles.section}>
          <SectionHeader title={t.topRecommendedBusiness} subtitle={t.basedOnProfileLocation} />
          <Card style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationIconWrap}>
                <Ionicons name={topRecommendation.iconName as any} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Badge label={topRecommendation.category} variant="neutral" />
                <Text style={styles.recommendationTitle}>{topRecommendation.title}</Text>
              </View>
              <Badge label={`${topRecommendation.matchScore}% match`} variant="success" />
            </View>

            <Text style={styles.recommendationDescription}>{topRecommendation.description}</Text>

            <View style={styles.recommendationStatsRow}>
              <View style={styles.recommendationStat}>
                <Text style={styles.recommendationStatLabel}>{t.investment}</Text>
                <Text style={styles.recommendationStatValue}>
                  {formatINR(topRecommendation.estimatedInvestment, true)}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.recommendationStat}>
                <Text style={styles.recommendationStatLabel}>{t.monthlyIncome}</Text>
                <Text style={styles.recommendationStatValue}>
                  {formatINR(topRecommendation.estimatedMonthlyIncome, true)}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.recommendationStat}>
                <Text style={styles.recommendationStatLabel}>{t.roiTime}</Text>
                <Text style={styles.recommendationStatValue}>{topRecommendation.roiMonths} mo</Text>
              </View>
            </View>

            <Button
              label={t.viewFullAnalysis}
              icon="arrow-forward"
              iconPosition="right"
              fullWidth
              onPress={() => router.push('/(tabs)/opportunities')}
            />
          </Card>
        </View>

        {/* Top Opportunities Near You */}
        <View style={styles.section}>
          <SectionHeader
            title={t.topOpportunitiesNearYou}
  subtitle={`${nearbyOpportunities.length} ${t.matchesWithin25Km}`}
  actionLabel={t.seeAll}
            onActionPress={() => router.push('/(tabs)/opportunities')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.opportunitiesScroll}
          >
            {nearbyOpportunities.map((op) => (
              <Card key={op.id} style={styles.opportunityCard}>
                <View style={styles.opportunityTopRow}>
                  <View style={styles.opportunityIconWrap}>
                    <Ionicons name={op.iconName as any} size={18} color={colors.primary} />
                  </View>
                  {op.tag ? (
                    <Badge
                      label={op.tag}
                      variant={op.tag === 'Hot' ? 'danger' : op.tag === 'New' ? 'info' : 'accent'}
                    />
                  ) : null}
                </View>

                <Text style={styles.opportunityTitle} numberOfLines={2}>
                  {op.title}
                </Text>
                <Text style={styles.opportunityMeta}>
                  {op.category} · {op.village} · {op.distanceKm} km
                </Text>

                <View style={styles.opportunityFooter}>
                  <View style={styles.opportunityScoreWrap}>
                    <Ionicons name="flash" size={12} color={colors.accentDark} />
                    <Text style={styles.opportunityScoreText}>{op.potentialScore}</Text>
                  </View>
                  <Text style={styles.opportunityInvestment}>{op.investmentRange}</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Local Market Pulse */}
        <View style={styles.section}>
          <SectionHeader
              title={t.localMarketPulse}
  subtitle={t.liveStyleTrends}
  actionLabel={t.viewMarket}
            onActionPress={() => router.push('/(tabs)/market')}
          />
          <Card padded={false}>
            {marketPulse.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.pulseRow,
                  index !== marketPulse.length - 1 && styles.pulseRowBorder,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.pulseName}>{item.name}</Text>
                  <Text style={styles.pulseDetail}>{item.detail}</Text>
                </View>
                <View style={styles.pulseChangeWrap}>
                  <Ionicons
                    name={item.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={13}
                    color={item.trend === 'up' ? colors.success : colors.danger}
                  />
                  <Text
                    style={[
                      styles.pulseChangeText,
                      { color: item.trend === 'up' ? colors.success : colors.danger },
                    ]}
                  >
                    {Math.abs(item.changePercent).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
            {/* Financial Structuring Assistant */}
<View style={styles.section}>
  <Card style={styles.financialCard}>
    <View style={styles.financialHeader}>
      <View style={styles.financialIconWrap}>
        <Ionicons
          name="wallet-outline"
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.financialHeaderText}>
        <Text style={styles.financialTitle}>
          Financial Structuring Assistant
        </Text>

        <Text style={styles.financialSubtitle}>
          Estimate EMI, repayment, profit and cash surplus
        </Text>
      </View>
    </View>

    <Button
      label="Plan My Finances"
      
      fullWidth
      onPress={() => router.push("/financial-structuring")}
    />
  </Card>
</View>
        {/* Ask Opportunity AI */}
        <View style={[styles.section, styles.askSection]}>
          <Button
            label={t.askOpportunityAI}
            icon="sparkles"
            fullWidth
            onPress={() => router.push('/(tabs)/assistant')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
profileHeaderButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
},

 financialCard: {
  ...shadows.soft,
},

financialHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.lg,
},

financialIconWrap: {
  width: 44,
  height: 44,
  borderRadius: radius.md,
  backgroundColor: colors.primaryLight,
  alignItems: 'center',
  justifyContent: 'center',
},

financialHeaderText: {
  flex: 1,
  marginLeft: spacing.md,
},

financialTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: colors.textPrimary,
},

financialSubtitle: {
  fontSize: 12.5,
  color: colors.textSecondary,
  lineHeight: 18,
  marginTop: 4,
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
    paddingBottom: spacing.xxxl * 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 3,
    fontWeight: '500',
  },
  bellWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },

  scoreCard: {
    marginBottom: spacing.md,
  },
  scoreCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCardDetails: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  scoreCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scoreCardHeadline: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 3,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 4,
  },
  updatedText: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 6,
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },

  section: {
    marginBottom: spacing.xl,
  },
  askSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },

  recommendationCard: {},
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  recommendationDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: spacing.md,
  },
  recommendationStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  recommendationStat: {
    flex: 1,
    alignItems: 'center',
  },
  recommendationStatLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationStatValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },

  opportunitiesScroll: {
    paddingRight: spacing.lg,
  },
  opportunityCard: {
    width: 210,
    marginRight: spacing.md,
    ...shadows.soft,
  },
  opportunityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  opportunityIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opportunityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minHeight: 36,
  },
  opportunityMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  opportunityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  opportunityScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  opportunityScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentDark,
    marginLeft: 3,
  },
  opportunityInvestment: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pulseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pulseName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pulseDetail: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 3,
  },
  pulseChangeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  pulseChangeText: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 3,
  },
});