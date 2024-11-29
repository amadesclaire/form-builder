#!/bin/bash

set -e

# Variables
CONTAINER_NAME="mongodb"
MONGO_IMAGE="mongo"
MONGO_PORT="27017"
MONGO_VOLUME="mongodb_data"
ADMIN_USER="admin"
ADMIN_PASS="password123"
APP_USER="appUser"
APP_PASS="appPassword123"
APP_DB="testDB"

# Stop and remove any existing MongoDB container
echo "Removing existing container '${CONTAINER_NAME}' if it exists..."
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

# Remove existing volume if needed
if docker volume ls --format '{{.Name}}' | grep -Eq "^${MONGO_VOLUME}\$"; then
  echo "Removing existing volume '${MONGO_VOLUME}'..."
  docker volume rm "$MONGO_VOLUME" >/dev/null 2>&1 || true
fi

# Start MongoDB container without authentication
echo "Starting MongoDB container without authentication..."
docker run --name "$CONTAINER_NAME" -d \
  -p "$MONGO_PORT:27017" \
  -v "$MONGO_VOLUME:/data/db" \
  "$MONGO_IMAGE"

# Wait for MongoDB to start
echo "Waiting for MongoDB to initialize..."
sleep 5

# Create admin user
echo "Creating admin user..."
docker exec -i "$CONTAINER_NAME" mongosh <<EOF
use admin;
db.createUser({
  user: "$ADMIN_USER",
  pwd: "$ADMIN_PASS",
  roles: [{ role: "root", db: "admin" }]
});
EOF

# Restart MongoDB container with authentication enabled
echo "Restarting MongoDB container with authentication enabled..."
docker stop "$CONTAINER_NAME"
docker rm -f "$CONTAINER_NAME"
docker run --name "$CONTAINER_NAME" -d \
  -p "$MONGO_PORT:27017" \
  -v "$MONGO_VOLUME:/data/db" \
  "$MONGO_IMAGE" --auth

# Wait for MongoDB to restart
echo "Waiting for MongoDB to restart with authentication..."
sleep 5

# Create application-specific user
echo "Creating application user..."
docker exec -i "$CONTAINER_NAME" mongosh -u "$ADMIN_USER" -p "$ADMIN_PASS" --authenticationDatabase admin <<EOF
use $APP_DB;
db.createUser({
  user: "$APP_USER",
  pwd: "$APP_PASS",
  roles: [{ role: "readWrite", db: "$APP_DB" }]
});
EOF

echo "MongoDB setup complete!" 

echo "To login as admin user, use the following command:"
echo "docker exec -it $CONTAINER_NAME mongo -u $ADMIN_USER -p $ADMIN_PASS --authenticationDatabase admin"
echo "To login as application user, use the following command:"
echo "docker exec -it $CONTAINER_NAME mongo -u $APP_USER -p $APP_PASS --authenticationDatabase $APP_DB"