FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /services

RUN apk add --no-cache gcc musl-dev postgresql-dev build-base linux-headers

RUN adduser -D appuser

COPY ./properties/requirements.txt /services/
RUN pip install --upgrade pip --root-user-action=ignore && \
    pip install -r requirements.txt --root-user-action=ignore

COPY . /services/

# Collect static files
RUN python ./properties/manage.py collectstatic --no-input

COPY ./properties/docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

USER appuser

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:9000", "properties.wsgi:application"]
