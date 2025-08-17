from django.contrib import admin
from .models import Restaurant, College

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "college", "is_partner")
    list_filter = ("college", "is_partner")

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ("name",)
