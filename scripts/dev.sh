#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "╔══════════════════════════════════════════╗"
echo "║   Agentic SmartWire — Dev Environment    ║"
echo "╚══════════════════════════════════════════╝"

# Check for .env
if [ ! -f .env ]; then
  echo "⚠  No .env file found. Copying from .env.example..."
  cp .env.example .env
  echo "   Please update .env with your credentials."
fi

# Start services
echo ""
echo "Starting Docker services..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

echo ""
echo "Waiting for backend health check..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "Backend is healthy!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "⚠  Backend health check timed out. Check logs with: docker compose logs server"
    exit 1
  fi
  sleep 2
done

echo ""
echo "═══════════════════════════════════════════"
echo "  Services running:"
echo "    Frontend:  http://localhost:5173"
echo "    Backend:   http://localhost:3001"
echo "    Postgres:  localhost:5433"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f server    # Server logs"
echo "    docker compose logs -f client    # Client logs"
echo "    docker compose down              # Stop all"
echo "═══════════════════════════════════════════"
