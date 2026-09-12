// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../constants/theme';
import { currentUser } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>Your account & preferences</Text>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser.avatarInitials}</Text>
          </View>
          <Text style={styles.name}>{currentUser.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.locationText}>
              {currentUser.location}, {currentUser.district}, {currentUser.state}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-circle-outline" size={26} color={colors.primary} />
          </View>
          <Badge label="Coming Soon" variant="accent" style={{ marginTop: spacing.md }} />
          <Text style={styles.cardTitle}>Settings & Saved Opportunities</Text>
          <Text style={styles.cardBody}>
            Manage your profile details, saved business ideas, government scheme
            eligibility, and app preferences here.
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

  profileCard: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 20 },
  name: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4, fontWeight: '500' },

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