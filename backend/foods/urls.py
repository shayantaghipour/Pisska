from django.urls import path
from .views import FoodListView, OrderCreateView, OrderCancelView

urlpatterns = [
    path("", FoodListView.as_view(), name="food-list"),
    path("orders/", OrderCreateView.as_view(), name="order-create"),
    path("orders/<int:pk>/cancel/", OrderCancelView.as_view(), name="order-cancel"),
]