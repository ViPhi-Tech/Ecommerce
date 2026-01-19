from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('token', views.Login.as_view(), name='login'),
    path('user/create', views.CreateUser.as_view(), name='create'),
]
