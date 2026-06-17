from django.db import models
from django.conf import settings
from restaurants.models import MenuItem, Restaurant


class Order(models.Model):
    """
    A customer's order.
    Table: orders_order
    """
    STATUS_CHOICES = [
        ("pending",    "Pending"),
        ("preparing",  "Preparing"),
        ("on_the_way", "On the Way"),
        ("delivered",  "Delivered"),
        ("cancelled",  "Cancelled"),
    ]

    user  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="orders",
    )
    restaurant  = models.ForeignKey(
        Restaurant,
        on_delete=models.PROTECT,
        related_name="orders",
    )
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.PositiveIntegerField(default=0, help_text="Total in INR (₹)")
    address     = models.TextField(blank=True)
    note        = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders_order"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.pk} — {self.restaurant.name} [{self.status}]"


class OrderItem(models.Model):
    """
    A single line item in an Order.
    Table: orders_orderitem
    """
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item  = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity   = models.PositiveSmallIntegerField(default=1)
    unit_price = models.PositiveIntegerField(help_text="Price snapshot at order time")

    class Meta:
        db_table = "orders_orderitem"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity}× {self.menu_item.name}"
