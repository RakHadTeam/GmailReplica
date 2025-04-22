#!/bin/bash
CONTAINER_NAME="approject-tests"
DOCKERFILE_PATH="Dockerfile.tests"

bash build-docker.sh $CONTAINER_NAME $DOCKERFILE_PATH

# Check if the container exists
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    docker rm $CONTAINER_NAME > /dev/null
fi

docker run -it --name $CONTAINER_NAME $CONTAINER_NAME:latest