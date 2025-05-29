from rest_framework import serializers
from core.models import PropertyProject, PropertyUnit, TenantProfile
from django.utils import timezone
from datetime import timedelta

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
    paid_days = serializers.SerializerMethodField()

    class Meta:
        model = PropertyUnit
        fields = [
            'id', 'property_project', 'property_project_name', 'unit_number', 
            'unit_type', 'contract_type', 'purpose', 'price', 'available',
            'amenities', 'paid', 'paid_days', 'paid_at', 'created_at',
            'tenant_info'
        ]
        read_only_fields = ('created_at', 'paid_days')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Optimize tenant queries
        if hasattr(self, 'context') and 'request' in self.context:
            self.tenant_prefetch = TenantProfile.objects.filter(
                property_unit__in=[obj.id for obj in self.instance] if self.instance else []
            )

    def get_tenant_info(self, obj):
        if hasattr(self, 'tenant_prefetch'):
            tenant = next((t for t in self.tenant_prefetch if t.property_unit_id == obj.id), None)
        else:
            tenant = TenantProfile.objects.filter(property_unit=obj).first()
        return TenantProfileSerializer(tenant).data if tenant else None

    def get_paid_days(self, obj):
        if obj.contract_type != 'rent':
            return obj.paid_days
            
        tenant = None
        if hasattr(self, 'tenant_prefetch'):
            tenant = next((t for t in self.tenant_prefetch if t.property_unit_id == obj.id), None)
        else:
            tenant = TenantProfile.objects.filter(property_unit=obj).first()
            
        if not tenant or not tenant.tenancy_start_date:
            return obj.paid_days
            
        end_date = tenant.tenancy_end_date or timezone.now().date()
        return (end_date - tenant.tenancy_start_date).days

    def validate(self, data):
        if self.instance is None:  # Only on create
            required_fields = {
                'property_project': "Property project is required",
                'unit_number': "Unit number is required",
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
        if validated_data.get('contract_type') == 'rent' and 'paid_days' not in validated_data:
            validated_data['paid_days'] = 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('paid', False) and not instance.paid:
            validated_data['paid_at'] = timezone.now()
        return super().update(instance, validated_data)