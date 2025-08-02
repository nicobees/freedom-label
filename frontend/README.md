# Frontend Application

This is the frontend application for the Freedom Label monorepo, built with React and Vite.

## Local Development Setup

To run the frontend application locally, follow these steps:

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).
    It will automatically proxy API requests to the backend running on port 8000.

## Docker Environments

The frontend application can be run in two Docker environments: `test` and `prod`.

### Test Environment

To run the frontend in the test environment, navigate to the `devops` directory and run:

```bash
docker-compose -f docker-compose.yml up -d frontend
```

#### Commands to handle docker images

docker build . -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_FRONTEND:f-0.0.1

docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_FRONTEND:f-0.0.1
