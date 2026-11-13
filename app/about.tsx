import { router } from "expo-router";

import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Utensils,
} from "lucide-react-native";

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
import { FontAwesome } from "@expo/vector-icons";

const developerLinks = [
  {
    title: "GitHub",
    subtitle: "Explore my projects",
    icon: <FontAwesome name="github" size={21} color={colors.primary} />,
    url: "https://github.com/shayantaghipour",
  },
  {
    title: "Instagram",
    subtitle: "Connect with me",
    icon: <FontAwesome name="instagram" size={21} color={colors.primary} />,
    url: "https://www.instagram.com/shayan.tr86?rpxt=NWt6djkxa3NwMWpi",
  },
];

export default function AboutScreen() {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // The link could not be opened.
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={21} color={colors.textPrimary} />
          </Pressable>

          <AppText variant="title">About Pisska</AppText>

          <View style={styles.headerSpacer} />
        </View>

        {/* App Introduction */}
        <View style={styles.heroCard}>
          <View style={styles.logoContainer}>
            <Utensils size={34} color={colors.primary} />
          </View>

          <AppText style={styles.appName}>Pisska</AppText>

          <AppText style={styles.tagline}>
            Food made beautiful.
          </AppText>

          <AppText style={styles.description}>
            Pisska is a modern food ordering app designed to make
            discovering and ordering your favorite meals simple,
            enjoyable, and beautiful.
          </AppText>

          <View style={styles.versionBadge}>
            <AppText style={styles.versionText}>
              Version 1.0.0
            </AppText>
          </View>
        </View>

        {/* Developer */}
        <AppText style={styles.sectionTitle}>
          MEET THE DEVELOPER
        </AppText>

        <View style={styles.developerCard}>
          <View style={styles.developerAvatar}>
            <AppText style={styles.avatarText}>ST</AppText>
          </View>

          <View style={styles.developerInfo}>
            <AppText style={styles.developerName}>
              Shayan Taghipour
            </AppText>

            <AppText style={styles.developerRole}>
              Frontend Developer
            </AppText>
          </View>
        </View>

        {/* Contact Links */}
        <AppText style={styles.sectionTitle}>
          CONNECT WITH ME
        </AppText>

        <View style={styles.linksCard}>
          {developerLinks.map((item, index) => (
            <View key={item.title}>
              <Pressable
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.pressedRow,
                ]}
                onPress={() => openLink(item.url)}
              >
                <View style={styles.linkIcon}>
                  {item.icon}
                </View>

                <View style={styles.linkInfo}>
                  <AppText style={styles.linkTitle}>
                    {item.title}
                  </AppText>

                  <AppText style={styles.linkSubtitle}>
                    {item.subtitle}
                  </AppText>
                </View>

                <ExternalLink
                  size={18}
                  color={colors.textTertiary}
                />
              </Pressable>

              {index !== developerLinks.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <AppText style={styles.footerText}>
            Designed & Developed by
          </AppText>

          <AppText style={styles.footerName}>
            Shayan Taghipour
          </AppText>

          <AppText style={styles.copyright}>
            © 2026 Pisska. All rights reserved.
          </AppText>
        </View>
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

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  appName: {
    fontFamily: typography.bold,
    fontSize: 28,
  },

  tagline: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 14,
    marginTop: 4,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    marginTop: spacing.lg,
  },

  versionBadge: {
    backgroundColor: "#FCE8DC",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: spacing.lg,
  },

  versionText: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 11,
  },

  sectionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },

  developerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  developerAvatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: colors.primary,
    fontFamily: typography.bold,
    fontSize: 19,
  },

  developerInfo: {
    marginLeft: spacing.md,
  },

  developerName: {
    fontFamily: typography.semiBold,
    fontSize: 16,
  },

  developerRole: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  linksCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },

  linkRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  pressedRow: {
    opacity: 0.65,
  },

  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  linkInfo: {
    flex: 1,
  },

  linkTitle: {
    fontFamily: typography.semiBold,
    fontSize: 14,
  },

  linkSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 54,
  },

  footer: {
    alignItems: "center",
    marginTop: spacing.md,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  footerName: {
    color: colors.primary,
    fontFamily: typography.bold,
    fontSize: 15,
    marginTop: 5,
  },

  copyright: {
    color: colors.textTertiary,
    fontSize: 10,
    marginTop: spacing.md,
  },
});

