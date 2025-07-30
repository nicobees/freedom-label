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

## Docker Environments

The backend application can be run in two Docker environments: `test` and `prod`.

### Test Environment

To run the backend in the test environment, navigate to the `devops` directory and run:

```bash
docker-compose -f docker-compose.yml up -d backend
```

### Production Environment

To run the backend in the production environment, you can use the `update-app.sh` script located in the `devops` directory. This script will pull the latest version of the backend image from GHCR and restart the service.

To update to the latest version:

```bash
./devops/update-app.sh
```

To update to a specific version:

```bash
./devops/update-app.sh b-v1.2.3
```

#### Commands to handle docker images

docker build . -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:b-0.0.1

docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:b-0.0.1
