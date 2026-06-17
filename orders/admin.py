from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model           = OrderItem
    extra           = 0
    readonly_fields = ("unit_price", "subtotal")
    fields          = ("menu_item", "quantity", "unit_price", "subtotal")

    def subtotal(self, obj):
        return f"₹{obj.subtotal}"
    subtotal.short_description = "Subtotal"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ("id", "restaurant", "user", "status", "total_price", "created_at")
    list_filter     = ("status", "restaurant", "created_at")
    search_fields   = ("user__username", "restaurant__name")
    readonly_fields = ("total_price", "created_at", "updated_at")
    list_editable   = ("status",)
    inlines         = [OrderItemInline]

    def has_add_permission(self, request):
        return False  # orders created via API only