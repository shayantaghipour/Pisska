import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

interface AppInputProps extends TextInputProps {
  error?: boolean;
}

export default function AppInput({
  error = false,
  style,
  ...props
}: AppInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textTertiary}
      style={[
        styles.input,
        error && styles.error,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 54,
    width: "100%",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,

    paddingHorizontal: spacing.lg,

    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },

  error: {
    borderColor: colors.error,
  },
});