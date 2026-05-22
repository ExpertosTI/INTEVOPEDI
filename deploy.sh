#!/bin/bash
set -euo pipefail

# Configuración del proyecto
STACK_NAME="intevopedi"
PROJECT_DIR="/opt/intevopedi"
REPO_URL="https://github.com/ExpertosTI/INTEVOPEDI.git"
SERVICE_NAME="${STACK_NAME}_app"

echo "Starting deploy for $STACK_NAME..."

if ! command -v git >/dev/null 2>&1; then
    echo "ERROR: git is not installed on this server."
    exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: docker is not installed on this server."
    exit 1
fi

if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "ERROR: neither 'docker compose' nor 'docker-compose' is available."
    exit 1
fi

# 1. Sincronizar código via Git
if [ -d "$PROJECT_DIR" ]; then
    echo "Updating repository..."
    cd "$PROJECT_DIR"
    if [ ! -d .git ]; then
        echo "ERROR: $PROJECT_DIR exists but is not a git repository."
        exit 1
    fi
    git fetch origin main
    git reset --hard origin/main
else
    echo "Cloning repository..."
    mkdir -p "$(dirname "$PROJECT_DIR")"
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 2. Construir imagen local (Swarm no tiene registry)
echo "Building Docker image..."
$COMPOSE_CMD build

# 3. Asegurar que RenaceNet existe
docker network ls | grep RenaceNet > /dev/null || \
    docker network create --driver overlay RenaceNet

# 4. Desplegar stack
echo "Deploying stack in Swarm..."
docker stack deploy -c docker-compose.yml $STACK_NAME

# 5. Forzar actualización para recoger la nueva imagen local
echo "Forcing service update..."
docker service update --force $SERVICE_NAME 2>/dev/null || true

# 6. Limpieza
echo "Pruning old images..."
docker image prune -f

echo "Deploy finished."
echo "Service status:"
docker service ls | grep "$STACK_NAME" || true

echo "Endpoints:"
echo "- https://intevopedi.org"
echo "- https://resultados.intevopedi.org"
