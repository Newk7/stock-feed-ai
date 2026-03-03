#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

ENV="${1:-prod}"

echo "╔══════════════════════════════════════════╗"
echo "║   Agentic SmartWire — Deploy ($ENV)      ║"
echo "╚══════════════════════════════════════════╝"

# Validate env file
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example and configure it."
  exit 1
fi

case "$ENV" in
  prod|production)
    echo "Deploying production stack..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
    echo ""
    echo "Production deployment complete."
    echo "  Frontend:  http://localhost:5173"
    echo "  Backend:   http://localhost:3001"
    ;;

  dev|development)
    echo "Deploying development stack..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
    echo ""
    echo "Development deployment complete."
    ;;

  build)
    echo "Building production images..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml build
    echo ""
    echo "Images built. Push to your container registry:"
    echo "  docker compose push"
    ;;

  down)
    echo "Stopping all services..."
    docker compose down
    echo "Services stopped."
    ;;

  *)
    echo "Usage: $0 {prod|dev|build|down}"
    exit 1
    ;;
esac
