# syntax=docker/dockerfile:1

FROM python:3.12-slim

WORKDIR /freedom-label-app

ENV DEBIAN_FRONTEND=noninteractive

# System build deps for Python C extensions + Pillow image libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    zlib1g-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libfreetype6-dev \
    libwebp-dev \
 && rm -rf /var/lib/apt/lists/*

ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV POETRY_VERSION=1.8.2

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-root --only main

COPY ./app ./app

RUN useradd --create-home appuser
RUN chown -R appuser:appuser /freedom-label-app/app/services/pdf_output
USER appuser

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
