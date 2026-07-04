#!/bin/sh
set -e

echo "[entrypoint] Sincronizando esquema de base de datos..."
attempt=0
max_attempts=30

while [ "$attempt" -lt "$max_attempts" ]; do
  output=""
  if output=$(npx prisma db push --skip-generate 2>&1); then
    echo "$output"
    break
  fi

  attempt=$((attempt + 1))
  echo "$output"

  if echo "$output" | grep -q "P1000"; then
    echo "[entrypoint] ERROR: credenciales de PostgreSQL invalidas (P1000)."
    echo "[entrypoint] Verifica POSTGRES_PASSWORD y DATABASE_URL en .env"
    echo "[entrypoint] En el servidor ejecuta: bash scripts/repair-db-password.sh"
    exit 1
  fi

  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[entrypoint] La base de datos no respondio tras $max_attempts intentos."
    exit 1
  fi

  echo "[entrypoint] Base de datos no lista. Reintento $attempt/$max_attempts en 2s..."
  sleep 2
done

echo "[entrypoint] Iniciando INTEVOPEDI en el puerto ${PORT:-3000}..."
exec npm run start
