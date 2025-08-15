#!/bin/sh

set -e

# Wait for the database to be ready
python /services/shared_scripts/wait_for_db.py

# Change to the Django project directory
cd /services/properties

# Run database migrations
python manage.py migrate --no-input

# Create a Django superuser if it doesn't exist
python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "adminpassword")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
EOF

# Start the app
exec "$@"