#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "╔══════════════════════════════════════════╗"
echo "║   Database Reset                         ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "⚠  This will destroy all data in the local database."
read -p "Are you sure? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Stopping services..."
docker compose down

echo "Removing postgres volume..."
docker volume rm agentic-smartwire_postgres-data 2>/dev/null || true

echo "Recreating database and running migrations..."
docker compose up postgres flyway --build -d
docker compose up postgres flyway

echo ""
echo "Database reset complete. Run './scripts/dev.sh' to start all services."
