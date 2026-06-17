from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from restaurants.models import MenuItem, Restaurant


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.AllowAny]

    """
    POST   /api/orders/                    → place order        (login required)
    GET    /api/orders/                    → my orders          (login required)
    GET    /api/orders/{id}/               → order detail       (login required)
    PATCH  /api/orders/{id}/update_status/ → change status      (admin only)
    GET    /api/orders/all/                → all orders         (admin only)
    """


    def get_queryset(self):
        user = self.request.user
        qs   = Order.objects.select_related("restaurant", "user").prefetch_related(
                    "items__menu_item")
        if user.is_staff:
            return qs.all()
        return qs.filter(user=user)

    @transaction.atomic
    def create(self, request):
        """POST /api/orders/ — place a new order"""
        ser = OrderCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            restaurant = Restaurant.objects.get(pk=data["restaurant_id"])
        except Restaurant.DoesNotExist:
            return Response({"detail": "Restaurant not found."},
                            status=status.HTTP_404_NOT_FOUND)

        order = Order.objects.create(
            user       = request.user,
            restaurant = restaurant,
            address    = data.get("address", ""),
            note       = data.get("note", ""),
        )

        total = 0
        for item_data in data["items"]:
            try:
                menu_item = MenuItem.objects.get(
                    pk=item_data["menu_item_id"], is_available=True)
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(
                    f"Menu item {item_data['menu_item_id']} not found or unavailable.")
            qty = item_data["quantity"]
            OrderItem.objects.create(
                order      = order,
                menu_item  = menu_item,
                quantity   = qty,
                unit_price = menu_item.price,
            )
            total += menu_item.price * qty

        order.total_price = total
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"],
            permission_classes=[permissions.IsAdminUser],
            url_path="update_status")
    def update_status(self, request, pk=None):
        """PATCH /api/orders/{id}/update_status/  body: { "status": "delivered" }"""
        order  = self.get_object()
        new_st = request.data.get("status", "")
        valid  = [s[0] for s in Order.STATUS_CHOICES]
        if new_st not in valid:
            return Response(
                {"detail": f"Invalid status. Choose from: {valid}"},
                status=status.HTTP_400_BAD_REQUEST)
        order.status = new_st
        order.save()
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=["get"],
            permission_classes=[permissions.IsAdminUser],
            url_path="all")
    def all_orders(self, request):
        """GET /api/orders/all/ — admin only"""
        orders = Order.objects.all().select_related(
            "restaurant", "user").prefetch_related("items__menu_item")
        return Response(OrderSerializer(orders, many=True).data)