from rest_framework import serializers
from core.models import Booking


class BookingSerializer(serializers.ModelSerializer):
    guest_email = serializers.EmailField(source='guest_id.email', read_only=True)
    property_unit_name = serializers.CharField(source='property_unit_id.unit_name', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'guest_email', 'property_unit_name']
