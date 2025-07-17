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

# Copy requirements first for better Docker layer caching
COPY properties/requirements.txt ./

# Install Python dependencies
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r requirements.txt --root-user-action=ignore

# Copy the rest of the application
COPY . /services/

# Create necessary directories and set permissions
RUN mkdir -p /vol/web/static /vol/web/media && \
    chown -R appuser:appuser /vol/web && \
    chown -R appuser:appuser /services

# Collect static files (manage.py should be at /services/properties/manage.py)
RUN python properties/manage.py collectstatic --no-input

# Make the entrypoint script executable
RUN chmod +x /services/properties/docker/entrypoint.sh

# Switch to the app user
USER appuser

# Expose port (for documentation, Render will map this)
EXPOSE 9000

# Entrypoint
ENTRYPOINT ["/services/properties/docker/entrypoint.sh"]

# Run Gunicorn server on container port 9000, binding to 0.0.0.0
CMD ["gunicorn", "--bind", "0.0.0.0:9000", "properties.wsgi:application", "--chdir", "/services/properties"]