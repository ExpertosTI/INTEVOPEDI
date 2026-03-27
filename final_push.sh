#!/usr/bin/env bash
# Script para delegar el push al entorno del usuario (evita error 403)
# Ejecutar en la terminal de la Mac

echo "Empaquetando cambios y preparando push..."
git add .
if git diff --staged --quiet; then
    echo "No hay cambios pendientes para subir."
else
    git commit -m "Finalizando flujo de login por identificación y depuración de despliegue"
    echo "Subiendo a GitHub (origin main)..."
    git push origin main
fi
