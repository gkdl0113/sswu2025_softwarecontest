from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, CollegeViewSet

router = DefaultRouter()
router.register(r"colleges", CollegeViewSet)
router.register(r"restaurants", RestaurantViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
