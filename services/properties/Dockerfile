FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /services

RUN apk add --no-cache gcc musl-dev postgresql-dev build-base linux-headers

RUN adduser -D appuser

# Copy services directory into /services (preserving folder structure)
COPY services/ /services/

# Install dependencies
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r /services/requirements.txt --root-user-action=ignore

# Collect static files (now using /services/properties/manage.py)
RUN python /services/properties/manage.py collectstatic --no-input

# Copy entrypoint script
COPY services/properties/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:9000", "properties.wsgi:application", "--chdir", "/services/properties"]
