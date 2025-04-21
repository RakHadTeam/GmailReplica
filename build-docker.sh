#!/bin/bash

# Get the container name and dockerfile path from parameters
CONTAINER_NAME=${1:-approject}
DOCKERFILE_PATH=${2:-Dockerfile}

docker build -t $CONTAINER_NAME --file $DOCKERFILE_PATH .
