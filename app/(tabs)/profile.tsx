import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Info,
  LockKeyhole,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
  UserRoundPen,
} from "lucide-react-native";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../../components/ui/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";
import { useAuth } from "@/contexts/AuthContext";

type ProfileRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

function ProfileRow({
  icon,
  title,
  subtitle,
  onPress,
}: ProfileRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        pressed && styles.pressedRow,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>{icon}</View>

      <View style={styles.menuInfo}>
        <AppText style={styles.menuTitle}>{title}</AppText>
        {subtitle && (
          <AppText style={styles.menuSubtitle}>{subtitle}</AppText>
        )}
      </View>

      <ChevronRight size={19} color={colors.textTertiary} />
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <AppText style={styles.sectionTitle}>{title}</AppText>;
}

export default function ProfileScreen() {

  const handleComingSoon = (feature: string) => {
    Alert.alert(feature, "This feature will be available soon.");
  };

const { logout } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  try {
    await logout();
    router.replace("/(auth)/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <AppText variant="heading">My Profile</AppText>
          <Pressable
            style={styles.settingsButton}
            onPress={() => handleComingSoon("Settings")}
          >
            <Settings size={21} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <UserRound size={36} color={colors.primary} />
          </View>

          <View style={styles.profileInfo}>
            <AppText style={styles.userName}>Guest User</AppText>
            <AppText style={styles.userEmail}>
              Sign in to manage your account
            </AppText>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() => handleComingSoon("Edit Profile")}
          >
            <UserRoundPen size={17} color={colors.primary} />
          </Pressable>
        </View>

        {/* Account */}
        <SectionTitle title="ACCOUNT" />

        <View style={styles.menuCard}>
          <ProfileRow
            icon={<UserRound size={20} color={colors.primary} />}
            title="Personal Information"
            subtitle="Manage your personal details"
            onPress={() => handleComingSoon("Personal Information")}
          />

          <View style={styles.rowDivider} />

          <ProfileRow
            icon={<LockKeyhole size={20} color={colors.primary} />}
            title="Password & Security"
            subtitle="Manage your account security"
            onPress={() => handleComingSoon("Password & Security")}
          />
        </View>

        {/* Activity */}
        <SectionTitle title="MY ACTIVITY" />

        <View style={styles.menuCard}>
          <ProfileRow
            icon={<Package size={20} color={colors.primary} />}
            title="My Orders"
            subtitle="View your order history"
            onPress={() => router.push("/(tabs)/orders")}
          />

          <View style={styles.rowDivider} />

          <ProfileRow
            icon={<MapPin size={20} color={colors.primary} />}
            title="My Addresses"
            subtitle="Manage your delivery addresses"
            onPress={() => handleComingSoon("My Addresses")}
          />
        </View>

        {/* Preferences */}
        <SectionTitle title="PREFERENCES" />

        <View style={styles.menuCard}>
          <ProfileRow
            icon={<Bell size={20} color={colors.primary} />}
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => handleComingSoon("Notifications")}
          />

          <View style={styles.rowDivider} />

          <ProfileRow
            icon={<Info size={20} color={colors.primary} />}
            title="About Pisska"
            subtitle="App information and developer"
            onPress={() => router.push("/about")}
          />

          <View style={styles.rowDivider} />

          <ProfileRow
            icon={<CircleHelp size={20} color={colors.primary} />}
            title="Help & Support"
            subtitle="Get in touch with us"
            onPress={() => router.push("/support")}
          />
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={19} color="#DC2626" />
          <AppText style={styles.logoutText}>Log Out</AppText>
        </Pressable>

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
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  userName: {
    fontFamily: typography.bold,
    fontSize: 18,
  },

  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },

  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },

  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  pressedRow: {
    opacity: 0.65,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  menuInfo: {
    flex: 1,
  },

  menuTitle: {
    fontFamily: typography.semiBold,
    fontSize: 14,
  },

  menuSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  rowDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 54,
  },

  logoutButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "#FEECEC",
    borderRadius: 16,
    marginTop: spacing.xs,
  },

  logoutText: {
    color: "#DC2626",
    fontFamily: typography.semiBold,
    fontSize: 14,
  },

  footer: {
    textAlign: "center",
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: spacing.xl,
  },
});

