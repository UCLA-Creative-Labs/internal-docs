# Backend CI/CD

This document will detail our CI/CD model for backend software. 

- [What is CI/CD](#What-is-CICD?)
- [Backend Continuous Integration](#Backend-Continuous-Integration)
  - [Mergify](#Mergify)
  - [ESLint](#ESLint)
- [Backend Continuous Deployment](#Backend-Continuous-Deployment)
  - [Docker](#Docker)
  - [Travis CI](#Travis-CI)
  - [SSH](#SSH)

## What is CI/CD?

CI/CD stands for Continuous Integration and Continuous Deployment. When you deploy
software, you want to always make sure you test your code to make sure all your new
changes are integrated with the existing code base.

* Continuous Integration (CI) the integration between pushed changes and the main repository.

* Continuous Deployment (CD) handles publishing your changes so that bug fixes 
and feature requests can be fulfilled. 

By nature, the continuous aspects of any CI/CD model requires the pipeline to be
automated. The core philosophy behind automating your integration and deployment
stems from the reality that the everyone is fallable to errors. By automating our
integration and deployment pipeline, we remove any human error from occuring and 
its also nice to do less work 😊

## Backend Continous Integration

We handle the Continuous Integration aspects of our backend software similar to
that of the frontend integration. 

### Mergify

Mergify is a great tool for managing production code. The idea is to rely on 
maintainers to validate and approve pull requests and let Mergify handle 
integrationg the changes into production. This way, no one directly touches 
`main`. 

Key Aspects:
- Mergify checks to see if the title follows conventional commits
- Mergify, by default, will squash merge changes onto master
- Mergify automatically merges Dependatbots PRs
- Mergify automatically dismisses stale reviews

See the [`.mergify.yml`](examples/.mergify.yml) file for more info.

### ESLint

We use ESLint for our TypeScript files (`**/*.ts`). ESLint has really fantastic 
functionality for linting JavaScript code so naturally we picked it as our linter 
for our code.

We use a linter because at the end of the day, we spend most of our time reading
code as opposed to writing code. Clean, consistent code reigns supreme.

Notable Linter Rules:
- no-console: dont litter 🗑
- single quotes: uniformity is key 
- 2 space indentation: we like skinny, readable code
- max line length 120: ^ 👍

See our documented [`.eslintrc.js`](examples/.eslintrc.js) and [`.eslintignore`](examples/.eslintignore) 
files for more info.

Remember to add a package script as follows:

```
// package.json
{
  ...
  "scripts": {
    ...
    "lint": "npx eslint '**/*.ts'"
    ...
  }
  ...
}
```

**Note:** We dont run `yarn lint` on `build` or `start`. This means you can avoid our linting rules during development (console logging 👀), and clean up your code when you make a pull request.

## Backend Continuous Deployment

Backend Continous Deployment is much harder than the frontend. Mostly because 
there doesn't exist a nifty service that can help you deploy to a Virtual
Private Server (VPS). A potential service is Heroku, but Heroku's builtin sleep
mechanic makes a lot of backend infrastructure a little cumbersome. 

🛑 IT IS RECOMMENDED TO MANUALLY DEPLOY SERVER CHANGES FOR SHORTER PROJECTS 🛑

The following outline would be relevant for long term projects where the overhead
of maintaining a pipeline is worth the labor.

### Docker

Docker is great industry standard tool that allows you to share, deploy and run 
applications, regardless of the environment. 

1. Obtain `docker` on your computer.

    You can follow the instructions on the docs website for more
    [information](https://docs.docker.com/get-docker/).

2. Login with the Creative Labs docker account.

    ```
    docker login
    ```

3. Create your Dockerfile

    Your Dockerfile will be different depending on your backend requirements.
    But here is a sample Dockerfile as a reference.

    ```dockerfile
    # Dockerfile

    # Pull from a base image
    FROM node:14-alpine

    # Copy the contents of the current directory to app/
    COPY . app/

    # Use app/ as the working directory to prevent any code manipulation
    WORKDIR app/

    # Install dependencies
    # Sometimes I see npm ci --only-production but yarn install is fine
    RUN yarn install

    # Make sure to set the NODE_ENV to production
    ENV NODE_ENV production

    # Open access to port 300
    EXPOSE 3000

    # Unleash your server to the world
    ENTRYPOINT yarn start
    ```

    **Note: make sure to call your Dockerfile, literally, `Dockerfile`**

    You can use this [`Dockerfile`](examples/Dockerfile) as a reference.

The rest of the Docker interactions will happen in relation to Travis. But, 
here is a list of good commands to remember when using Docker

| Command | Context | Action |
| --- | --- | --- |
| [`docker build`](https://docs.docker.com/engine/reference/commandline/build/) | Image | Build an image from a Dockerfile |
| [`docker tag`](https://docs.docker.com/engine/reference/commandline/tag/) | Image | Tags an image |
| [`docker images`](https://docs.docker.com/engine/reference/commandline/mages/) | Image | Lists images |
| [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/) | Container | List containers |
| [`docker system prune`](https://docs.docker.com/engine/reference/commandline/system_prune/) | Image/Container | Removed unused containers and images |
<br />

For more guidance on using Docker with Node.js check out this [guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

### Travis CI

Travis CI is a great tool for testing the integrity of your code. However, we will be 
using Travis to perform actions in response to every push to `main`.

Travis can be integrated to your GitHub repository and configured to programmatically
execute actions based on a [lifecyle](https://docs.travis-ci.com/user/job-lifecycle/).

| Phase | Description |
| --- | --- |
| `apt addons` | Install any add ons (Optional) |
| `cache components` | Install any cached components (Optional) |
| `before_install` | Runs before install |
| `install` | Install any dependencies required |
| `before_script` | Runs before build |
| `script` | run the build script |
| `before_cache` | Runs only if caching is effective (Optional) |
| `after_success`/`after_failure` | Runs on success/failure (Optional) |
| `before_deploy` | Runs before deployment |
| `deploy` | Deploy your code |
| `after_deploy` | Runs after deployment |
| `after_script` | Last phase to run |
<br />

In order to build out the CI/CD pipeline using Travis CI follow the following steps:

1. Create a `.travis.yml` file at the root of your repository

    ```sh
    # at root of repo
    touch .travis.yml
    ```

2. Set up the basics for your Travis file.

    ```yml
    language: node_js

    node_js: 
      - '14'

    # Start the docker engine for building docker images
    services:
      - docker

    # Only if you have your server in a subdirectory
    before_install:
      - cd server

    # Install dependencies
    install:
      - yarn install

    # Only run if you have tests
    script:
      - yarn test

    # Build Docker image and deploy to instance
    deploy:
      provider: script
      script: bash deploy.sh
      on: 
        branch: main
    ```

3. Build our your `deploy.sh` script

    Every deploy script will look different depending on the Virtual Private Server
    provider, but this should be the most generic version you can use.

    ```sh
    #!/bin/bash

    set -e

    echo "Starting build..."

    IMAGE="<account_name>/<repo_name>"
    GIT_VERSION=$(git describe --always --abbrev --tags --long)

    docker build -t ${IMAGE}:${GIT_VERSION} .
    docker tag ${IMAGE}:${GIT_VERSION} ${IMAGE}:latest

    echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
    docker push ${IMAGE}:${GIT_VERSION}

    ssh -o StrictHostKeyChecking=no\
      <username>@${INSTANCE}\
        "sudo docker stop current-container &&\
        sudo docker rm current-container &&\
        sudo docker run --name=current-container --restart unless-stopped -d -p 80:3000 ${IMAGE}:${GIT_VERSION} &&\
        sudo docker system prune -a -f"
    ```
**Note: Make sure you add the travis environement variables in the ${...}**

### SSH

Let's be real. None of us really learned how `ssh` worked in CS 35L. But the 
commands to generate a key for your instance is not too hard and will be outlined
below.

1. Install the `travis` CLI.
    
    The first thing you need to do is install obtain the `travis` cli.
    ```sh
    # Mac
    brew install travis

    # Linux
    gem install travis --no-document

    # Windows
    gem install travis
    ```
    For more info checkout the [documentation](https://github.com/travis-ci/travis.rb#installation)

2. Generate an encrypted ssh key

    Make sure there is a `.travis.yml` file in the root of the project directory.

    ```sh
    ssh-keygen -t rsa -b 4096 -C 'build@travis-ci.org' -f ./deploy_rsa
    travis encrypt-file deploy_rsa --add
    ssh-copy-id -i deploy_rsa.pub <username>@<ip_address>
    rm -f deploy_rsa deploy_rsa.pub
    git add deploy_rsa.enc
    ```

3. Customize the Travis commands

    The above commands do most of the heavy work in terms of adding a `ssh` key to 
    allow Travis to `ssh` into any instance. But we can customize the Travis
    commands to prevent the `ssh` key never gets deployed.

    ```yml
    before_deploy:
      - openssl aes-256-cbc -K $encrypted_<...>_key -iv $encrypted_<...>_iv -in deploy_rsa.enc -out /tmp/deploy_rsa -d
      - eval "$(ssh-agent -s)"
      - chmod 600 /tmp/deploy_rsa
      - ssh-add /tmp/deploy_rsa
    ```

4. Keep variables secret

    If you are looking to save access keys are other private variables, utilize the
    `travis encrypt` command to encrypt your secrets into the PATH environment.

    ```sh
    travis encrypt KEEP_ME_SAFE="superSecretPassword" --add
    ```
  
    And then to add the following script to add your configuration to the
    `~/.aws/credentials` file

    `scripts/credentials.sh`
    ```sh
    #!/bin/bash

    mkdir -p ~/.aws

    cat > ~/.aws/credentials << EOL
    [default]
    aws_access_key_id = ${AWS_ACCESS_KEY_ID}
    aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}
    EOL
    ```

    Then, add the script to your before_install script

    ```yml
    before_install:
      - bash scripts/credentials.sh
    ```

For more guidance on deploying with Travis, checkout this amazing [blog post](https://dev.to/gortron/deploying-to-aws-with-travis-via-ssh-315a).
