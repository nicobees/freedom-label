# Backend Application

This is the backend application for the Freedom Label monorepo, built with FastAPI.

## Local Development Setup

To run the backend application locally, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Poetry (if you haven't already):**
    ```bash
    pip install poetry
    ```

3.  **Install project dependencies:**
    ```bash
    poetry install
    ```

4.  **Run the application:**
    ```bash
    poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The API will be accessible at `http://localhost:8000`.

## Running in Production (Docker Compose)

The backend application can be run as part of the Docker Compose setup for production.

1.  **Ensure you are in the project root directory:**
    ```bash
    cd /path/to/freedom-label
    ```

2.  **Build and run the Docker Compose services:**
    ```bash
    docker compose --profile=prod up -d api
    ```
    This will build the backend Docker image and start the API service. The API will be accessible via the UI service or directly if ports are exposed.
