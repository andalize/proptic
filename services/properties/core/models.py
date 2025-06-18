from django.db import models
import uuid

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class PropertyProject(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()    
    description = models.TextField(blank=True, null=True)
    cover_photo = models.ImageField(upload_to='property_projects/covers/', null=True, blank=True)

    class Meta:
        db_table = 'property_projects'

    def __str__(self):
        return self.name

class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    display_name = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.name
    
    
class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email=None, password=None, **extra_fields):
        """Create, save and return a new user."""
        if email:
            email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        """Create and return a new superuser."""
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    
    """Custom user model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    roles = models.ManyToManyField(Role, related_name='users') 
    national_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    passport_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    property_project = models.ForeignKey(
        PropertyProject, 
        on_delete=models.CASCADE,
        related_name='managers',
        null=True,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_support = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        constraints = [
            models.UniqueConstraint(
                fields=['national_id'],
                name='unique_national_id',
                condition=~models.Q(national_id=None)
            ),
            models.UniqueConstraint(
                fields=['passport_number'],
                name='unique_passport_number',
                condition=~models.Q(passport_number=None)
            )
        ]

    def __str__(self):
        return self.email if self.email else str(self.id)


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

  
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property_project = models.ForeignKey(PropertyProject, on_delete=models.CASCADE, related_name='units')
    unit_name = models.CharField(max_length=50)
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPES)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    is_listed_for_rent = models.BooleanField(default=False)
    is_listed_for_sale = models.BooleanField(default=False)
    amenities = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'property_units'

    def __str__(self):
        return f"{self.property_project.name} {self.unit_type} {self.unit_number}"
    


class PropertyUnitImage(models.Model):
    property_unit = models.ForeignKey(PropertyUnit, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='property_units/gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'property_unit_images'
        constraints = [
            models.UniqueConstraint(
                fields=['property_unit_id', 'image'],
                name='unique_image_per_unit'
            )
        ]

    def __str__(self):
        return f"Image for {self.property_unit.unit_name}"


class TenantProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    emergency_contact = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='tenant_profiles/', null=True, blank=True)

    class Meta:
        db_table = 'tenant_profiles'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class Tenancy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property_unit = models.ForeignKey(PropertyUnit, on_delete=models.CASCADE, related_name="tenancies")
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tenancies")
    tenancy_start_date = models.DateField()
    tenancy_end_date = models.DateField(blank=True, null=True)
    monthly_rent = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    deposit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, null=True, blank=True)
    payment_due_date = models.DateField(null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tenancies'

    def __str__(self):
        return f"Tenancy for {self.tenant.email} in {self.property_unit.unit_name}"


class RentTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenancy = models.ForeignKey(Tenancy, on_delete=models.CASCADE, related_name="transactions")
    transaction_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # e.g. 'cash', 'mobile_money', 'card'
    payment_status = models.CharField(max_length=20, default='completed')  # or 'pending', 'failed', 'reverse', 'completed'
    rent_period_start_date = models.DateField()
    rent_period_end_date = models.DateField()
    paid_days = models.PositiveIntegerField(help_text="Number of days covered by this payment")
    description = models.TextField(blank=True)
    receipt_number = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'rent_transactions'

    def __str__(self):
        return f"Transaction of {self.amount} for tenancy {self.tenancy.id}"


class Booking(models.Model):

    PAYMENT_STATUSES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'), 
        ('cancelled', 'Cancelled')
    ]

    BOOKING_STATUSES = [

        ('confirmed', 'Confirmed'),
        ('checked_in', 'Checked In'),
        ('checked_out', 'Checked Out'), ('cancelled', 'Cancelled')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property_unit_id = models.ForeignKey(PropertyUnit, on_delete=models.CASCADE, related_name="bookings")
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    check_in = models.DateTimeField()
    check_out = models.DateTimeField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUSES, default='pending')
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUSES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bookings'

    def __str__(self):
        return f"Booking by {self.guest.email} for {self.property_unit.unit_number}"



# class Sale(models.Model):
#     property_unit_id = models.OneToOneField(PropertyUnit, on_delete=models.CASCADE, related_name='sale')
#     buyer_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
#     sold_price = models.DecimalField(max_digits=12, decimal_places=2)
#     sold_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'sales'


