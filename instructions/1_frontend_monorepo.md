I am a software developer and I have to create a web application for an optical store.
I would like to use an Agentic AI service to help me create and boiler plate this application.
Hence I would like to ask you to create the best prompts and instructions for the Agentic AI which will create this application: this can be either Cursor Agent AI, or Copilot in agent mode, or Claude Code, or Gemini CLI.

Please base the instructions/prompts on the following application specs:

- web server written in Python, running on a Raspberry Pi 2 Model B
- python web server is written with the best frameworks/modules available in the market nowadays (2025) and with all the well known best practices
- web server exposes one POST endpoint called "print-label": it receives a JSON object and it calls method `print-label` of an internal "print" module (the print module is already existing so there is no need to be created)
- web server will run as a docker image, with docker-compose: docker image will be build by github pipeline, docker-compose will provide also fault tolerance and always running setup, in order to automatically restart the application in case of failures
- also docker-rollout will be used, in order to allow seamless update of the application without creating disruptions for the end user
- also Raspberry will be setup in order to automatically restart in case of failures
- web server also serves a web ui, which is written in React and Typescript
- React application is a simple UI with a form: User will fill the form and press on the Submit button, this will send the POST request to the `print-label` endpoint with the relative json body data
- also the Raspberry Pi will be exposed to the internet with openVPN: this will allow to have ssh access to the Raspberry Pi also from remote
- github will be setup with a manual pipeline to update the docker image with the latest version of the code: this pipeline will contact the Raspberry which is exposed throught openVPN in order to pull latest docker image and seamlessly update the running application
- all the code (python web server, React/Typescript frontend app, github pipelines and actions setup, docker and DevOps) will be included in the same monorepo
- for each application (both python server and React/Typescript frontend) the latest frameworks/tools/modules and best practices will be used: but also in terms of code style, format, linting (specific libraries and/or tools will be used to accomplish this)
- the overall application will run in two possible environments: development (local environment, i.e. laptop), production (Raspberry Pi)
- github will be used as remote repository and also for the pipelines and actions setup
