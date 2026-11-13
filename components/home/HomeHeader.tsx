import { Pressable, StyleSheet, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useRouter } from "expo-router";

import AppText from "../ui/AppText";
import { spacing } from "../../constants/spacing";
import { colors } from "../../constants/colors";
import { useCartStore } from "../../store/cartStore";

export default function HomeHeader() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <AppText variant="caption">Good afternoon 👋</AppText>
        </View>

        <Pressable
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
          accessibilityLabel="Open shopping cart"
        >
          <ShoppingCart size={23} color={colors.textPrimary} />

          {cartCount > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </AppText>
            </View>
          )}
        </Pressable>
      </View>

      <AppText variant="heading" style={styles.title}>
        What are you craving today?
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    flex: 1,
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    marginTop: spacing.xs,
  },
});

