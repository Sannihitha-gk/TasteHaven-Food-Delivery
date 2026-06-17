from django.db import models


class Restaurant(models.Model):
    """
    Represents a restaurant listed on TasteHaven.
    Table: restaurants_restaurant
    """
    name          = models.CharField(max_length=150)
    cuisine       = models.CharField(max_length=80)
    rating        = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    delivery_time = models.CharField(max_length=40, default="30–45 min")
    emoji         = models.CharField(max_length=8, blank=True)
    image_url     = models.URLField(blank=True, help_text="External image URL")
    image         = models.ImageField(upload_to="restaurants/", blank=True, null=True,
                                      help_text="Uploaded image (optional)")
    is_active     = models.BooleanField(default=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "restaurants_restaurant"
        ordering = ["id"]

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    """
    Menu item belonging to a restaurant.
    Table: restaurants_menuitem
    """
    restaurant   = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="menu_items"
    )
    name         = models.CharField(max_length=150)
    description  = models.TextField(blank=True)
    price        = models.PositiveIntegerField(help_text="Price in INR (₹)")
    image_url    = models.URLField(blank=True)
    image        = models.ImageField(upload_to="menu/", blank=True, null=True)
    is_veg       = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "restaurants_menuitem"
        ordering = ["id"]

    def __str__(self):
        return f"{self.restaurant.name} — {self.name}"