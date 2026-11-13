import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import AppButton from "../../components/ui/AppButton";
import AppText from "../../components/ui/AppText";

import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "expo-router";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(email.trim(), password);

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);

      setError(
        err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="restaurant" size={30} color={colors.white} />
          </View>

          <AppText variant="heading">Welcome Back</AppText>

          <AppText variant="caption">
            Sign in to continue your food journey.
          </AppText>
        </View>

        <View style={styles.form}>
          <AppText variant="body">Email Address</AppText>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AppText variant="body">Password</AppText>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {error ? (
            <AppText variant="caption" style={{ color: colors.error }}>
              {error}
            </AppText>
          ) : null}

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={!email.trim() || !password}
            style={styles.button}
          />
          <View style={styles.footer}>
            <AppText variant="body" style={styles.footerText}>
              Don't have an account?
            </AppText>

            <Link href="/(auth)/register" asChild>
              <Pressable>
                <AppText variant="button" style={styles.loginLink}>
                  Create Account
                </AppText>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },

  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  form: {
    gap: spacing.md,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },

  passwordContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },

  passwordInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },

  button: {
    marginTop: spacing.lg,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  footerText: {
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.primary,
  },
});
