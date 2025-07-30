# syntax=docker/dockerfile:1

FROM python:3.12-slim

WORKDIR /app

ENV POETRY_VIRTUALENVS_IN_PROJECT=true

ENV POETRY_VERSION=1.8.2

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-root --only main --no-dev

COPY ./app ./app

RUN useradd --create-home appuser
RUN chown -R appuser:appuser /app/app/print/output
USER appuser

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
