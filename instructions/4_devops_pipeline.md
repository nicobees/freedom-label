Given this User Story between ```, please implement GitHub pipeline file/s.
Please consider always the best practices and the official documentation about GitHub pipelines, other than search on the web.

If User Story specifies also some technical details, then please strictly follow those instructions during the practical implementation of the code.

```
As a DevOps and Maintainer User, I want GitHub pipelines that will allow to automatically verify, test and build the Backend application to be run in Production environment.

The Production environment is the Raspberry Pi 2 Model B (32-bit lite Bookworm OS).

### Acceptance Criteria

- [ ] 1. create basic job "verify" in GitHub pipeline: it triggers on push to every branch, it consists of lint and type check steps
- [ ] 2. add another job "test": it triggers on push to every branch, it consists of test running
- [ ] 3. add another job "build": it triggers when pushing a tag (only) in main branch, it consists of docker image build and push to GitHub Container Registry, using the tag value as the VERSION value for the image
- [ ] 4. add another job "release": it triggers manually passing the semantic value of the tag to be released, it consists of connecting through ssh to the Production environment (Raspberry Pi 2) and updating running Backend application (docker compose and or docker rollout)

### Technical details

1. lint steps is handled with `poetry run ruff check .`
2. type check step is handled with `poetry run mypy .`
3. test job is handled with `poetry run pytest`: at the moment please comment this job since the tests are already failing
4. please use the following format for the docker image name/tag: `ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_BACKEND}:{VERSION}`. All the variables has to be setup in the pipelines settings and in secrets: please also add detailed instructions (with also references to official documentation when possible, for brevity as well) in @packages/devops/README.md file
5. for the "release" job, please also add specific instructions on how to access, through ssh, the Production environment remotely: this is Raspberry Pi 2 model B, and the service Raspberry Pi Connect will be used (please see here https://www.raspberrypi.com/documentation/services/connect.html for official documentation). Also setup authentication for this service in GitHub pipelines and add instructions on how to do this.
```
