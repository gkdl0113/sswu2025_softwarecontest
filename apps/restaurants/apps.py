# apps/restaurants/apps.py
from django.apps import AppConfig

class RestaurantsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.restaurants'     # ← 반드시 이 값이어야 함
    verbose_name = 'Restaurants'
