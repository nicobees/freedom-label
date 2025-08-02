Please update the @docker-compose.yml file in order to accomplish the following features.
Also please updage the readme files @backend/README.md and @frontend/README.md with the proper documentation and instructions.

In summary, this is what we want to achieve:

- at the moment, both backend and frontend applications can be run in local environment for development purposes: the two readme files contains the correct instructions to run them, so please do not change anything about this
- additionally, both backend and frontend applications can run in two more ways, but using docker and docker-compose: local environment (`test` environment) and production environment (`prod` environment)
- the `prod` environment will be actually deployed in a Raspberry Pi 2 model B: but we want to verify that the "docker" approach is working even before the deploy in the Raspberry Pi, this is why we also want a `test` environment
- in both `test` and `prod`, we want to run the backend and frontend application using docker, docker-compose and docker rollout: in fact we want to have seamless updates of the applications with zero-downtime
- the two applications will be containerised inside their relative docker images and pushed in the GitHub Container Registry (GHCR) of the same repository
  - please update existing docker images in order to fulfill the new features
  - please create github actions and pipelines setup so that, when a new tag is pushed, then the relative docker image is created: consider updating existing github setup to accomplish the new features
  - two different semantic version numbers, and relative git tags, will be used for the backend and frontend applications: `b-x.y.z` will be used for backend, `f-x.y.z` will be used for frontend
- the applications update can be triggered in two ways:
  - manually:
    - admin user will connect to Raspberry Pi with ssh
    - run the `update-app.sh` script specifying the specific version (docker image tag, semantic version) as first argument of the shell script
    - the script will download the specific image from the GitHub Container Registry (GHCR)
    - the new image will be used to deploy the new version with docker rollout
    - please consider having separate images for the backend and the frontend applications, so that the two can be updated independently, they will also have two different semantic version numbers
  - automatically:
    - this will be done later on (nothing to do here at the moment)
- rename the @deploy folder into `devops` and put all the docker-compose, docker rollout setup files inside here, if you consider that is a good approach and is a best practice overall
- please update current github setup to accomplish the above features, if needed
