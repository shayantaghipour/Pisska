import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import AppText from "../../components/ui/AppText";
import AppButton from "../../components/ui/AppButton";
import { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";
import { getFoods, type Food } from "../../services/foodService";
import { foodData } from "../../data/foodData";
import { useCartStore } from "../../store/cartStore";
import { useAudioPlayer } from "expo-audio";



export default function FoodDetailsScreen() {
  const dingPlayer = useAudioPlayer(
    require("../../assets/sounds/ding.mp3")
  );
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [food, setFood] = useState<Food | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [successVisible, setSuccessVisible] = useState(false);


useEffect(() => {
  if (!successVisible) return;

  dingPlayer.seekTo(0);
  dingPlayer.play();
}, [successVisible, dingPlayer]);


useEffect(() => {
  const fetchFood = async () => {
    try {
      setLoading(true);
      setError(null);

      const foods = await getFoods();

      const selectedFood = foods.find(
        (item) => String(item.id) === String(id)
      );

      if (!selectedFood) {
        setFood(null);
        return;
      }

      setFood(selectedFood);
    } catch (err) {
      console.error("Failed to fetch food details:", err);
      setError("Could not load food details.");
    } finally {
      setLoading(false);
    }
  };

  fetchFood();
}, [id]);
  

  if (loading) {
    return (
      <View style={styles.notFound}>
        <AppText variant="title">Loading food...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.notFound}>
        <AppText variant="title">{error}</AppText>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.notFound}>
        <AppText variant="title">Food not found</AppText>
      </View>
    );
  }

  const localFood = foodData.find(
    (item) => item.name === food.name
  );
  

  const totalPrice = Number(food.price) * quantity;



  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

    <Modal
      visible={successVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setSuccessVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>

          <AppText variant="heading" style={styles.modalTitle}>
            Added to Cart!
          </AppText>

          <AppText style={styles.modalDescription}>
            {quantity} × {food.name} added to your cart successfully.
          </AppText>

          <View style={styles.modalButtons}>
            <Pressable
              style={styles.continueButton}
              onPress={() => setSuccessVisible(false)}
            >
              <Text style={styles.continueButtonText}>
                Continue Shopping
              </Text>
            </Pressable>

            <Pressable
              style={styles.viewCartButton}
              onPress={() => {
                setSuccessVisible(false);
                router.push("/cart");
              }}
            >
              <Text style={styles.viewCartButtonText}>
                View Cart
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>


      {/* Food Image */}
      <View style={styles.imageContainer}>
        {localFood?.image ? (
          <Image
            source={localFood?.image}
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

        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppText variant="heading">
          {food.name}
        </AppText>

        <AppText
          variant="body"
          style={styles.description}
        >
          {food.description}
        </AppText>

        <AppText style={styles.price}>
          ${Number(food.price).toFixed(2)}
        </AppText>

        <AppText style={styles.totalPrice}>
          Total: ${totalPrice.toFixed(2)}
        </AppText>

        <View style={styles.divider} />

        {/* Quantity - UI only for now */}
        <View style={styles.quantityRow}>
          <AppText variant="title">
            Quantity
          </AppText>

          <View style={styles.quantityControl}>
            <Pressable
              style={styles.quantityButton}
              onPress={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
            >
              <AppText style={styles.quantityButtonText}>
                −
              </AppText>
            </Pressable>

            <AppText style={styles.quantity}>
              {quantity}
            </AppText>

            <Pressable
              style={styles.quantityButton}
              onPress={() =>
                setQuantity((current) => current + 1)
              }
            >
              <AppText style={styles.quantityButtonText}>
                +
              </AppText>
            </Pressable>
          </View>
        </View>

        <AppButton
          title="Add to Cart"
            onPress={() => {
              addToCart(
                {
                  id: String(food.id),
                  name: food.name,
                  price: Number(food.price),
                  image: localFood?.image,
                },
                quantity
              );

              setSuccessVisible(true);
            }}
              style={styles.addToCart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  imageContainer: {
    width: "100%",
    height: 360,
    backgroundColor: colors.divider,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: spacing.xl,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },

  price: {
    marginTop: spacing.lg,
    fontFamily: typography.bold,
    fontSize: 24,
    color: colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xl,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontFamily: typography.semiBold,
    fontSize: 22,
  },

  quantity: {
    fontFamily: typography.bold,
    fontSize: 17,
  },

  addToCart: {
    marginTop: spacing.xl,
  },

  notFound: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(28, 25, 23, 0.48)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FCE8DC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  checkmark: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
  },

  modalTitle: {
    textAlign: "center",
    color: colors.textPrimary,
  },

  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  modalButtons: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },

  continueButton: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  continueButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  viewCartButton: {
    minHeight: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  viewCartButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },

  totalPrice: {
    marginTop: spacing.sm,
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },

});