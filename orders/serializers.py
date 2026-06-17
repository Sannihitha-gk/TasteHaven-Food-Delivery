from rest_framework import serializers
from .models import Order, OrderItem
from restaurants.serializers import MenuItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source="menu_item", read_only=True)
    subtotal         = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ("id", "menu_item", "menu_item_detail", "quantity", "unit_price", "subtotal")


class OrderSerializer(serializers.ModelSerializer):
    items           = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source="restaurant.name", read_only=True)
    username        = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model  = Order
        fields = (
            "id", "username", "restaurant", "restaurant_name",
            "status", "total_price", "address", "note",
            "items", "created_at", "updated_at",
        )
        read_only_fields = ("total_price", "status", "created_at", "updated_at")


# ── Used only in POST /api/orders/ ───────────────────────────────
class OrderItemInputSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity     = serializers.IntegerField(min_value=1, max_value=50)


class OrderCreateSerializer(serializers.Serializer):
    """
    Expected POST body:
    {
      "restaurant_id": 1,
      "address": "123 MG Road, Hyderabad",
      "note":    "Extra spicy please",
      "items": [
        { "menu_item_id": 101, "quantity": 2 },
        { "menu_item_id": 103, "quantity": 1 }
      ]
    }
    """
    restaurant_id = serializers.IntegerField()
    address       = serializers.CharField(required=False, allow_blank=True, default="")
    note          = serializers.CharField(required=False, allow_blank=True, default="")
    items         = OrderItemInputSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        return value