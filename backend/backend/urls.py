# backend/urls.py ← settings.py랑 같은 폴더에 있는 urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('signup.urls')),  # 앱 URL 포함시키기
]
