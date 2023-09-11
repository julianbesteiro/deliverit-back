#!/bin/sh

set -e

# Carga las variables de entorno desde el archivo .env
if [ -f .env ]; then
  echo "Cargando variables de entorno desde .env"
  source .env
fi

echo "Iniciando la aplicación"
exec "$@"