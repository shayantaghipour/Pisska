import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider} from "@/contexts/AuthContext";
import QueryProvider from "@/lib/QueryProvider";
import { queryClient } from "@/lib/queryClient";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansSemiBold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
  <QueryProvider>
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </AuthProvider>
    </ThemeProvider>
  </QueryProvider>
);
}