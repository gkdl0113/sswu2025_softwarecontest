from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('post/new/', views.post_create, name='post_create'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('post/<int:pk>/comment/', views.add_comment, name='add_comment'),
    path('post/<int:pk>/recommend/', views.recommend_matches, name='recommend'),

    path('dm/<int:user_id>/', views.send_dm, name='send_dm'),
    path('dm/<int:user_id>/post/<int:post_id>/', views.send_dm, name='send_dm_for_post'),
    path('inbox/', views.inbox, name='inbox'),

    path('api/restaurants/', views.restaurants_json, name='restaurants_json'),
]
