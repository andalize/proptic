from django.core.management.base import BaseCommand
from core.models import Role
class Command(BaseCommand):
    help = 'Seed predefined roles into the Role table'

    def handle(self, *args, **kwargs):
        roles = [
            {'role_name': 'admin', 'display_name': 'Admin'},
            {'role_name': 'tenant', 'display_name': 'Tenant'},
            {'role_name': 'manager', 'display_name': 'Manager'},
            {'role_name': 'staff', 'display_name': 'Staff'},
            {'role_name': 'receptionist', 'display_name': 'Receptionist'},
        ]

        for role_data in roles:
            role, created = Role.objects.get_or_create(
                name=role_data['role_name'],
                defaults={'display_name': role_data['display_name']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Role "{role_data["role_name"]}" created.'))
            else:
                self.stdout.write(self.style.WARNING(f'Role "{role_data["role_name"]}" already exists.'))

        self.stdout.write(self.style.SUCCESS('Roles seeding completed.'))
