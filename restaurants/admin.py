from django.contrib import admin
from .models import Restaurant, MenuItem


class MenuItemInline(admin.TabularInline):
    model       = MenuItem
    extra       = 1
    fields      = ("name", "price", "is_veg", "is_available", "image_url")
    show_change_link = True


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display   = ("name", "cuisine", "rating", "delivery_time", "is_active", "created_at")
    list_filter    = ("is_active", "cuisine")
    search_fields  = ("name", "cuisine")
    list_editable  = ("is_active",)
    inlines        = [MenuItemInline]


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display  = ("name", "restaurant", "price", "is_veg", "is_available")
    list_filter   = ("is_veg", "is_available", "restaurant")
    search_fields = ("name", "restaurant__name")
    list_editable = ("price", "is_available")