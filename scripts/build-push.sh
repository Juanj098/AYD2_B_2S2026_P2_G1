#!/usr/bin/env bash
# Construye las 4 imágenes y las publica en Amazon ECR.
# Requiere: docker, aws cli (con credenciales) y haber corrido `terraform apply`.
# Uso: ./scripts/build-push.sh [tag]     (por defecto: latest + hash corto de git)
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$(terraform -chdir="$RAIZ/terraform" output -raw ecr_registry)"
REGION="$(echo "$REGISTRY" | cut -d. -f4)"
PROYECTO="libreria-ayd"
TAG_GIT="$(git -C "$RAIZ" rev-parse --short HEAD)"
TAG="${1:-latest}"

echo ">> Login en $REGISTRY"
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$REGISTRY"

# carpeta del componente -> nombre del repositorio en ECR
for componente in frontend gateway libros-service ventas-service; do
  imagen="$REGISTRY/$PROYECTO/$componente"
  echo ">> Build $componente"
  docker build --platform linux/amd64 -t "$imagen:$TAG" -t "$imagen:$TAG_GIT" "$RAIZ/$componente"
  echo ">> Push $componente"
  docker push "$imagen:$TAG"
  docker push "$imagen:$TAG_GIT"
done

echo ">> Imágenes publicadas con tags $TAG y $TAG_GIT"
