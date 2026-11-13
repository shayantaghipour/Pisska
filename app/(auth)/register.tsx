import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppText from "../../components/ui/AppText";

import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        password,
      });
    } catch (err: any) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", JSON.stringify(err.response?.data, null, 2));
      console.log("MESSAGE:", err.message);

      const data = err.response?.data;

      if (data?.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    options?: {
      keyboardType?: "default" | "email-address" | "phone-pad";
      secureTextEntry?: boolean;
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
    },
  ) => (
    <View style={styles.inputGroup}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={options?.keyboardType ?? "default"}
        secureTextEntry={options?.secureTextEntry}
        autoCapitalize={options?.autoCapitalize ?? "sentences"}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="restaurant" size={30} color={colors.white} />
          </View>

          <AppText variant="heading" style={styles.title}>
            Create Account
          </AppText>

          <AppText variant="body" style={styles.subtitle}>
            Join Pisska and discover something delicious.
          </AppText>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              {renderInput("First Name", firstName, setFirstName, "John")}
            </View>

            <View style={styles.nameInput}>
              {renderInput("Last Name", lastName, setLastName, "Doe")}
            </View>
          </View>

          {renderInput("Email Address", email, setEmail, "you@example.com", {
            keyboardType: "email-address",
            autoCapitalize: "none",
          })}

          {renderInput(
            "Phone Number (Optional)",
            phoneNumber,
            setPhoneNumber,
            "+49 123 456789",
            { keyboardType: "phone-pad" },
          )}

          <View style={styles.inputGroup}>
            <AppText variant="caption" style={styles.label}>
              Password
            </AppText>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="caption" style={styles.label}>
              Confirm Password
            </AppText>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter your password again"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={10}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {error ? (
            <AppText variant="caption" style={styles.error}>
              {error}
            </AppText>
          ) : null}

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <AppText variant="body" style={styles.footerText}>
              Already have an account?
            </AppText>

            <Link href="/(auth)/login" asChild>
              <Pressable>
                <AppText variant="button" style={styles.loginLink}>
                  Sign In
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: spacing.lg,
  },
  nameRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  passwordContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  error: {
    color: colors.error,
  },
  button: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
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
