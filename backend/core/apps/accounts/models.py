from django.db import models

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class CustomUser(AbstractUser):
    username = models.CharField(unique=True)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email
    
