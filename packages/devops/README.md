# packages/devops

This package handles the DevOps setup, configuration and runtime for the project.
It is also connected to the `.github` folder where usually the pipeline configuration for GitHub are stored.

## Main commands

start up service: `docker compose up [service]`

shut down service: `docker compose down [service]`

get container list: `docker container list`

get inside container shell (get container id from previous command): `docker exec -it [container id] sh`
