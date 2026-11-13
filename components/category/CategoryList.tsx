import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Utensils, Pizza, Coffee, Salad } from "lucide-react-native";

import AppText from "../ui/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

interface CategoryListProps {
  selectedCategory: string | null;
  onCategoryPress: (category: string | null) => void;
}

const categories = [
  {
    id: "1",
    title: "Burger",
    icon: Utensils,
  },
  {
    id: "2",
    title: "Pizza",
    icon: Pizza,
  },
  {
    id: "3",
    title: "Pasta",
    icon: Coffee,
  },
  {
    id: "4",
    title: "Healthy",
    icon: Salad,
  },
  {
    id: "5",
    title: "Dessert",
    icon: Coffee,
  },
];

export default function CategoryList({
  selectedCategory,
  onCategoryPress,
}: CategoryListProps) {
  return (
    <View>
      <AppText variant="title">Categories</AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.title;

          return (
            <Pressable
              key={category.id}
              onPress={() =>
                onCategoryPress(
                  isSelected ? null : category.title
                )
              }
              style={[
                styles.category,
                isSelected && styles.selectedCategory,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}
              >
                <Icon
                  size={22}
                  color={
                    isSelected
                      ? colors.white
                      : colors.primary
                  }
                  strokeWidth={2}
                />
              </View>

              <AppText variant="caption">
                {category.title}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingRight: spacing.lg,
  },

  category: {
    width: 82,
    alignItems: "center",
    gap: spacing.sm,
  },

  selectedCategory: {
    opacity: 1,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedIconContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

