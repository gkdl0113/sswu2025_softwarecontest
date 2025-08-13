from django.urls import path
from . import views

urlpatterns = [
    path('send-code/', views.send_verification_code, name='send_code'),
    path('verify-code/', views.verify_code, name='verify_code'),
    path('signup/', views.signup_user, name='signup'),
]
