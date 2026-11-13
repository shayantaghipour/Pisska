import { useEffect, useMemo, useState } from "react";
import {
ActivityIndicator,
FlatList,
StyleSheet,
TextInput,
TouchableOpacity,
View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AppText from "../../components/ui/AppText";
import FoodCard from "../../components/food/FoodCard";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { getFoods, type Food } from "../../services/foodService";
import { foodData } from "../../data/foodData";

export default function SearchScreen() {
const router = useRouter();

const [searchQuery, setSearchQuery] = useState("");
const [foods, setFoods] = useState<Food[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
let isMounted = true;
const fetchFoods = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getFoods();

    if (isMounted) {
      setFoods(data);
    }
  } catch (err) {
    console.error("Failed to fetch foods:", err);

    if (isMounted) {
      setError("Couldn't load foods. Please check your connection.");
    }
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
};

fetchFoods();

return () => {
  isMounted = false;
};


}, []);

const foodsWithImages = useMemo(
() =>
foods.map((food) => {
const localFood = foodData.find(
(item) => String(item.id) === String(food.id)
);


    return {
      ...food,
      image: localFood?.image,
    };
  }),
[foods]


);

const filteredFoods = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


if (!query) {
  return [];
}

return foodsWithImages.filter((food) =>
  food.name.toLowerCase().includes(query)
);


}, [foodsWithImages, searchQuery]);

const clearSearch = () => {
setSearchQuery("");
};

return (
  <SafeAreaView style={styles.container} edges={["top"]}>
    <View style={styles.header}>
      <AppText variant="title">Search</AppText>

      <AppText variant="caption">
        Find your next favorite meal.
      </AppText>
    </View>


  <View style={styles.searchContainer}>
    <Ionicons
      name="search-outline"
      size={21}
      color={colors.textSecondary}
    />

    <TextInput
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Search for food..."
      placeholderTextColor={colors.textTertiary}
      style={styles.searchInput}
      returnKeyType="search"
      autoCapitalize="none"
      autoCorrect={false}
    />

    {searchQuery.length > 0 && (
      <TouchableOpacity
        onPress={clearSearch}
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={10}
      >
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.textTertiary}
        />
      </TouchableOpacity>
    )}
  </View>

  {loading ? (
    <View style={styles.centerState}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="caption">Loading foods...</AppText>
    </View>
  ) : error ? (
    <View style={styles.centerState}>
      <Ionicons
        name="cloud-offline-outline"
        size={36}
        color={colors.textSecondary}
      />
      <AppText variant="title">Connection problem</AppText>
      <AppText variant="caption">{error}</AppText>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setSearchQuery("");
          setError("Please return to this page to try loading again.");
        }}
      >
        <AppText variant="caption">Try again later</AppText>
      </TouchableOpacity>
    </View>
  ) : searchQuery.trim().length === 0 ? (
    <View style={styles.centerState}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="search-outline"
          size={32}
          color={colors.primary}
        />
      </View>
      <AppText variant="title">What are you craving?</AppText>
      <AppText variant="caption">
        Search for burgers, pizza, pasta and more.
      </AppText>
    </View>
  ) : filteredFoods.length === 0 ? (
    <View style={styles.centerState}>
      <Ionicons
        name="fast-food-outline"
        size={38}
        color={colors.textTertiary}
      />
      <AppText variant="title">No food found</AppText>
      <AppText variant="caption">
        Try another food name.
      </AppText>
    </View>
  ) : (
    <FlatList
      data={filteredFoods}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.resultRow}
      contentContainerStyle={styles.results}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <FoodCard
            name={item.name}
            description={item.description}
            price={Number(item.price)}
            image={item.image}
            onPress={() => router.push(`/food/${item.id}`)}
          />
        </View>
      )}
    />
  )}
</SafeAreaView>


);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
paddingHorizontal: spacing.lg,
paddingTop: spacing.md,
},

header: {
marginBottom: spacing.lg,
gap: spacing.xs,
},

searchContainer: {
flexDirection: "row",
alignItems: "center",
backgroundColor: colors.surface,
borderRadius: 18,
borderWidth: 1,
borderColor: colors.border,
paddingHorizontal: spacing.md,
height: 54,
gap: spacing.sm,
marginBottom: spacing.lg,
},

searchInput: {
flex: 1,
color: colors.textPrimary,
fontFamily: "PlusJakartaSansRegular",
fontSize: 14,
paddingVertical: 0,
},

centerState: {
flex: 1,
alignItems: "center",
justifyContent: "center",
paddingHorizontal: spacing.lg,
gap: spacing.md,
},

emptyIcon: {
width: 68,
height: 68,
borderRadius: 24,
backgroundColor: "#FBE8DD",
alignItems: "center",
justifyContent: "center",
},

results: {
paddingBottom: spacing.xxxl,
},

resultRow: {
justifyContent: "space-between",
gap: spacing.md,
marginBottom: spacing.md,
},

cardWrapper: {
flex: 1,
minWidth: 0,
},

retryButton: {
marginTop: spacing.sm,
backgroundColor: colors.surface,
borderRadius: 14,
borderWidth: 1,
borderColor: colors.border,
paddingHorizontal: spacing.lg,
paddingVertical: spacing.sm,
},
});
