// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';import { Alert, TouchableOpacity } from 'react-native';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../constants/theme';
import { currentUser } from '../../data/mockData';
import Card from '../../components/ui/Card';
import { logout, clearProfileForTesting } from '../../src/services/auth';
import { getUser, getProfile } from '../../src/services/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState(currentUser.name);
const [email, setEmail] = useState('');
const [village, setVillage] = useState(currentUser.location);
const [district, setDistrict] = useState(currentUser.district);
const [state, setState] = useState(currentUser.state);
const [avatarInitials, setAvatarInitials] = useState(
  currentUser.avatarInitials
);

useEffect(() => {
  const loadProfile = async () => {
    const user = await getUser();
    const profile = await getProfile();

    if (user) {
  setUserName(user.name);
  setEmail(user.email);

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
      setState(profile.state);
    }
  };

  loadProfile();
}, []);
    const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
  }
};
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
            <Text style={styles.avatarText}>{avatarInitials}</Text>          </View>
          <Text style={styles.name}>{userName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.locationText}>
              {village}, {district}, {state}
            </Text>
          </View>
        </Card>

        <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => router.push('/settings')}
>
  <Card style={styles.card}>
    <View style={styles.iconWrap}>
      <Ionicons
        name="settings-outline"
        size={26}
        color={colors.primary}
      />
    </View>

    <Text style={styles.cardTitle}>
      Settings
    </Text>

    <Text style={styles.cardBody}>
      Manage your language, notifications, privacy, and other app preferences.
    </Text>

    <View style={styles.settingsArrow}>
      <Text style={styles.settingsArrowText}>
        Open Settings
      </Text>

      <Ionicons
        name="arrow-forward"
        size={18}
        color={colors.primary}
      />
    </View>
  </Card>
</TouchableOpacity>
                <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#D32F2F"
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  settingsArrow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: spacing.md,
  gap: 6,
},

settingsArrowText: {
  fontSize: 13,
  fontWeight: '700',
  color: colors.primary,
},
    logoutButton: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F0B8B8',
    backgroundColor: '#FFF5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D32F2F',
  },
});