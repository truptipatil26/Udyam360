// app/(tabs)/opportunities.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function OpportunitiesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Opportunities</Text>
        <Text style={styles.pageSubtitle}>AI Opportunity Gap Detector</Text>

        <Card style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="compass-outline" size={26} color={colors.primary} />
          </View>
          <Badge label="Coming Soon" variant="accent" style={{ marginTop: spacing.md }} />
          <Text style={styles.cardTitle}>Full Gap Detector Coming Here</Text>
          <Text style={styles.cardBody}>
            This screen will show a ranked, filterable list of every business opportunity
            gap detected in your area — by category, investment range, and demand
            confidence — powered by local market signals.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  pageTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  pageSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xl, fontWeight: '500' },
  card: { alignItems: 'flex-start' },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  cardBody: { fontSize: 13.5, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.sm },
});