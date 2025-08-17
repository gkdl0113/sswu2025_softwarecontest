from rest_framework import serializers
from .models import Restaurant, College

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = "__all__"


class RestaurantSerializer(serializers.ModelSerializer):
    college = CollegeSerializer(read_only=True)

    class Meta:
        model = Restaurant
        fields = "__all__"
