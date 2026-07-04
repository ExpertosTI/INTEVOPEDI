#!/bin/bash
set -euo pipefail

# Configuración del proyecto
STACK_NAME="intevopedi"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$SCRIPT_DIR}"
REPO_URL="https://github.com/ExpertosTI/INTEVOPEDI.git"

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

wait_for_service() {
    local svc=$1
    local timeout=${2:-180}
    local elapsed=0

    while [ "$elapsed" -lt "$timeout" ]; do
        local replicas
        replicas=$(docker service ls --filter "name=${svc}" --format '{{.Replicas}}' | head -1 || true)
        if echo "$replicas" | grep -Eq '^[0-9]+/[0-9]+$' && [ "${replicas%%/*}" = "${replicas##*/}" ]; then
            echo "$svc converged ($replicas)"
            return 0
        fi
        echo "Waiting for $svc (${replicas:-unknown})..."
        sleep 5
        elapsed=$((elapsed + 5))
    done

    echo "WARNING: $svc did not converge within ${timeout}s"
    docker service ps "$svc" --no-trunc | tail -5 || true
    return 1
}

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

# 5. Forzar actualización para recoger las nuevas imágenes locales
echo "Forcing service update..."
for svc in app web-static; do
    docker service update --force --detach "${STACK_NAME}_${svc}" 2>/dev/null || true
done

echo "Waiting for services to converge..."
wait_for_service "${STACK_NAME}_app" 240 || true
wait_for_service "${STACK_NAME}_web-static" 240 || true

# 6. Limpieza
echo "Pruning old images..."
docker image prune -f

echo "Deploy finished."
echo "Service status:"
docker service ls | grep "$STACK_NAME" || true

echo "Endpoints:"
echo "- https://intevopedi.org"
echo "- https://resultados.intevopedi.org"
