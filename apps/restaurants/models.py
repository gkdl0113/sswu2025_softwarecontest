from django.db import models

class College(models.Model):
    name = models.CharField(max_length=100, unique=True)  # 단과대 이름

    def __str__(self):
        return self.name


class Restaurant(models.Model):
    name = models.CharField(max_length=200)  # 식당 이름
    address = models.CharField(max_length=300)  # 주소
    latitude = models.FloatField()  # 위도
    longitude = models.FloatField()  # 경도
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name="restaurants")  # 단과대 연결
    is_partner = models.BooleanField(default=True)  # 제휴 여부

    def __str__(self):
        return f"{self.name} ({self.college.name})"
