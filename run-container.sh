#!/bin/bash
CONTAINER_NAME="approject"

bash build-docker.sh

# Check if the container exists
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Container '$CONTAINER_NAME' exists. Removing..."
    docker rm $CONTAINER_NAME > /dev/null
fi

docker run -it --name approject approject:latest