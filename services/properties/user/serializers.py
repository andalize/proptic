from django.contrib.auth import (
    get_user_model,
    authenticate,
)
from django.utils.translation import gettext as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from core.models import Role, Tenancy
from tenancy.serializers import TenancySerializer

User = get_user_model()

class RoleSerializer(serializers.ModelSerializer):
    """Serializer for Role model."""
    class Meta:
        model = Role
        fields = ['id', 'name', 'display_name']


class UserTenancySerializer(serializers.ModelSerializer):
    property_unit_id = serializers.CharField(source='property_unit.id')
    property_unit_name = serializers.CharField(source='property_unit.unit_name')
    
    class Meta:
        model = Tenancy
        fields = [
            'property_unit_id', 
            'property_unit_name',
            'tenancy_start_date',
            'tenancy_end_date'
        ]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object with full CRUD support."""

    roles = RoleSerializer(many=True, read_only=True)

    tenancy = serializers.SerializerMethodField()

    role_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Role.objects.all(),
        source='roles',
        write_only=True,
        required=False
    )

    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'password', 
            'first_name',
            'last_name',
            'gender',
            'full_name',
            'role_ids',
            'national_id',
            'passport_number',
            'roles',
            'tenancy',
            'is_active', 
            'is_staff'
        ]
        read_only_fields = ['id', 'is_active', 'is_staff', 'full_name']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 8,
                'style': {'input_type': 'password'}
            },
            'national_id': {
                'required': False,
                'allow_null': True
            },
            'passport_number': {
                'required': False,
                'allow_null': True
            }
        }

    def get_full_name(self, obj):
        """Return the user's full name."""
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def validate_email(self, value):
        """Validate that email is unique and properly formatted."""
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            if self.instance and self.instance.email == value:
                return value
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_national_id(self, value):
        """Validate national ID format if provided - must be 12-18 characters."""
        if value:
            if len(value) < 12 or len(value) > 18:
                raise serializers.ValidationError(
                    "National ID must be between 12 and 18 characters long."
                )
        return value

    def validate_passport_number(self, value):
        """Validate passport number format if provided - must be exactly 9 characters."""
        if value:
            if len(value) != 9:
                raise serializers.ValidationError(
                    "Passport number must be exactly 9 characters long."
                )
        return value

    def validate_roles(self, value):
        """Validate roles exist."""
        if not value:
            # Default to 'tenant' role if no roles specified
            try:
                tenant_role = Role.objects.get(name='tenant')
                return [tenant_role]
            except Role.DoesNotExist:
                raise serializers.ValidationError("Default 'tenant' role does not exist.")
        return value

    def validate(self, data):
        """Ensure either national_id or passport_number is provided."""
        if not data.get('national_id') and not data.get('passport_number'):
            raise serializers.ValidationError(
                "Either national ID or passport number must be provided."
            )
        return data

    def create(self, validated_data):
        """Create and return a new user with encrypted password."""
        roles_data = validated_data.pop('roles', [])
        
        # If no roles provided, default to 'tenant'
        if not roles_data:
            try:
                tenant_role = Role.objects.get(name='tenant')
                roles_data = [tenant_role]
            except Role.DoesNotExist:
                raise serializers.ValidationError("Default 'tenant' role does not exist.")
        
        user = User.objects.create_user(**validated_data)
        user.roles.set(roles_data)
        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly if provided."""
        password = validated_data.pop('password', None)
        roles_data = validated_data.pop('roles', None)
        
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        if roles_data is not None:
            user.roles.set(roles_data)
        
        return user

    def delete(self, instance):
        """Deactivate rather than delete users (common practice)."""
        instance.is_active = False
        instance.save()
        return instance
    
    def get_tenancy(self, obj):
        tenancy = Tenancy.objects.filter(tenant=obj, active=True).select_related('property_unit').first()
        if tenancy:
            return UserTenancySerializer(tenancy).data
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Simplified serializer for user registration with role support."""
    role = serializers.CharField(write_only=True, default='tenant')
    
    class Meta:
        model = User
        fields = [
            'email', 
            'password', 
            'first_name',
            'gender',
            'last_name',
            'national_id',
            'passport_number',
            'role'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': False,
                'min_length': 8,
                'style': {'input_type': 'password'}
            },
            'national_id': {
                'required': False,
                'allow_null': True
            },
            'passport_number': {
                'required': False,
                'allow_null': True
            }
        }

    def validate_email(self, value):
        """Validate that email is unique and properly formatted."""
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_national_id(self, value):
        """Validate national ID format if provided - must be 12-18 characters."""
        if value:
            if len(value) < 12 or len(value) > 18:
                raise serializers.ValidationError(
                    "National ID must be between 12 and 18 characters long."
                )
        return value

    def validate_passport_number(self, value):
        """Validate passport number format if provided - must be exactly 9 characters."""
        if value:
            if len(value) != 9:
                raise serializers.ValidationError(
                    "Passport number must be exactly 9 characters long."
                )
        return value

    def validate_role(self, value):
        """Validate that the role exists."""
        try:
            Role.objects.get(name=value)
            return value
        except Role.DoesNotExist:
            raise serializers.ValidationError(f"Role '{value}' does not exist.")

    def validate(self, data):
        """Ensure either national_id or passport_number is provided."""
        if not data.get('national_id') and not data.get('passport_number'):
            raise serializers.ValidationError(
                "Either national ID or passport number must be provided."
            )
        return data

    def create(self, validated_data):
        """Create and return a new user with encrypted password and role."""
        role_name = validated_data.pop('role', 'tenant')
        
        user = User.objects.create_user(**validated_data)
        
        # Assign role
        try:
            role = Role.objects.get(name=role_name)
            user.roles.add(role)
        except Role.DoesNotExist:
            # If role doesn't exist, still create user but without role
            pass
        
        return user



class AuthTokenSerializer(TokenObtainPairSerializer):
    """Custom serializer for JWT token authentication."""

    def validate(self, attrs):
        email = attrs.get('email').lower().strip()
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                _('Unable to authenticate with provided credentials.'),
                code='authorization'
            )

        if not user.is_active:
            raise serializers.ValidationError(
                _('User account is disabled.'),
                code='authorization'
            )

        attrs['user'] = user
        return attrs
