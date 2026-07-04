#!/bin/bash
set -euo pipefail

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

load_env() {
  set -a
  for env_file in "/root/.env" "$PROJECT_DIR/.env"; do
    if [ -f "$env_file" ]; then
      # shellcheck disable=SC1090
      source "$env_file"
      echo "Loaded env: $env_file"
    fi
  done
  set +a

  export NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL:-https://intevopedi.org}"
  export APP_HOST="${APP_HOST:-intevopedi.org}"
}

validate_env() {
  load_env
  local missing=()
  for var in DATABASE_URL POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB ADMIN_ACCESS_PASSWORD ADMIN_SESSION_SECRET PARTICIPANT_SESSION_SECRET; do
    if [ -z "${!var:-}" ]; then
      missing+=("$var")
    fi
  done

  if [ "${#missing[@]}" -gt 0 ]; then
    echo "ERROR: Missing required env vars: ${missing[*]}"
    echo "Create $PROJECT_DIR/.env from .env.example before deploying."
    exit 1
  fi
}

service_replicas() {
  local svc=$1
  docker service ls --format '{{.Name}} {{.Replicas}}' 2>/dev/null \
    | awk -v name="$svc" '$1 == name { print $2; exit }'
}

print_service_diagnostics() {
  local svc=$1
  echo "--- Tasks: $svc ---"
  docker service ps "$svc" --no-trunc 2>/dev/null | tail -8 || true
  echo "--- Logs: $svc ---"
  docker service logs "$svc" --tail 40 2>&1 || true
}

wait_for_service() {
  local svc=$1
  local timeout=${2:-300}
  local elapsed=0
  local replicas=""

  while [ "$elapsed" -lt "$timeout" ]; do
    replicas=$(service_replicas "$svc" || true)

    if [ "$replicas" = "1/1" ]; then
      local running
      running=$(docker service ps "$svc" --filter desired-state=running --format '{{.CurrentState}}' 2>/dev/null | head -1 || true)
      if echo "$running" | grep -q "Running"; then
        echo "$svc converged ($replicas)"
        return 0
      fi
    fi

    echo "Waiting for $svc (${replicas:-unknown})..."
    sleep 5
    elapsed=$((elapsed + 5))
  done

  echo "ERROR: $svc did not converge within ${timeout}s (last state: ${replicas:-unknown})"
  print_service_diagnostics "$svc"
  return 1
}

update_service_image() {
  local svc=$1
  local image=$2

  echo "Updating $svc -> $image"
  docker service update \
    --image "$image" \
    --force \
    --detach=false \
    --update-order stop-first \
    --update-parallelism 1 \
    --update-delay 5s \
    "$svc"
}

health_check() {
  local url="${NEXT_PUBLIC_BASE_URL:-https://intevopedi.org}"
  local code=""

  echo "Health check: $url"
  code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 20 "$url" || true)
  if echo "$code" | grep -Eq '^(200|301|302|307|308)$'; then
    echo "Health check OK (HTTP $code)"
    return 0
  fi

  echo "WARNING: $url returned HTTP ${code:-000}"
  return 1
}

assert_stack_healthy() {
  local failed=0
  for svc in db app web-static; do
    local full_name="${STACK_NAME}_${svc}"
    local replicas
    replicas=$(service_replicas "$full_name" || true)
    if [ "$replicas" != "1/1" ]; then
      echo "ERROR: $full_name is $replicas (expected 1/1)"
      print_service_diagnostics "$full_name"
      failed=1
    fi
  done

  if [ "$failed" -ne 0 ]; then
    exit 1
  fi
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
  git clone "$REPO_URL" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
fi

validate_env

echo "Deploying commit: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

# 2. Construir imagen local (Swarm no recoge :latest sin update explícito)
echo "Building Docker images..."
$COMPOSE_CMD build

# 3. Asegurar que RenaceNet existe
if ! docker network ls --format '{{.Name}}' | grep -qx RenaceNet; then
  echo "Creating overlay network RenaceNet..."
  docker network create --driver overlay --attachable RenaceNet
fi

# 4. Desplegar stack (config + env)
echo "Deploying stack in Swarm..."
docker stack deploy -c docker-compose.yml "$STACK_NAME"

echo "Waiting for database..."
wait_for_service "${STACK_NAME}_db" 180

# 5. Actualizar imágenes de forma secuencial (evita carrera 0/1)
update_service_image "${STACK_NAME}_app" "intevopedi-app:latest"
wait_for_service "${STACK_NAME}_app" 300

update_service_image "${STACK_NAME}_web-static" "intevopedi-static:latest"
wait_for_service "${STACK_NAME}_web-static" 180

# 6. Verificación final (después del rolling update real)
sleep 5
assert_stack_healthy
health_check || true

# 7. Limpieza solo si el stack quedó sano
echo "Pruning dangling images..."
docker image prune -f

echo "Deploy finished."
echo "Service status:"
docker service ls | grep "$STACK_NAME" || true

echo "Endpoints:"
echo "- https://intevopedi.org"
echo "- https://resultados.intevopedi.org"
