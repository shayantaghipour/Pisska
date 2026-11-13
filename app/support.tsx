import { router } from "expo-router";

import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  Mail,
  MessageCircle,
} from "lucide-react-native";

import { FontAwesome } from "@expo/vector-icons";

import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../components/ui/AppText";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

const supportOptions = [
  {
    title: "Email Support",
    subtitle: "Send us an email",
    icon: <Mail size={21} color={colors.primary} />,
    url: "mailto:shayan.taghipour86@gmail.com?subject=Pisska%20Support",
  },
];

export default function SupportScreen() {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Could not open the requested link.
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={21} color={colors.textPrimary} />
          </Pressable>

          <AppText variant="title">Help & Support</AppText>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <CircleHelp size={34} color={colors.primary} />
          </View>

          <AppText style={styles.heroTitle}>
            How can we help?
          </AppText>

          <AppText style={styles.heroDescription}>
            Have a question or found a problem? Feel free to
            contact us through one of the options below.
          </AppText>
        </View>

        <AppText style={styles.sectionTitle}>
          CONTACT SUPPORT
        </AppText>

        <View style={styles.optionsCard}>
          {supportOptions.map((item, index) => (
            <View key={item.title}>
              <Pressable
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && styles.pressedRow,
                ]}
                onPress={() => openLink(item.url)}
              >
                <View style={styles.optionIcon}>
                  {item.icon}
                </View>

                <View style={styles.optionInfo}>
                  <AppText style={styles.optionTitle}>
                    {item.title}
                  </AppText>

                  <AppText style={styles.optionSubtitle}>
                    {item.subtitle}
                  </AppText>
                </View>

                <ChevronRight
                  size={19}
                  color={colors.textTertiary}
                />
              </Pressable>

              {index !== supportOptions.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <MessageCircle size={20} color={colors.primary} />

          <View style={styles.noteInfo}>
            <AppText style={styles.noteTitle}>
              We're here to help
            </AppText>

            <AppText style={styles.noteDescription}>
              Your feedback helps make Pisska better.
              Thank you for being part of this journey!
            </AppText>
          </View>
        </View>

        <AppText style={styles.footer}>
          Pisska · Version 1.0.0
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerSpacer: {
    width: 44,
  },

  heroCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },

  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  heroTitle: {
    fontFamily: typography.bold,
    fontSize: 21,
  },

  heroDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    marginTop: spacing.md,
  },

  sectionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },

  optionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },

  optionRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  pressedRow: {
    opacity: 0.65,
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  optionInfo: {
    flex: 1,
  },

  optionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 14,
  },

  optionSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 54,
  },

  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "#FCE8DC",
    borderRadius: 18,
    padding: spacing.lg,
  },

  noteInfo: {
    flex: 1,
  },

  noteTitle: {
    fontFamily: typography.semiBold,
    fontSize: 14,
    color: colors.primary,
  },

  noteDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 5,
  },

  footer: {
    textAlign: "center",
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: spacing.xl,
  },
});

