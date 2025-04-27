#!/bin/bash
CONTAINER_NAME="approject"
IMAGE_NAME="approject"
DOCKERFILE_PATH="Dockerfile.prod"

CONTAINER_NAME="${1:-$CONTAINER_NAME}"

# Building the Docker image
bash build-docker.sh $IMAGE_NAME $DOCKERFILE_PATH

docker run -it $IMAGE_NAME
