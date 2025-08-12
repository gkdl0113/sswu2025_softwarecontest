from django.urls import path, include

urlpatterns = [
    # ... 다른 경로들
    path("auth/", include("signup.urls")),
  # 주소 예시: /api/user/send-email/
]
