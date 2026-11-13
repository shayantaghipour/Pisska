import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import {
  focusManager,
  QueryClientProvider,
} from "@tanstack/react-query";

import { queryClient } from "./queryClient";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (status) => {
        if (Platform.OS !== "web") {
          focusManager.setFocused(status === "active");
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}