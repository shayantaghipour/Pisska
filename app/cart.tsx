import {
Image,
Pressable,
ScrollView,
StyleSheet,
View,
} from "react-native";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react-native";

import AppText from "../components/ui/AppText";
import AppButton from "../components/ui/AppButton";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";
import { useCartStore } from "../store/cartStore";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useOrderStore } from "../store/orderStore";
import { useState } from "react";
import { createOrder } from "../services/orderService";

export default function CartScreen() {
const router = useRouter();
const [isSubmitting, setIsSubmitting] = useState(false);

const items = useCartStore((state) => state.items);
const removeFromCart = useCartStore((state) => state.removeFromCart);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const placeOrder = useOrderStore((state) => state.placeOrder);
const clearCart = useCartStore((state) => state.clearCart);

const totalPrice = items.reduce(
(total, item) => total + item.price * item.quantity,
0
);

const totalItems = items.reduce(
  (total, item) => total + item.quantity,
  0
);

if (items.length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <ShoppingBag size={38} color={colors.primary} />
      </View>

      <AppText variant="heading" style={styles.emptyTitle}>
        Your cart is empty
      </AppText>

      <AppText style={styles.emptyDescription}>
        Looks like you haven't added anything to your cart yet.
      </AppText>

      <AppButton
        title="Explore Foods"
        onPress={() => router.push("/(tabs)")}
        style={styles.exploreButton}
      />
    </View>
  );
}

return (
  <View style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <AppText variant="heading">My Cart</AppText>

        <AppText style={styles.itemCount}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </AppText>
      </View>


    <View style={styles.itemsContainer}>
      {items.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.foodImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ShoppingBag size={24} color={colors.textTertiary} />
            </View>
          )}

          <View style={styles.itemDetails}>
            <AppText variant="title" numberOfLines={2}>
              {item.name}
            </AppText>

            <AppText style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </AppText>

            <View style={styles.itemBottomRow}>
              <View style={styles.quantityControl}>
                <Pressable
                  accessibilityLabel={`Decrease quantity of ${item.name}`}
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  <Minus size={15} color={colors.textPrimary} />
                </Pressable>

                <AppText style={styles.quantity}>
                  {item.quantity}
                </AppText>

                <Pressable
                  accessibilityLabel={`Increase quantity of ${item.name}`}
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Plus size={15} color={colors.textPrimary} />
                </Pressable>
              </View>

              <Pressable
                accessibilityLabel={`Remove ${item.name} from cart`}
                onPress={() => removeFromCart(item.id)}
                style={styles.removeButton}
              >
                <Trash2 size={18} color={colors.error} />
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.summary}>
      <AppText variant="title">Order Summary</AppText>

      <View style={styles.summaryRow}>
        <AppText style={styles.summaryLabel}>Subtotal</AppText>
        <AppText style={styles.summaryValue}>
          ${totalPrice.toFixed(2)}
        </AppText>
      </View>

      <View style={styles.summaryRow}>
        <AppText style={styles.summaryLabel}>Delivery Fee</AppText>
        <AppText style={styles.summaryValue}>Free</AppText>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <AppText variant="title">Total</AppText>
        <AppText style={styles.totalPrice}>
          ${totalPrice.toFixed(2)}
        </AppText>
      </View>

      <AppButton
        title={isSubmitting ? "Placing Order..." : "Place Order"}
        disabled={isSubmitting}
        onPress={async () => {
          if (items.length === 0) {
            Alert.alert("Empty Cart", "Please add some food first.");
            return;
          }

          if (isSubmitting) {
            return;
          }

          try {
            setIsSubmitting(true);

            const order = await createOrder(
              items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
              }))
            );
            
            console.log("✅ PISSKA ORDER SUCCESS");
            console.log("Order ID:", order.id);
            console.log("Items:", items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              subtotal: item.price * item.quantity,
            })));
            console.log("Total:", totalPrice.toFixed(2));
            console.log("================================");
          


            // ثبت سفارش در Zustand برای نمایش در صفحه Orders
            placeOrder(items);

            // فقط بعد از موفقیت API، سبد خرید پاک می‌شود
            clearCart();

            Alert.alert(
              "Order Confirmed!",
              `Your order #${order.id} has been placed successfully.`,
              [
                {
                  text: "View Orders",
                  onPress: () => router.push("/(tabs)/orders"),
                },
              ]
            );
          } catch (error) {
            console.error("Failed to place order:", error);

            Alert.alert(
              "Order Failed",
              "We couldn't place your order. Please check your connection and try again."
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
        style={styles.checkoutButton}
        />
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
paddingBottom: 120,
},

header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: spacing.xl,
},

itemCount: {
color: colors.textSecondary,
fontSize: 13,
},

itemsContainer: {
gap: spacing.md,
},

cartItem: {
flexDirection: "row",
alignItems: "center",
backgroundColor: colors.surface,
borderRadius: 20,
padding: spacing.md,
borderWidth: 1,
borderColor: colors.border,
gap: spacing.md,
},

foodImage: {
width: 100,
height: 110,
borderRadius: 15,
},

imagePlaceholder: {
width: 100,
height: 110,
borderRadius: 15,
backgroundColor: colors.background,
alignItems: "center",
justifyContent: "center",
},

itemDetails: {
flex: 1,
justifyContent: "space-between",
minHeight: 100,
paddingVertical: 2,
},

itemPrice: {
fontFamily: typography.bold,
color: colors.primary,
fontSize: 16,
marginTop: spacing.xs,
},

itemBottomRow: {
flexDirection: "row",
alignItems: "center",
justifyContent: "space-between",
marginTop: spacing.sm,
},

quantityControl: {
flexDirection: "row",
alignItems: "center",
gap: spacing.md,
},

quantityButton: {
width: 30,
height: 30,
borderRadius: 10,
backgroundColor: colors.background,
alignItems: "center",
justifyContent: "center",
},

quantity: {
fontFamily: typography.semiBold,
fontSize: 14,
color: colors.textPrimary,
},

removeButton: {
width: 34,
height: 34,
borderRadius: 11,
backgroundColor: "#FDEBE9",
alignItems: "center",
justifyContent: "center",
},

summary: {
backgroundColor: colors.surface,
borderRadius: 22,
padding: spacing.lg,
marginTop: spacing.xl,
borderWidth: 1,
borderColor: colors.border,
},

summaryRow: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginTop: spacing.md,
},

summaryLabel: {
color: colors.textSecondary,
fontSize: 14,
},

summaryValue: {
color: colors.textPrimary,
fontFamily: typography.medium,
fontSize: 14,
},

summaryDivider: {
height: 1,
backgroundColor: colors.divider,
marginTop: spacing.lg,
},

totalPrice: {
fontFamily: typography.bold,
fontSize: 21,
color: colors.primary,
},

checkoutButton: {
marginTop: spacing.xl,
},

emptyContainer: {
flex: 1,
backgroundColor: colors.background,
alignItems: "center",
justifyContent: "center",
padding: spacing.xl,
},

emptyIcon: {
width: 88,
height: 88,
borderRadius: 28,
backgroundColor: "#FCE8DC",
alignItems: "center",
justifyContent: "center",
marginBottom: spacing.xl,
},

emptyTitle: {
textAlign: "center",
color: colors.textPrimary,
},

emptyDescription: {
textAlign: "center",
color: colors.textSecondary,
lineHeight: 22,
marginTop: spacing.sm,
},

exploreButton: {
marginTop: spacing.xl,
minWidth: 180,
},
});
