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

## Running in Production (Docker Compose)

The frontend application can be run as part of the Docker Compose setup for production.

1.  **Ensure you are in the project root directory:**
    ```bash
    cd /path/to/freedom-label
    ```

2.  **Build and run the Docker Compose services:**
    ```bash
    docker compose --profile=prod up -d ui
    ```
    This will build the frontend Docker image and start the UI service, accessible on port 80 (or as configured in `nginx.conf`).