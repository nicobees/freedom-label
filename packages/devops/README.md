# packages/devops

This package handles the DevOps setup, configuration and runtime for the project.
It is also connected to the `.github` folder where usually the pipeline configuration for GitHub are stored.

## Main commands

start up service: `docker compose up [service]`

shut down service: `docker compose down [service]`

get container list: `docker container list`

get inside container shell (get container id from previous command): `docker exec -it [container id] sh`

## GitHub Actions

### Container Registry Authentication

To allow GitHub Actions to push and pull images from the GitHub Container Registry, you need to authenticate.

1.  **Create a Personal Access Token (PAT):**
    *   Go to your GitHub **Settings** > **Developer settings** > **Personal access tokens**.
    *   Generate a new token with the `write:packages` and `read:packages` scopes.
2.  **Add the PAT as a Repository Secret:**
    *   In your repository, go to **Settings** > **Secrets and variables** > **Actions**.
    *   Create a new repository secret named `CR_PAT` and paste your PAT as the value.
3.  **Use the Secret in your Workflow:**
    *   In your workflow file (e.g., `.github/workflows/backend_cicd.yml`), use the secret to log in to the container registry.

    ```yaml
    - name: Log in to the Container registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.CR_PAT }}
    ```

### Manually Triggering a Pipeline

Pipelines that are configured with the `workflow_dispatch` event can be triggered manually.

1.  Go to the **Actions** tab in your GitHub repository.
2.  Select the workflow you want to run from the list on the left.
3.  You will see a message "This workflow has a `workflow_dispatch` event trigger."
4.  Click the **Run workflow** dropdown button.
5.  You can select the branch and provide any optional inputs, then click **Run workflow**.
