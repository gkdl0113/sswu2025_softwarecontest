from rest_framework import viewsets
from .models import Restaurant, College
from .serializers import RestaurantSerializer, CollegeSerializer


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        college_id = self.request.query_params.get("college_id")
        if college_id:
            return qs.filter(college_id=college_id, is_partner=True)
        return qs.filter(is_partner=True)
