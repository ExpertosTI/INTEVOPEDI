#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STACK_NAME="${STACK_NAME:-intevopedi}"
DB_SERVICE="${STACK_NAME}_db"
NETWORK="${STACK_NAME}_intevopedi_internal"

if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
else
  echo "ERROR: Missing $ROOT/.env"
  exit 1
fi

urlencode() {
  python3 - <<'PY' "$1"
import sys, urllib.parse
print(urllib.parse.quote(sys.argv[1], safe=""))
PY
}

sync_database_url() {
  local encoded
  encoded=$(urlencode "$POSTGRES_PASSWORD")
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${encoded}@db:5432/${POSTGRES_DB}?schema=public"
}

db_container_id() {
  docker ps -q -f "name=${DB_SERVICE}" | head -1
}

sync_database_url

echo "Repairing PostgreSQL password for user: $POSTGRES_USER"

container="$(db_container_id)"
if [ -z "$container" ]; then
  echo "ERROR: Database container for $DB_SERVICE is not running."
  exit 1
fi

docker exec "$container" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 \
  -c "ALTER USER \"${POSTGRES_USER}\" WITH PASSWORD '${POSTGRES_PASSWORD}';"

echo "Testing network authentication..."
docker run --rm --network "$NETWORK" \
  -e PGPASSWORD="$POSTGRES_PASSWORD" \
  postgres:16-alpine \
  psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'SELECT 1 AS ok;'

echo ""
echo "Password aligned. Ensure .env contains:"
echo "POSTGRES_PASSWORD=\"${POSTGRES_PASSWORD}\""
echo "DATABASE_URL=\"${DATABASE_URL}\""
echo ""
echo "Redeploy with: bash deploy.sh"
