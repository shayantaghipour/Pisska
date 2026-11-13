import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ClipboardList,
  PackageCheck,
  RotateCcw,
  XCircle,
} from "lucide-react-native";

import AppText from "../../components/ui/AppText";
import AppButton from "../../components/ui/AppButton";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";
import {
  getOrders,
  cancelOrder,
  type OrderResponse,
} from "../../services/orderService";
import { useCartStore } from "../../store/cartStore";
import { foodData } from "../../data/foodData";

type OrderStatus = "Confirmed" | "Preparing" | "Delivered" | "Cancelled";

const normalizeStatus = (status: string): OrderStatus => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "preparing":
      return "Preparing";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Confirmed";
  }
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString();
};

export default function OrdersScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [refreshingOrders, setRefreshingOrders] = useState(false);  

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Could not load your orders. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelOrder = (orderId: number) => {
  Alert.alert(
    "Cancel Order",
    "Are you sure you want to cancel this order?",
    [
      {
        text: "Keep Order",
        style: "cancel",
      },
      {
        text: "Cancel Order",
        style: "destructive",
        onPress: async () => {
          try {
            setCancellingOrderId(orderId);

            const updatedOrder = await cancelOrder(orderId);

            setOrders((currentOrders) =>
              currentOrders.map((order) =>
                order.id === orderId ? updatedOrder : order
              )
            );

            Alert.alert(
              "Order Cancelled",
              "Your order has been successfully cancelled."
            );
          } catch (err) {
            console.error("Failed to cancel order:", err);

            Alert.alert(
              "Cancellation Failed",
              "Could not cancel this order. Please try again."
            );
          } finally {
            setCancellingOrderId(null);
          }
        },
      },
    ]
  );
};

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useFocusEffect(
    useCallback(() => {
      void fetchOrders();
    }, [fetchOrders])
  );

  const handleReorder = (order: OrderResponse) => {
    if (!order.items.length) {
      Alert.alert("No Items", "This order doesn't contain any items.");
      return;
    }

    order.items.forEach((item) => {
      const localFood = foodData.find(
        (food) => String(food.id) === String(item.food)
      );

      addToCart(
        {
          id: String(item.food),
          name: item.food_name,
          price: Number(item.price),
          ...(localFood?.image ? { image: localFood.image } : {}),
        },
        item.quantity
      );
    });

    Alert.alert(
      "Items Added",
      "The items from this order have been added to your cart."
    );
  };

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText style={styles.stateText}>Loading orders...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.emptyIcon}>
          <ClipboardList size={38} color={colors.primary} />
        </View>

        <AppText variant="title" style={styles.emptyTitle}>
          Unable to Load Orders
        </AppText>

        <AppText style={styles.emptyDescription}>{error}</AppText>

        <AppButton
          title="Try Again"
          onPress={() => void fetchOrders()}
          style={styles.exploreButton}
        />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.emptyIcon}>
          <ClipboardList size={38} color={colors.primary} />
        </View>

        <AppText variant="heading" style={styles.emptyTitle}>
          No orders yet
        </AppText>

        <AppText style={styles.emptyDescription}>
          Your orders will appear here once you place your first order.
        </AppText>

        <AppButton
          title="Explore Foods"
          onPress={() => router.replace("/(tabs)")}
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
          <AppText variant="heading">My Orders</AppText>

          <AppText style={styles.orderCount}>
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </AppText>
        </View>

        {orders.map((order) => {
          const status = normalizeStatus(order.status);

          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderIcon}>
                  <PackageCheck size={22} color={colors.primary} />
                </View>

                <View style={styles.orderInfo}>
                  <AppText variant="title">
                    Order #{String(order.id).slice(-6)}
                  </AppText>

                  <AppText style={styles.orderDate}>
                    {formatDate(order.created_at)}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    status === "Cancelled" && styles.cancelledBadge,
                    status === "Delivered" && styles.deliveredBadge,
                    status === "Preparing" && styles.preparingBadge,
                  ]}
                >
                  <AppText
                    style={[
                      styles.statusText,
                      status === "Cancelled" && styles.cancelledStatusText,
                    ]}
                  >
                    {status}
                  </AppText>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.foodList}>
                {order.items.map((item, index) => {
                  const localFood = foodData.find(
                    (food) => String(food.id) === String(item.food)
                  );

                  const price = Number(item.price);
                  const lineTotal = price * item.quantity;

                  return (
                    <View
                      key={`${order.id}-${item.id}-${index}`}
                      style={styles.foodRow}
                    >
                      {localFood?.image ? (
                        <Image
                          source={localFood.image}
                          style={styles.foodImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <ClipboardList
                            size={20}
                            color={colors.textTertiary}
                          />
                        </View>
                      )}

                      <View style={styles.foodInfo}>
                        <AppText variant="title" numberOfLines={2}>
                          {item.food_name}
                        </AppText>

                        <AppText style={styles.quantityText}>
                          Qty: {item.quantity}
                        </AppText>
                      </View>

                      <AppText style={styles.foodPrice}>
                        ${lineTotal.toFixed(2)}
                      </AppText>
                    </View>
                  );
                })}
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <AppText style={styles.totalLabel}>Total Amount</AppText>

                <AppText style={styles.totalPrice}>
                  ${Number(order.total).toFixed(2)}
                </AppText>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.reorderButton}
                  onPress={() => handleReorder(order)}
                >
                  <RotateCcw size={17} color={colors.primary} />

                  <AppText style={styles.reorderButtonText}>
                    Reorder
                  </AppText>
                </Pressable>

                {status === "Confirmed" && (
                  <Pressable
                    style={[
                      styles.cancelButton,
                      cancellingOrderId === order.id && styles.disabledButton,
                    ]}
                    onPress={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId !== null}
                  >
                    {cancellingOrderId === order.id ? (
                      <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                      <XCircle size={17} color="#DC2626" />
                    )}

                    <AppText style={styles.cancelButtonText}>
                      {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                    </AppText>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
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

  orderCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  orderIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#FCE8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  orderInfo: {
    flex: 1,
  },

  orderDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: "#E7F4EC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  statusText: {
    color: colors.success,
    fontSize: 10,
    fontFamily: typography.semiBold,
  },

  cancelledBadge: {
    backgroundColor: "#FEECEC",
  },

  cancelledStatusText: {
    color: "#DC2626",
  },

  deliveredBadge: {
    backgroundColor: "#E7F4EC",
  },

  preparingBadge: {
    backgroundColor: "#FFF3D6",
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },

  foodList: {
    gap: spacing.md,
  },

  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  foodImage: {
    width: 58,
    height: 58,
    borderRadius: 13,
  },

  imagePlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  foodInfo: {
    flex: 1,
  },

  quantityText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  foodPrice: {
    fontFamily: typography.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  totalPrice: {
    fontFamily: typography.bold,
    fontSize: 21,
    color: colors.primary,
  },

  stateContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  stateText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
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

  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  reorderButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: 13,
    backgroundColor: "#FCE8DC",
  },

  reorderButtonText: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },

  cancelButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: 13,
    backgroundColor: "#FEECEC",
  },

  disabledButton: {
    opacity: 0.55,
  },

  cancelButtonText: {
    color: "#DC2626",
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
});

