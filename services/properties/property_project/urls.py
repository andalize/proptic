from django.urls import path
from .views import (
    PropertyProjectListAPIView,
    PropertyProjectDetailAPIView,
    PropertyUnitListAPIView,
    PropertyUnitDetailAPIView
)

urlpatterns = [
    # Project URLs
    path('projects/', PropertyProjectListAPIView.as_view(), name='project-list'),
    path('projects/<uuid:pk>/', PropertyProjectDetailAPIView.as_view(), name='project-detail'),
    
    # Unit URLs
    path('units/', PropertyUnitListAPIView.as_view(), name='unit-list'),
    path('units/<uuid:pk>/', PropertyUnitDetailAPIView.as_view(), name='unit-detail'),
]