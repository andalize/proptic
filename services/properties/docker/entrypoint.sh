#!/bin/sh
python /services/shared_scripts/wait_for_db.py
python manage.py migrate --no-input
exec "$@"
