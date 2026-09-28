// app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '../../components/ui/Card';
import { colors, radius, spacing } from '../../constants/theme';
import { currentUser } from '../../data/mockData';
import { getProfile, getUser, logout, resetOnboarding } from '../../src/services/auth';

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
const handleViewOnboarding = async () => {
  await resetOnboarding();
  router.replace("/(onboarding)");
};
const [locationAddress, setLocationAddress] = useState('');

useFocusEffect(
  useCallback(() => {
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
        setLocationAddress(profile.locationAddress || '');
      }
    };

    loadProfile();
  }, [])
);
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>
          Your account & preferences
        </Text>
      </View>

      {/* Profile */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>

        <Text style={styles.name}>{userName}</Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
          />

          <Text style={styles.locationText}>
            {locationAddress ||
              `${village}, ${district}, ${state}`}
          </Text>
        </View>
      </Card>

      {/* Edit Profile */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/edit-profile")}
      >
        <Card style={styles.actionCard}>
          <View style={styles.actionRow}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <Text style={styles.actionTitle}>
              Edit Profile
            </Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/settings')}
      >
        <Card style={styles.actionCard}>
          <View style={styles.actionRow}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <Text style={styles.actionTitle}>
              Settings
            </Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#D32F2F"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* View Onboarding */}
      <TouchableOpacity
        style={styles.settingItem}
        onPress={handleViewOnboarding}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <Ionicons
            name="play-circle-outline"
            size={23}
            color="#18794E"
          />

          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>
              View Onboarding Again
            </Text>

            <Text style={styles.settingSubtitle}>
              Explore how Udyam360 works
            </Text>
          </View>
        </View>
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

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* ---------- HEADER ---------- */

  header: {
    marginBottom: 26,
  },

  pageTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    fontWeight: '500',
  },

  /* ---------- PROFILE ---------- */

  profileCard: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 18,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 21,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 14,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 12,
  },

  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
    textAlign: 'center',
  },

  /* ---------- ACTION CARDS ---------- */

  actionCard: {
    minHeight: 82,
    justifyContent: 'center',
    marginBottom: 14,
    paddingVertical: 14,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 16,
  },

  /* ---------- LOGOUT ---------- */

  logoutButton: {
    marginTop: 10,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F0B8B8',
    backgroundColor: '#FFF7F7',
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

  /* ---------- ONBOARDING ---------- */

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 4,
    marginTop: 8,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingTextContainer: {
    marginLeft: 14,
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1F1C',
  },

  settingSubtitle: {
    fontSize: 13,
    color: '#7A827D',
    marginTop: 4,
  },
});