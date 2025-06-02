from rest_framework import serializers
from core.models import Tenancy  # Adjust import path if necessary
from user.serializers import UserSerializer
from property_project.serializers import PropertyUnitSerializer

class TenancySerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)
    tenant_id = serializers.UUIDField(write_only=True)
    property_unit = PropertyUnitSerializer(read_only=True)
    property_unit_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Tenancy
        fields = [
            'id', 'tenant', 'tenant_id', 'property_unit', 'property_unit_id',
            'tenancy_start_date', 'tenancy_end_date', 'monthly_rent',
            'deposit_amount', 'rent_period_paid', 'paid_amount',
            'payment_due_date', 'active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        tenant_id = validated_data.pop('tenant_id')
        property_unit_id = validated_data.pop('property_unit_id')
        tenancy = Tenancy.objects.create(
            tenant_id=tenant_id,
            property_unit_id=property_unit_id,
            **validated_data
        )
        return tenancy

    def update(self, instance, validated_data):
        # Optional: support updating tenant and property_unit if needed
        validated_data.pop('tenant_id', None)
        validated_data.pop('property_unit_id', None)
        return super().update(instance, validated_data)
