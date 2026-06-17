from rest_framework import serializers
from .models import Restaurant, MenuItem


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MenuItem
        fields = (
            "id", "name", "description", "price",
            "image_url", "image", "is_veg", "is_available",
        )


class RestaurantListSerializer(serializers.ModelSerializer):
    """Lightweight — used for GET /api/restaurants/ list view."""
    class Meta:
        model  = Restaurant
        fields = ("id", "name", "cuisine", "rating", "delivery_time", "emoji", "image_url")


class RestaurantDetailSerializer(serializers.ModelSerializer):
    """Full detail + nested menu items — used for GET /api/restaurants/{id}/"""
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Restaurant
        fields = (
            "id", "name", "cuisine", "rating", "delivery_time",
            "emoji", "image_url", "image", "is_active", "menu_items",
        )