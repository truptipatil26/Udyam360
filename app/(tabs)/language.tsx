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
import {
  useLanguage,
} from '../../src/services/i18n/LanguageContext';
import { Language } from '../../src/services/i18n/translations';

export default function LanguageScreen() {
  const router = useRouter();

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const languages: {
    code: Language;
    name: string;
    nativeName: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
    },
  ];

  const handleLanguageChange = async (selectedLanguage: Language) => {
    await setLanguage(selectedLanguage);
  };

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
            <Text style={styles.title}>
              {t.language}
            </Text>

            <Text style={styles.subtitle}>
              {t.chooseLanguage}
            </Text>
          </View>
        </View>

        {/* Language options */}
        {languages.map((item) => {
          const selected = language === item.code;

          return (
            <TouchableOpacity
              key={item.code}
              activeOpacity={0.8}
              onPress={() => handleLanguageChange(item.code)}
            >
              <Card
                style={[
                  styles.languageCard,
                  selected && styles.selectedCard,
                ]}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.nativeName}>
                    {item.nativeName}
                  </Text>

                  <Text style={styles.englishName}>
                    {item.name}
                  </Text>
                </View>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={25}
                    color={colors.primary}
                  />
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

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

  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  languageInfo: {
    flex: 1,
  },

  nativeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  englishName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
});