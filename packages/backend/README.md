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

4.  **Provide the logo image**

    Change your logo image at `packages/backend/app/services/create/img/logo.png`

    This image will be used in the generated PDF labels and should be relative to your organisation/project.

5.  **Run the application:**
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

#### Commands to handle docker images

docker build . -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:b-0.0.1

docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:b-0.0.1
