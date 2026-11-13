import { Text, TextProps, StyleSheet } from "react-native";

import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";

type TextVariant =
  | "heading"
  | "title"
  | "body"
  | "caption"
  | "button";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export default function AppText({
  variant = "body",
  style,
  ...props
}: AppTextProps) {
  return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },

  heading: {
    fontFamily: typography.bold,
    fontSize: 32,
    lineHeight: 40,
  },

  title: {
    fontFamily: typography.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },

  body: {
    fontFamily: typography.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  caption: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  button: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
});