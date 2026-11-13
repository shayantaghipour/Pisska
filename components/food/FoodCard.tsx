import { Image, Pressable, StyleSheet, View } from "react-native";
import { Plus } from "lucide-react-native";

import AppText from "../ui/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

interface FoodCardProps {
  name: string;
  description: string;
  price: number;
  image?: any;
  onPress?: () => void;
}

export default function FoodCard({
  name,
  description,
  price,
  image,
  onPress,
}: FoodCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {/* Food Image */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={image}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <AppText variant="caption">
              Image coming soon
            </AppText>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppText variant="title" style={styles.name}>
          {name}
        </AppText>

        <AppText
          variant="caption"
          numberOfLines={2}
          style={styles.description}
        >
          {description}
        </AppText>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <AppText style={styles.price}>
            ${price.toFixed(2)}
          </AppText>

          <View style={styles.addButton}>
            <Plus
              size={20}
              color={colors.white}
              strokeWidth={2.5}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: colors.divider,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },

  content: {
    padding: spacing.md,
  },

  name: {
    fontSize: 17,
    lineHeight: 23,
  },

  description: {
    marginTop: spacing.xs,
    minHeight: 36,
  },

  bottomRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontFamily: typography.bold,
    fontSize: 17,
    color: colors.primary,
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});