from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('signup.urls')),  # signup 앱의 urls.py 연결
]
