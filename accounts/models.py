from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user — extends Django's built-in User.
    Tables: accounts_user
    """
    phone   = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    class Meta:
        db_table = "accounts_user"

    def __str__(self):
        return self.username