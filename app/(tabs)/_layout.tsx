import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#96908B",
        tabBarShowLabel: true,

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 0,
          height: 68 + insets.bottom,

          backgroundColor: "rgba(255, 255, 255, 0.94)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          elevation: 0,

          shadowColor: "#7A5B49",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.12,
          shadowRadius: 16,

          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingHorizontal: 4,
        },

        tabBarItemStyle: {
          borderRadius: 18,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "PlusJakartaSansMedium",
          marginTop: 2,
        },

        tabBarBackground: () => <View style={styles.background} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => {
            const iconColor: string =
              typeof color === "string" ? color : colors.primary;
            return (
              <Ionicons name="home-outline" size={size} color={iconColor} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => {
            const iconColor: string =
              typeof color === "string" ? color : colors.primary;

            return (
              <Ionicons name="search-outline" size={size} color={iconColor} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => {
            const iconColor: string =
              typeof color === "string" ? color : colors.primary;

            return (
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={size}
                color={iconColor}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => {
            const iconColor: string =
              typeof color === "string" ? color : colors.primary;

            return (
              <Ionicons name="person-outline" size={size} color={iconColor} />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 24,
  },
});
