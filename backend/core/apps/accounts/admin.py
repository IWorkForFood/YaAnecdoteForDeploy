from django.contrib import admin
from .models import CustomUser
from django.contrib import admin

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_verified', 'is_active')

admin.site.register(CustomUser, CustomUserAdmin)
