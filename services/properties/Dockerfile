# Use official Python image as base
FROM python:3.13-alpine

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies needed for psycopg2 and Django build steps
RUN apk add --no-cache gcc musl-dev postgresql-dev build-base linux-headers

# Create a non-root user for better security
RUN adduser -D appuser

# Copy requirements first for better Docker layer caching
COPY services/properties/requirements.txt ./

# Install Python dependencies
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r requirements.txt --root-user-action=ignore

# Copy the entire project
COPY . /app/

# Create necessary directories and set permissions
RUN mkdir -p /vol/web/static /vol/web/media && \
    chown -R appuser:appuser /vol/web && \
    chown -R appuser:appuser /app

# Collect static files (manage.py should be at /app/services/properties/manage.py)
RUN python services/properties/manage.py collectstatic --no-input

# Make the entrypoint script executable
# RUN chmod +x /app/entrypoint.sh

# Switch to the app user
USER appuser

# Expose port
EXPOSE 9000

# Entrypoint
# ENTRYPOINT ["/app/entrypoint.sh"]

# Run Gunicorn server
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-9000} properties.wsgi:application --chdir /app/services/properties"]