from django.urls import path
from .views import TenancyListCreateAPIView, TenancyDetailAPIView

urlpatterns = [
    path('', TenancyListCreateAPIView.as_view(), name='tenancy-list-create'),
    path('<uuid:pk>/', TenancyDetailAPIView.as_view(), name='tenancy-detail'),
]
