// app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../src/services/i18n/LanguageContext';

import Badge from '../../components/ui/Badge';
import ScoreGauge from '../../components/ui/ScoreGauge';
import SectionHeader from '../../components/ui/SectionHeader';
import StatTile from '../../components/ui/StatTile';

import { shadows } from '../../constants/theme';

import {
  capitalInfo,
  currentUser,
  marketPotential,
  marketPulse,
  nearbyOpportunities,
  opportunityScore,
  topRecommendation,
} from '../../data/mockData';

import { getProfile, getUser } from '../../src/services/auth';
import { formatINR, getGreeting } from '../../utils/format';

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
  const [locationAddress, setLocationAddress] = useState('');

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
          setLocationAddress(profile.locationAddress || '');
        }
      };

      loadUserData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

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
                  size={14}
                  color={COLORS.muted}
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
            style={styles.notificationButton}
            activeOpacity={0.75}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={COLORS.text}
            />

            {currentUser.notificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {currentUser.notificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* =====================================================
            OPPORTUNITY SCORE
        ====================================================== */}

        <View style={styles.scoreSection}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreTitle}>
                  {t.aiOpportunityScore}
                </Text>

                <Text style={styles.scoreSubtitle}>
                  Based on your location and profile
                </Text>
              </View>

              <View style={styles.scoreInfo}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={COLORS.muted}
                />
              </View>
            </View>

            <View style={styles.scoreContent}>
              <View style={styles.scoreGauge}>
                <ScoreGauge
                  score={opportunityScore.score}
                  label="/ 100"
                />
              </View>

              <View style={styles.scoreDetails}>
                <Text style={styles.scoreHeadline}>
                  {opportunityScore.label}
                </Text>

                <Text style={styles.scoreDescription}>
                  Your area has promising business opportunities.
                </Text>

                <View style={styles.scoreBottom}>
                  <View style={styles.trendPill}>
                    <Ionicons
                      name={
                        opportunityScore.trend === 'up'
                          ? 'trending-up'
                          : 'trending-down'
                      }
                      size={13}
                      color={COLORS.green}
                    />

                    <Text style={styles.trendText}>
                      {opportunityScore.trendValue}
                    </Text>
                  </View>

                  <Text style={styles.updatedText}>
                    Updated {opportunityScore.updatedAt}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <View style={styles.quickSection}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Quick Actions
              </Text>

              <Text style={styles.sectionSubtitle}>
                Explore what you can do
              </Text>
            </View>
          </View>

          <View style={styles.quickActionsGrid}>
            {/* Opportunities */}

            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.quickAction,
                styles.quickGreen,
              ]}
              onPress={() =>
                router.push('/(tabs)/opportunities')
              }
            >
              <View
                style={[
                  styles.quickIcon,
                  styles.quickIconGreen,
                ]}
              >
                <Ionicons
                  name="compass-outline"
                  size={25}
                  color={COLORS.green}
                />
              </View>

              <Text style={styles.quickTitle}>
                Find
              </Text>

              <Text style={styles.quickTitle}>
                Opportunities
              </Text>
            </TouchableOpacity>

            {/* Market */}

            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.quickAction,
                styles.quickBlue,
              ]}
              onPress={() =>
                router.push('/(tabs)/market')
              }
            >
              <View
                style={[
                  styles.quickIcon,
                  styles.quickIconBlue,
                ]}
              >
                <Ionicons
                  name="bar-chart-outline"
                  size={25}
                  color={COLORS.blue}
                />
              </View>

              <Text style={styles.quickTitle}>
                Market
              </Text>

              <Text style={styles.quickTitle}>
                Trends
              </Text>
            </TouchableOpacity>

            {/* Financial */}

            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.quickAction,
                styles.quickPurple,
              ]}
              onPress={() =>
                router.push('/financial-structuring')
              }
            >
              <View
                style={[
                  styles.quickIcon,
                  styles.quickIconPurple,
                ]}
              >
                <Ionicons
                  name="calculator-outline"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              <Text style={styles.quickTitle}>
                Financial
              </Text>

              <Text style={styles.quickTitle}>
                Planning
              </Text>
            </TouchableOpacity>

            {/* AI */}

            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.quickAction,
                styles.quickOrange,
              ]}
              onPress={() =>
                router.push('/(tabs)/assistant')
              }
            >
              <View
                style={[
                  styles.quickIcon,
                  styles.quickIconOrange,
                ]}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={25}
                  color={COLORS.orange}
                />
              </View>

              <Text style={styles.quickTitle}>
                AI
              </Text>

              <Text style={styles.quickTitle}>
                Advisor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            AVAILABLE CAPITAL / MARKET POTENTIAL
        ====================================================== */}

        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>
              Your Business Snapshot
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <StatTile
                icon="wallet-outline"
                iconColor={COLORS.green}
                iconBg={COLORS.greenLight}
                label={t.availableCapital}
                value={
                  capital
                    ? `₹${Number(
                        capital.replace(/,/g, '')
                      ).toLocaleString('en-IN')}`
                    : '₹0'
                }
                subLabel={`${capitalInfo.schemesEligible} ${t.govtSchemesEligible}`}
              />
            </View>

            <View style={styles.statGap} />

            <View style={styles.statBox}>
              <StatTile
                icon="trending-up-outline"
                iconColor={COLORS.gold}
                iconBg={COLORS.goldLight}
                label={t.marketPotential}
                value={`${marketPotential.score}/100`}
                subLabel={`${marketPotential.demandLevel} demand · +${marketPotential.growthPercent}%`}
              />
            </View>
          </View>
        </View>

        {/* =====================================================
            TOP RECOMMENDATION
        ====================================================== */}

        <View style={styles.section}>
          <SectionHeader
            title={t.topRecommendedBusiness}
            subtitle={t.basedOnProfileLocation}
          />

          <View style={styles.recommendationCard}>
            <View style={styles.recommendationTop}>
              <View style={styles.recommendationIcon}>
                <Ionicons
                  name={
                    topRecommendation.iconName as any
                  }
                  size={25}
                  color={COLORS.green}
                />
              </View>

              <View style={styles.recommendationMain}>
                <Badge
                  label={topRecommendation.category}
                  variant="neutral"
                />

                <Text
                  style={styles.recommendationTitle}
                >
                  {topRecommendation.title}
                </Text>
              </View>

              <Badge
                label={`${topRecommendation.matchScore}% match`}
                variant="success"
              />
            </View>

            <Text style={styles.recommendationDescription}>
              {topRecommendation.description}
            </Text>

            <View style={styles.recommendationStats}>
              <View style={styles.recommendationStat}>
                <Text
                  style={styles.recommendationStatLabel}
                >
                  {t.investment}
                </Text>

                <Text
                  style={styles.recommendationStatValue}
                >
                  {formatINR(
                    topRecommendation.estimatedInvestment,
                    true
                  )}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.recommendationStat}>
                <Text
                  style={styles.recommendationStatLabel}
                >
                  {t.monthlyIncome}
                </Text>

                <Text
                  style={styles.recommendationStatValue}
                >
                  {formatINR(
                    topRecommendation.estimatedMonthlyIncome,
                    true
                  )}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.recommendationStat}>
                <Text
                  style={styles.recommendationStatLabel}
                >
                  {t.roiTime}
                </Text>

                <Text
                  style={styles.recommendationStatValue}
                >
                  {topRecommendation.roiMonths} mo
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.greenButton}
              onPress={() =>
                router.push('/(tabs)/opportunities')
              }
            >
              <Text style={styles.greenButtonText}>
                {t.viewFullAnalysis}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            NEARBY OPPORTUNITIES
        ====================================================== */}

        <View style={styles.section}>
          <SectionHeader
            title={t.topOpportunitiesNearYou}
            subtitle={`${nearbyOpportunities.length} ${t.matchesWithin25Km}`}
            actionLabel={t.seeAll}
            onActionPress={() =>
              router.push('/(tabs)/opportunities')
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.opportunitiesScroll
            }
          >
            {nearbyOpportunities.map((op) => (
              <View
                key={op.id}
                style={styles.opportunityCard}
              >
                <View style={styles.opportunityTop}>
                  <View style={styles.opportunityIcon}>
                    <Ionicons
                      name={op.iconName as any}
                      size={20}
                      color={COLORS.green}
                    />
                  </View>

                  {op.tag ? (
                    <Badge
                      label={op.tag}
                      variant={
                        op.tag === 'Hot'
                          ? 'danger'
                          : op.tag === 'New'
                          ? 'info'
                          : 'accent'
                      }
                    />
                  ) : null}
                </View>

                <Text
                  style={styles.opportunityTitle}
                  numberOfLines={2}
                >
                  {op.title}
                </Text>

                <Text style={styles.opportunityMeta}>
                  {op.category} · {op.village} ·{' '}
                  {op.distanceKm} km
                </Text>

                <View style={styles.opportunityFooter}>
                  <View style={styles.potentialPill}>
                    <Ionicons
                      name="flash"
                      size={12}
                      color={COLORS.gold}
                    />

                    <Text style={styles.potentialText}>
                      {op.potentialScore}
                    </Text>
                  </View>

                  <Text
                    style={styles.opportunityInvestment}
                  >
                    {op.investmentRange}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* =====================================================
            MARKET PULSE
        ====================================================== */}

        <View style={styles.section}>
          <SectionHeader
            title={t.localMarketPulse}
            subtitle={t.liveStyleTrends}
            actionLabel={t.viewMarket}
            onActionPress={() =>
              router.push('/(tabs)/market')
            }
          />

          <View style={styles.marketCard}>
            {marketPulse.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.marketRow,
                  index !== marketPulse.length - 1 &&
                    styles.marketRowBorder,
                ]}
              >
                <View style={styles.marketIcon}>
                  <Ionicons
                    name={
                      item.trend === 'up'
                        ? 'trending-up-outline'
                        : 'trending-down-outline'
                    }
                    size={18}
                    color={
                      item.trend === 'up'
                        ? COLORS.green
                        : COLORS.red
                    }
                  />
                </View>

                <View style={styles.marketInfo}>
                  <Text style={styles.marketName}>
                    {item.name}
                  </Text>

                  <Text style={styles.marketDetail}>
                    {item.detail}
                  </Text>
                </View>

                <View style={styles.marketChange}>
                  <Ionicons
                    name={
                      item.trend === 'up'
                        ? 'arrow-up'
                        : 'arrow-down'
                    }
                    size={13}
                    color={
                      item.trend === 'up'
                        ? COLORS.green
                        : COLORS.red
                    }
                  />

                  <Text
                    style={[
                      styles.marketChangeText,
                      {
                        color:
                          item.trend === 'up'
                            ? COLORS.green
                            : COLORS.red,
                      },
                    ]}
                  >
                    {Math.abs(
                      item.changePercent
                    ).toFixed(1)}
                    %
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* =====================================================
            FINANCIAL STRUCTURING
        ====================================================== */}

        <View style={styles.section}>
          <View style={styles.financialCard}>
            <View style={styles.financialIcon}>
              <Ionicons
                name="wallet-outline"
                size={23}
                color={COLORS.green}
              />
            </View>

            <View style={styles.financialContent}>
              <Text style={styles.financialTitle}>
                Financial Structuring Assistant
              </Text>

              
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.smallArrowButton}
              onPress={() =>
                router.push('/financial-structuring')
              }
            >
              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.green}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            AI ADVISOR
        ====================================================== */}

        <View style={styles.aiSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.aiCard}
            onPress={() =>
              router.push('/(tabs)/assistant')
            }
          >
            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>
                {t.askOpportunityAI}
              </Text>

              <Text style={styles.aiSubtitle}>
                Get guidance for your next business decision
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={19}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================================================================
   COLORS
   ================================================================ */

const COLORS = {
  background: '#F7F8F3',
  surface: '#FFFFFF',
  text: '#18352E',
  textSecondary: '#53645F',
  muted: '#7A8782',

  green: '#39845A',
  greenDark: '#236341',
  greenLight: '#E8F2E7',

  blue: '#4C91C7',
  blueLight: '#E7F1FA',

  purple: '#7566C7',
  purpleLight: '#EEEAFB',

  orange: '#D9874D',
  orangeLight: '#FAEBDD',

  gold: '#B69732',
  goldLight: '#F6F0D9',

  red: '#C45D5D',

  border: '#E6EAE4',
};

/* ================================================================
   STYLES
   ================================================================ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },

  /* --------------------------------------------------------------
     HEADER
  -------------------------------------------------------------- */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 35,
  },

  profileHeaderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#789477',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  headerTextWrap: {
    flex: 1,
    marginLeft: 14,
  },

  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  locationText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.muted,
    marginLeft: 4,
  },

  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  notificationBadge: {
    position: 'absolute',
    right: -1,
    top: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#D9534F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  /* --------------------------------------------------------------
     SCORE
  -------------------------------------------------------------- */

  scoreSection: {
    marginBottom: 34,
  },

  scoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8ECE5',
    ...shadows.soft,
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  scoreTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },

  scoreSubtitle: {
    fontSize: 11.5,
    color: COLORS.muted,
    marginTop: 5,
  },

  scoreInfo: {
    marginTop: 2,
  },

  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scoreGauge: {
    marginRight: 16,
  },

  scoreDetails: {
    flex: 1,
  },

  scoreHeadline: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.green,
  },

  scoreDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 210,
  },

  scoreBottom: {
    marginTop: 12,
  },

  trendPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
    marginLeft: 4,
  },

  updatedText: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 7,
  },

  /* --------------------------------------------------------------
     SECTION HEADINGS
  -------------------------------------------------------------- */

  quickSection: {
    marginBottom: 36,
  },

  sectionHeadingRow: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: COLORS.muted,
    marginTop: 4,
  },

  /* --------------------------------------------------------------
     QUICK ACTIONS
  -------------------------------------------------------------- */

 quickActionsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: 10,
},

  quickAction: {
  width: '49%',
  minHeight: 135,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 10,
},
  quickGreen: {
    backgroundColor: '#E7F1E4',
  },

  quickBlue: {
    backgroundColor: '#E5F0F9',
  },

  quickPurple: {
    backgroundColor: '#EDE8FA',
  },

  quickOrange: {
    backgroundColor: '#FAE9D9',
  },

  quickIcon: {
    width: 55,
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  quickIconGreen: {
    backgroundColor: '#D8EBD5',
  },

  quickIconBlue: {
    backgroundColor: '#D5E8F7',
  },

  quickIconPurple: {
    backgroundColor: '#DDD7F4',
  },

  quickIconOrange: {
    backgroundColor: '#F5DCC5',
  },

  quickTitle: {
    fontSize: 13.5,
    lineHeight: 16,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* --------------------------------------------------------------
     STATS
  -------------------------------------------------------------- */

  statsSection: {
    marginBottom: 38,
  },

  statsHeader: {
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: 'row',
  },

  statBox: {
    flex: 1,
  },

  statGap: {
    width: 13,
  },

  /* --------------------------------------------------------------
     GENERAL SECTION
  -------------------------------------------------------------- */

  section: {
    marginBottom: 38,
  },

  /* --------------------------------------------------------------
     RECOMMENDATION
  -------------------------------------------------------------- */

  recommendationCard: {
    backgroundColor: '#F1F7EE',
    borderRadius: 21,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1EBDD',
  },

  recommendationTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  recommendationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E0EEDB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  recommendationMain: {
    flex: 1,
    marginLeft: 13,
    marginRight: 7,
  },

  recommendationTitle: {
    fontSize: 15.5,
    lineHeight: 21,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 7,
  },

  recommendationDescription: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 17,
  },

  recommendationStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 17,
  },

  recommendationStat: {
    flex: 1,
    alignItems: 'center',
  },

  recommendationStatLabel: {
    fontSize: 9.5,
    color: COLORS.muted,
    fontWeight: '600',
    marginBottom: 4,
  },

  recommendationStatValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '800',
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },

  greenButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  greenButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    marginRight: 8,
  },

  /* --------------------------------------------------------------
     OPPORTUNITIES
  -------------------------------------------------------------- */

  opportunitiesScroll: {
    paddingRight: 20,
  },

  opportunityCard: {
    width: 228,
    minHeight: 175,
    backgroundColor: COLORS.surface,
    borderRadius: 19,
    padding: 17,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  opportunityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  opportunityIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  opportunityTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    color: COLORS.text,
    minHeight: 38,
  },

  opportunityMeta: {
    fontSize: 10.5,
    color: COLORS.muted,
    marginTop: 7,
    lineHeight: 16,
  },

  opportunityFooter: {
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  potentialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLight,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  potentialText: {
    fontSize: 10.5,
    color: COLORS.gold,
    fontWeight: '800',
    marginLeft: 3,
  },

  opportunityInvestment: {
    fontSize: 10.5,
    color: COLORS.text,
    fontWeight: '700',
  },

  /* --------------------------------------------------------------
     MARKET
  -------------------------------------------------------------- */

  marketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingVertical: 17,
  },

  marketRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  marketIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  marketInfo: {
    flex: 1,
    marginLeft: 12,
  },

  marketName: {
    fontSize: 13.5,
    color: COLORS.text,
    fontWeight: '700',
  },

  marketDetail: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  marketChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  marketChangeText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 3,
  },

  /* --------------------------------------------------------------
     FINANCIAL
  -------------------------------------------------------------- */

  financialCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  financialIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  financialContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  financialTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  financialSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    lineHeight: 17,
    marginTop: 4,
  },

  smallArrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* --------------------------------------------------------------
     AI
  -------------------------------------------------------------- */

  aiSection: {
    marginBottom: 35,
  },

  aiCard: {
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: COLORS.greenDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiContent: {
    flex: 1,
    marginHorizontal: 13,
  },

  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  aiSubtitle: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 4,
    lineHeight: 16,
  },
});