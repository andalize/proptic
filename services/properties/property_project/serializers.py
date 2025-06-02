from rest_framework import serializers
from core.models import (
    PropertyProject, 
    PropertyUnit, 
    TenantProfile,
    Tenancy
)

from django.utils import timezone

class PropertyProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyProject
        fields = '__all__'
        read_only_fields = ('id',)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Project name cannot be empty.")
            
        qs = PropertyProject.objects.filter(name__iexact=value)
        if self.instance:  # On update
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A project with this name already exists.")
        return value
    
class TenantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantProfile
        fields = '__all__'
        read_only_fields = ('user',)

class PropertyUnitSerializer(serializers.ModelSerializer):
    property_project_name = serializers.CharField(source='property_project.name', read_only=True)
    tenant_info = serializers.SerializerMethodField()

    class Meta:
        model = PropertyUnit
        fields = [
            'id', 'property_project', 
            'property_project_name', 'unit_name',
            'unit_type', 'purpose', 'price',
            'amenities', 'created_at',
            'tenant_info'
        ]
        read_only_fields = ('created_at', 'paid_days')

    def get_tenant_info(self, obj):
        tenancy = Tenancy.objects.filter(property_unit=obj, active=True).first()
        if tenancy:
            tenant_profile = TenantProfile.objects.filter(user=tenancy.tenant).first()
            return TenantProfileSerializer(tenant_profile).data if tenant_profile else None
        return None



    def validate(self, data):
        if self.instance is None:  # Only on create
            required_fields = {
                'property_project': "Property project is required",
                'unit_name': "Unit number is required",
                'price': "Price is required"
            }
            
            errors = {}
            for field, message in required_fields.items():
                if field not in data or data[field] in [None, '']:
                    errors[field] = message
                    
            if 'price' in data and data['price'] < 0:
                errors['price'] = "Price must be non-negative"
                
            if 'amenities' in data and data['amenities'] is not None:
                try:
                    if not isinstance(data['amenities'], dict):
                        raise ValueError
                except (TypeError, ValueError):
                    errors['amenities'] = "Amenities must be a valid JSON object"
                    
            if errors:
                raise serializers.ValidationError(errors)
                
        return data

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('paid', False) and not instance.paid:
            validated_data['paid_at'] = timezone.now()
        return super().update(instance, validated_data)