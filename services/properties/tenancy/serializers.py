from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField
from core.models import Tenancy  # Adjust import path if necessary
from property_project.serializers import PropertyUnitSerializer

class TenancySerializer(serializers.ModelSerializer):

    def get_tenant_serializer(self):
        from user.serializers import UserSerializer
        return UserSerializer

    tenant = SerializerMethodField()
    tenant_id = serializers.UUIDField(write_only=True)
    property_unit = PropertyUnitSerializer(read_only=True)
    property_unit_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Tenancy
        fields = [
            'id', 'tenant', 'tenant_id', 'property_unit', 'property_unit_id',
            'tenancy_start_date', 'tenancy_end_date'
        ]
        read_only_fields = ['id', 'created_at']

    def get_tenant(self, obj):
        serializer_class = self.get_tenant_serializer()
        return serializer_class(obj.tenant).data if obj.tenant else None
    
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
        validated_data.pop('tenant', None)
        validated_data.pop('property_unit', None)
        return super().update(instance, validated_data)
