import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors, radius, spacing } from '../../constants/theme';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../src/services/i18n/LanguageContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>{t.settings}</Text>
            <Text style={styles.subtitle}>
              Manage your Udyam360 preferences
            </Text>
          </View>
        </View>

        {/* Language */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/language')}
        >
          <Card style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="language-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                {t.language}
              </Text>

              <Text style={styles.optionSubtitle}>
                {t.chooseLanguage}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color={colors.textTertiary}
            />
          </Card>
        </TouchableOpacity>

        {/* Notifications */}
        <Card style={styles.optionCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              {t.notifications}
            </Text>

            <Text style={styles.optionSubtitle}>
              Manage app notifications
            </Text>
          </View>
        </Card>

        {/* Privacy */}
        <Card style={styles.optionCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              {t.privacy}
            </Text>

            <Text style={styles.optionSubtitle}>
              Manage privacy preferences
            </Text>
          </View>
        </Card>

        {/* About */}
        <Card style={styles.optionCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              {t.about}
            </Text>

            <Text style={styles.optionSubtitle}>
              Learn more about Udyam360
            </Text>
          </View>
        </Card>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    flex: 1,
    marginLeft: spacing.md,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  optionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});