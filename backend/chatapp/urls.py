from django.urls import path
from . import views
from .views import room_list, RoomCreateAPIView

urlpatterns = [
    #path('', views.index, name='index'),
    #path('<str:room_name>/', views.room, name='room'),
    path('rooms/', room_list, name='room_list'),
    path('rooms/create/', RoomCreateAPIView.as_view(), name='room_create'),
]
