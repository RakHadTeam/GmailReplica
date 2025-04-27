#!/bin/bash
CONTAINER_NAME="approject"
IMAGE_NAME="approject"
DOCKERFILE_PATH="Dockerfile.prod"

CONTAINER_NAME="${1:-$CONTAINER_NAME}"

read -p "Rebuild docker image ${IMAGE_NAME}? [y/N] "
if [[ "$REPLY" =~ "y" ]]; then
	echo "Rebuilding..."
	bash build-docker.sh "$IMAGE_NAME" "$DOCKERFILE_PATH"

	# Check if the container exists
	if docker ps -aq -f "name=^/${CONTAINER_NAME}$" | grep -q .; then
		echo "Container $CONTAINER_NAME already exists. Stopping and removing..."
		docker stop "$CONTAINER_NAME" > /dev/null
		docker rm "$CONTAINER_NAME" > /dev/null
	fi
else
	echo "Skipping build."
fi

# Check if the container exists
if docker ps -aq -f "name=^/${CONTAINER_NAME}$" | grep -q .; then
	echo "Container $CONTAINER_NAME already exists. Running..."

	docker start "$CONTAINER_NAME" > /dev/null

	echo "Running ./APProjectExecutable in the container..."
	docker exec -it "$CONTAINER_NAME" ./APProjectExecutable
else
	echo "Container $CONTAINER_NAME does not exist. Creating a new one."
	echo "Running ./APProjectExecutable in the container..."
	docker run -it --name "$CONTAINER_NAME" "$IMAGE_NAME:latest"
fi
