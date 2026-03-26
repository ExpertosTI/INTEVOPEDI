#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.portainer.yml"
ENV_FILE="$ROOT_DIR/.env"
ENV_EXAMPLE_FILE="$ROOT_DIR/.env.example"
STACK_NAME="${STACK_NAME:-intevopedi}"
APP_SERVICE="${STACK_NAME}_app"
BOOTSTRAP=0

if [[ "${1:-}" == "--bootstrap" ]]; then
  BOOTSTRAP=1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$ENV_EXAMPLE_FILE" ]]; then
    cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    echo "Se creó $ENV_FILE desde .env.example"
    echo "Edita .env con tus valores reales y vuelve a ejecutar deploy.sh"
    exit 1
  fi
  echo "Falta $ENV_FILE"
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Falta $COMPOSE_FILE"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker no está instalado"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

required_vars=(
  DATABASE_URL
  NEXT_PUBLIC_BASE_URL
  ADMIN_ACCESS_PASSWORD
  ADMIN_SESSION_SECRET
  PARTICIPANT_SESSION_SECRET
  POSTGRES_USER
  POSTGRES_PASSWORD
  POSTGRES_DB
  APP_HOST
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Falta la variable CRÍTICA $var_name en .env"
    exit 1
  fi
done

optional_vars=(
  SMTP_HOST
  SMTP_PORT
  SMTP_USER
  SMTP_PASS
  EMAIL_FROM
)

echo "Verificando variables opcionales de correo..."
for var_name in "${optional_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "AVISO: La variable de correo $var_name NO está definida en .env."
    echo "       Si ya funciona en el servidor, asegúrate de que no se sobrescriba con vacío."
  fi
done

placeholder_values=(
  change_me
  change_this_password
  change_this_admin_session_secret
  change_this_participant_secret
)

for placeholder in "${placeholder_values[@]}"; do
  if grep -Fq "$placeholder" "$ENV_FILE"; then
    echo "Tu .env todavía contiene valores de ejemplo. Reemplaza $placeholder antes de desplegar."
    exit 1
  fi
done

SWARM_STATE="$(docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || true)"
if [[ "$SWARM_STATE" != "active" ]]; then
  echo "Docker Swarm no está activo. Ejecuta: docker swarm init"
  exit 1
fi

if ! docker network inspect RenaceNet >/dev/null 2>&1; then
  echo "Creando red overlay RenaceNet"
  docker network create --driver overlay --attachable RenaceNet >/dev/null
fi

echo "Construyendo imagen de producción"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build

echo "Desplegando stack $STACK_NAME"
docker stack deploy -c "$COMPOSE_FILE" "$STACK_NAME"

echo "Forzando actualización del servicio para tomar nueva imagen..."
docker service update --force --image intevopedi-app:latest "$APP_SERVICE"

echo "Servicios actuales"
docker service ls

echo "Tareas del servicio app"
docker service ps "$APP_SERVICE" || true

if [[ "$BOOTSTRAP" -eq 1 ]]; then
  echo "Esperando contenedor app para bootstrap"
  APP_CONTAINER_ID=""
  for _ in {1..30}; do
    APP_CONTAINER_ID="$(docker ps --filter "label=com.docker.swarm.service.name=${APP_SERVICE}" --format '{{.ID}}' | head -n 1)"
    if [[ -n "$APP_CONTAINER_ID" ]]; then
      break
    fi
    sleep 2
  done

  if [[ -z "$APP_CONTAINER_ID" ]]; then
    echo "No se encontró un contenedor en ejecución para $APP_SERVICE"
    exit 1
  fi

  echo "Ejecutando prisma db push"
  PRISMA_PUSH_OK=0
  for _ in {1..15}; do
    if docker exec -i "$APP_CONTAINER_ID" npx prisma db push --skip-generate; then
      PRISMA_PUSH_OK=1
      break
    fi
    sleep 3
  done

  if [[ "$PRISMA_PUSH_OK" -ne 1 ]]; then
    echo "No se pudo ejecutar prisma db push correctamente"
    exit 1
  fi

  echo "Ejecutando seed"
  docker exec -i "$APP_CONTAINER_ID" npm run prisma:seed
fi

echo "Despliegue completado"
echo "URL esperada: https://$APP_HOST"
echo "Logs: docker service logs -f $APP_SERVICE"
