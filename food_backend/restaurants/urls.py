from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet

router = DefaultRouter()

router.register(r"menu-items", MenuItemViewSet, basename="menuitem")
router.register(r"", RestaurantViewSet, basename="restaurant")

urlpatterns = [
    path("", include(router.urls)),
]