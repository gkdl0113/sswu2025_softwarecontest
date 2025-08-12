from django.urls import path
from .views import RequestCodeView, VerifyCodeView, SignupView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("request-code/", RequestCodeView.as_view()),
    path("verify-code/",  VerifyCodeView.as_view()),
    path("signup/",       SignupView.as_view()),
    path("login/",        TokenObtainPairView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
]
