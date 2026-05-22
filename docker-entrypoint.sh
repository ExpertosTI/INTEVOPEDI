#!/bin/sh
set -e

# Sincroniza el esquema de la base de datos antes de arrancar la app.
# Reintenta porque en Swarm el servicio de BD puede tardar en estar listo.
echo "[entrypoint] Sincronizando esquema de base de datos..."
attempt=0
max_attempts=30
until npx prisma db push --skip-generate; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[entrypoint] La base de datos no respondió tras $max_attempts intentos. Se inicia la app de todos modos."
    break
  fi
  echo "[entrypoint] Base de datos no lista. Reintento $attempt/$max_attempts en 2s..."
  sleep 2
done

echo "[entrypoint] Iniciando INTEVOPEDI en el puerto ${PORT:-3000}..."
exec npm run start
