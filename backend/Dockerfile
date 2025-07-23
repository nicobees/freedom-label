
# syntax=docker/dockerfile:1

FROM python:3.12-slim as builder

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-dev --no-root

FROM python:3.12-slim as runtime

WORKDIR /app

COPY --from=builder /app/ /app/

COPY . ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
