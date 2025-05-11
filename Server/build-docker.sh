#!/bin/bash

# Get the container name and dockerfile path from parameters
IMAGE_NAME=${1:-approject}
DOCKERFILE_PATH=${2:-Server/Dockerfile}

docker build -t $IMAGE_NAME --file $DOCKERFILE_PATH .
