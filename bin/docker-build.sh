#!/bin/bash

./bin/build.sh

# Build the frontend image
docker build -t zackmattor/manchester-pong-frontend:latest -f DockerfileFrontend .
docker tag zackmattor/manchester-pong-frontend:latest zackmattor/manchester-pong-frontend:$CIRCLE_SHA1
docker push zackmattor/manchester-pong-frontend:$CIRCLE_SHA1
docker push zackmattor/manchester-pong-frontend:latest

# Build the backend image
docker build -t zackmattor/manchester-pong-backend:latest -f DockerfileBackend .
docker tag zackmattor/manchester-pong-backend:latest zackmattor/manchester-pong-backend:$CIRCLE_SHA1
docker push zackmattor/manchester-pong-backend:$CIRCLE_SHA1
docker push zackmattor/manchester-pong-backend:latest

