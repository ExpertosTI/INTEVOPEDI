#!/bin/bash
set -e

# Configuración del proyecto
STACK_NAME="intevopedi"
PROJECT_DIR="/opt/intevopedi"
REPO_URL="https://github.com/ExpertosTI/INTEVOPEDI.git"
SERVICE_NAME="${STACK_NAME}_app"

echo "🚀 Iniciando despliegue de $STACK_NAME..."

# 1. Sincronizar código via Git
if [ -d "$PROJECT_DIR" ]; then
    echo "📂 Actualizando repositorio..."
    cd "$PROJECT_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    echo "📂 Clonando repositorio..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 2. Construir imagen local (Swarm no tiene registry)
echo "🛠️  Construyendo imagen Docker..."
docker compose build

# 3. Asegurar que RenaceNet existe
docker network ls | grep RenaceNet > /dev/null || \
    docker network create --driver overlay RenaceNet

# 4. Desplegar stack
echo "🚢 Desplegando stack en Swarm..."
docker stack deploy -c docker-compose.yml $STACK_NAME

# 5. Forzar actualización para recoger la nueva imagen local
echo "🔄 Forzando actualización del servicio..."
docker service update --force $SERVICE_NAME 2>/dev/null || true

# 6. Limpieza
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ ¡Despliegue completado!"
echo "   → https://intevopedi.org"
echo "   → https://resultados.intevopedi.org"
