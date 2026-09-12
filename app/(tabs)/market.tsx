// app/(tabs)/market.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function MarketScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Market</Text>
        <Text style={styles.pageSubtitle}>Local commodity & demand trends</Text>

        <Card style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="bar-chart-outline" size={26} color={colors.info} />
          </View>
          <Badge label="Coming Soon" variant="accent" style={{ marginTop: spacing.md }} />
          <Text style={styles.cardTitle}>Full Market Pulse Dashboard</Text>
          <Text style={styles.cardBody}>
            Detailed price trends, demand heatmaps, and seasonal forecasts for
            crops, dairy, and local goods around your district.
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
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  cardBody: { fontSize: 13.5, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.sm },
});