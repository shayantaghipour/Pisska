import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryList from "../../components/category/CategoryList";
import FoodCard from "../../components/food/FoodCard";
import HomeHeader from "../../components/home/HomeHeader";
import SearchBar from "../../components/search/SearchBar";
import AppText from "../../components/ui/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { foodData } from "../../data/foodData";
import { getFoods } from "../../services/foodService";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: foods = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  const router = useRouter();
  const foodDataWithImages = foods.map((food) => {
    const localFood = foodData.find(
      (item) => String(item.id) === String(food.id),
    );

    return {
      ...food,
      image: localFood?.image,
    };
  });

  const filteredFoodData = foodDataWithImages.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === null || food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader />

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <CategoryList
          selectedCategory={selectedCategory}
          onCategoryPress={setSelectedCategory}
        />

        <View style={styles.foodSection}>
          <AppText variant="title">Popular Foods</AppText>
          {isLoading && <AppText variant="caption">Loading foods...</AppText>}

          {isError && (
            <View>
              <AppText variant="caption">Could not load foods.</AppText>

              <Pressable onPress={() => refetch()}>
                <AppText variant="button">Try Again</AppText>
              </Pressable>
            </View>
          )}
          {!isLoading && !isError && (
            <FlatList
              data={filteredFoodData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.foodList}
              renderItem={({ item }) => (
                <FoodCard
                  name={item.name}
                  description={item.description}
                  price={Number(item.price)}
                  image={item.image}
                  onPress={() => router.push(`/food/${item.id}`)}
                />
              )}
            />
          )}

          {!isLoading && !isError && filteredFoodData.length === 0 && (
            <View style={styles.emptyState}>
              <AppText variant="title">No food found</AppText>

              <AppText variant="caption">
                Try searching for something else.
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  title: {
    fontSize: 32,
    color: colors.primary,
    marginBottom: spacing.lg,
    fontWeight: "700",
  },

  foodSection: {
    width: "100%",
    marginTop: spacing.xl,
  },

  foodList: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingRight: spacing.lg,
  },

  content: {
    paddingBottom: spacing.xxxl,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
});
