# syntax=docker/dockerfile:1

# Builder stage
FROM python:3.12-slim as builder

ENV POETRY_VERSION=1.8.2

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-root --no-dev

# Runtime stage
FROM python:3.12-slim as runtime

WORKDIR /app

COPY --from=builder /app/ /app/
COPY ./app ./app

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]