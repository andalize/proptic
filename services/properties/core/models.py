from django.db import models

# Create your models here.
"""
Database models.
"""
import uuid
import os

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.name
    
    
class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user."""
        if not email:
            raise ValueError('User must have an email address.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and return a new superuser."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    roles = models.ManyToManyField(Role, related_name='users') 
    national_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    passport_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email



class PropertyProject(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)


    class Meta:
        db_table = 'property_projects'

    def __str__(self):
        return self.name
    

class PropertyUnit(models.Model):
    UNIT_TYPES = [
        ('apartment', 'Apartment'),
        ('duplex', 'Duplex'),
        ('townhouse', 'Townhouse'),
        ('villa', 'Villa'),
        ('office', 'Office'),
        ('shop', 'Shop'),
    ]

    PURPOSE_CHOICES = [
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('office', 'Office'),
    ]

    CONTRACT_CHOICES = [
        ('rent', 'Rent'),
        ('sale', 'Sale')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property_project = models.ForeignKey(PropertyProject, on_delete=models.CASCADE, related_name='units')
    unit_number = models.CharField(max_length=50)
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPES)
    contract_type = models.CharField(max_length=10, choices=CONTRACT_CHOICES)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    available = models.BooleanField(default=True)
    amenities = models.JSONField(blank=True, null=True)
    paid = models.BooleanField(default=False)
    paid_days = models.PositiveIntegerField()
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'property_units'

    def __str__(self):
        return f"{self.property_project.name} {self.unit_type} {self.unit_number}"
    


class TenantProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tenancy_start_date = models.DateField(null=True, blank=True)
    tenancy_end_date = models.DateField(null=True, blank=True)
    property_unit = models.ForeignKey('PropertyUnit', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'tenant_profiles'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"



# class Tenant(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     first_name = models.CharField(max_length=255)
#     last_name = models.CharField(max_length=255)
#     national_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
#     passport_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
#     email = models.EmailField(unique=True)
#     phone = models.CharField(max_length=20, blank=True, null=True)

#     def __str__(self):
#         return f"{self.first_name} {self.last_name}"
    

# class Tenancy(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     apartment_unit = models.ForeignKey(PropertyUnit, on_delete=models.CASCADE, related_name="tenancies")
#     tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="tenancies")
#     tenancy_start_date = models.DateField()
#     tenancy_end_date = models.DateField(blank=True, null=True)
#     paid_rent = models.BooleanField(default=False)
#     rent_period_paid = models.PositiveIntegerField(help_text="Number of days covered by the paid rent", default=0)
#     paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

#     def __str__(self):
#         return f"Tenancy for {self.tenant} in {self.apartment_unit}"



