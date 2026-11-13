from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Food, Order, OrderItem
from .serializers import FoodSerializer, OrderSerializer


class FoodListView(generics.ListAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    


class OrderCreateView(APIView):

    def get(self, _request):
        orders = Order.objects.prefetch_related(
            "items__food"
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        items = request.data.get("items", [])


        if not isinstance(items, list) or not items:
            return Response(
                {"error": "Order must contain at least one item."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

        order_items = []
        total = 0

        for item in items:
            try:
                food_id = int(item["id"])
                quantity = int(item["quantity"])

                if quantity <= 0:
                    raise ValueError

                food = Food.objects.get(id=food_id)

            except (KeyError, TypeError, ValueError, Food.DoesNotExist):
                return Response(
                    {"error": "Invalid food or quantity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            total += food.price * quantity

            order_items.append({
                "food": food,
                "quantity": quantity,
                "price": food.price,
            })

        order = Order.objects.create(total=total)

        for item in order_items:
            OrderItem.objects.create(
                order=order,
                food=item["food"],
                quantity=item["quantity"],
                price=item["price"],
            )

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

class OrderCancelView(APIView):
    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk)

        if order.status != "confirmed":
            return Response(
                {"error": "Only confirmed orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "cancelled"
        order.save(update_fields=["status"])

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)