from django.urls import path
from .views import BookingListCreateAPIView, BookingDetailAPIView

urlpatterns = [
    path('', BookingListCreateAPIView.as_view(), name='booking-list-create'),
    path('<uuid:pk>/', BookingDetailAPIView.as_view(), name='booking-detail'),
]
