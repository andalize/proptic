# Use official Python image as base
FROM python:3.13-alpine

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /services

# Install dependencies needed for psycopg2 and Django build steps
RUN apk add --no-cache gcc musl-dev postgresql-dev build-base linux-headers

# Create a non-root user for better security
RUN adduser -D appuser

# Copy everything from build context (./services) to container /services
COPY . /services/

# Install Python dependencies
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r requirements.txt --root-user-action=ignore

# Collect static files (manage.py is at /services/manage.py now)
RUN python manage.py collectstatic --no-input

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Switch to the app user
USER appuser

# Entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Run Gunicorn server on container port 9000, binding to 0.0.0.0
CMD ["gunicorn", "--bind", "0.0.0.0:9000", "properties.wsgi:application", "--chdir", "/services"]
