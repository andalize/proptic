from django.urls import path
from .views import (
   UserListAPIView,
   UserDetailAPIView,
   UserProfileAPIView,
   TenantListAPIView,
   UsersByRoleAPIView,
   CreateTokenView,
   UserRegistrationAPIView,
   LoggedInUserAPIView
)

urlpatterns = [
    path('', UserListAPIView.as_view(), name='user-list'),
    path('tenants/', TenantListAPIView.as_view(), name='tenant-list'),
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path('login/', CreateTokenView.as_view(), name='user-login'),
    path('logged-in-user/', LoggedInUserAPIView.as_view(), name='logged-in-user'), 
    path('me/', UserProfileAPIView.as_view(), name='my-profile'),
    path('role/<str:role_name>/', UsersByRoleAPIView.as_view(), name='users-by-role'),
    path('<uuid:pk>/', UserDetailAPIView.as_view(), name='user-detail'),
]
