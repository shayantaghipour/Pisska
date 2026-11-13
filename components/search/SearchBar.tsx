import { StyleSheet, View } from "react-native";
import { Search } from "lucide-react-native";

import AppInput from "../ui/AppInput";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search
        size={20}
        color={colors.textSecondary}
        strokeWidth={2}
      />

      <AppInput
        placeholder="Search restaurants or food..."
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
  },

  input: {
    flex: 1,
    height: 54,
    borderWidth: 0,
    paddingHorizontal: spacing.md,
  },
});