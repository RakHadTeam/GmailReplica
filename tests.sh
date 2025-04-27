#!/bin/bash
IMAGE_NAME="approject-tests"
DOCKERFILE_PATH="Dockerfile.tests"

bash build-docker.sh $IMAGE_NAME $DOCKERFILE_PATH

docker run -it $IMAGE_NAME