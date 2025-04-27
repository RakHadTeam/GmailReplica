#!/bin/bash
CONTAINER_NAME="approject"
IMAGE_NAME="approject"
DOCKERFILE_PATH="Dockerfile.prod"
DOCKER_DATA_PATH="/usr/src/APProject/build/data"

CONTAINER_NAME="${1:-$CONTAINER_NAME}"

# Building the Docker image
bash build-docker.sh $IMAGE_NAME $DOCKERFILE_PATH

docker run -it -v ${PWD}/data:$DOCKER_DATA_PATH $IMAGE_NAME
