import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
handleNotification: async () => ({
shouldShowBanner: true,
shouldShowList: true,
shouldPlaySound: true,
shouldSetBadge: false,
}),
});

export async function requestNotificationPermission(): Promise<boolean> {
const { status: existingStatus } =
await Notifications.getPermissionsAsync();

let finalStatus = existingStatus;

if (existingStatus !== "granted") {
const { status } = await Notifications.requestPermissionsAsync();
finalStatus = status;
}

if (finalStatus !== "granted") {
return false;
}

if (Platform.OS === "android") {
await Notifications.setNotificationChannelAsync("orders", {
name: "Order Notifications",
importance: Notifications.AndroidImportance.HIGH,
vibrationPattern: [0, 250, 150, 250],
lightColor: "#E86A33",
sound: "default",
});
}

return true;
}

export async function showAddedToCartNotification(): Promise<void> {
const hasPermission = await requestNotificationPermission();

if (!hasPermission) {
console.warn("Notification permission was not granted.");
return;
}

await Notifications.scheduleNotificationAsync({
content: {
title: "🍔 Pisska",
body: "Added to your order! Tap to view your orders.",
sound: "default",
data: {
screen: "orders",
},
},
trigger: null,
});
}
