from rest_framework import viewsets, permissions
from .models import Restaurant, MenuItem
from .serializers import (
    RestaurantListSerializer,
    RestaurantDetailSerializer,
    MenuItemSerializer,
)


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    GET    /api/restaurants/        → list  (public)
    GET    /api/restaurants/{id}/   → detail + menu  (public)
    POST   /api/restaurants/        → create  (admin only)
    PATCH  /api/restaurants/{id}/   → update  (admin only)
    DELETE /api/restaurants/{id}/   → delete  (admin only)
    """
    queryset = Restaurant.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "list":
            return RestaurantListSerializer
        return RestaurantDetailSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    GET    /api/restaurants/menu-items/                        → all items  (public)
    GET    /api/restaurants/menu-items/?restaurant=1           → filtered by restaurant
    POST   /api/restaurants/menu-items/                        → create  (admin only)
    PATCH  /api/restaurants/menu-items/{id}/                   → update  (admin only)
    DELETE /api/restaurants/menu-items/{id}/                   → delete  (admin only)
    """
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        qs = MenuItem.objects.filter(is_available=True).select_related("restaurant")
        restaurant_id = self.request.query_params.get("restaurant")
        if restaurant_id:
            qs = qs.filter(restaurant_id=restaurant_id)
        return qs

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]