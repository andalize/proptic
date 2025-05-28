# Use a lightweight Python image
FROM python:3.13-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /services

# Install system dependencies needed for psycopg2
RUN apk add --no-cache gcc musl-dev postgresql-dev

RUN apk add --no-cache build-base linux-headers


# Install Python dependencies
COPY ./apartments/requirements.txt /services/
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r requirements.txt --root-user-action=ignore

# Copy app files into container
COPY . /services/

CMD ["sh", "-c", "python /services/shared_scripts/wait_for_db.py && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:9000"]
