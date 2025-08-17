from django.contrib import admin
from .models import Faculty, PartnerRestaurant, Restaurant

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'center_lat', 'center_lng')
    search_fields = ('name', 'slug')

@admin.register(PartnerRestaurant)
class PartnerRestaurantAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'restaurant', 'active', 'discount_percent', 'start_date', 'end_date')
    list_filter = ('faculty', 'active')
    search_fields = ('restaurant__name', 'faculty__name', 'benefit_text')

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'lat', 'lng')
    search_fields = ('name', 'category', 'address')
