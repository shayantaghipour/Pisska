from rest_framework import serializers
from .models import Food, Order, OrderItem


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(
        source="food.name",
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = ["id", "food", "food_name", "quantity", "price"]
        read_only_fields = ["id", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "total", "created_at", "items"]
        read_only_fields = ["id", "status", "total", "created_at", "items"]