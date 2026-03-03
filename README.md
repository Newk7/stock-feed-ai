# Agentic SmartWire

AI-powered market intelligence platform combining real-time news aggregation, sentiment analysis, and financial data visualization. Inspired by the content depth of Seeking Alpha and the data density of Finviz.

## Architecture

```
agentic-smartwire/
├── client/          React + Vite + Tailwind (TypeScript)
├── server/          Express.js REST API (TypeScript)
├── db/migrations/   Flyway SQL migrations (PostgreSQL)
├── scripts/         Dev, deploy, and DB reset scripts
├── docker-compose.yml
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

### Services

| Service    | Port  | Description                              |
|------------|-------|------------------------------------------|
| **client** | 5173  | React frontend with dark-theme dashboard |
| **server** | 3001  | Express.js API with S3 + PostgreSQL      |
| **postgres** | 5433 | PostgreSQL 16 (mapped to host 5433)     |
| **flyway** | —     | Runs DB migrations on startup            |

### Data Flow

```
S3 Bucket (manifest JSON files)
    │
    ▼
Express API ──► PostgreSQL (cache + user data)
    │
    ▼
React Frontend (dashboard, news feed, screener)
```

- **S3 manifests** contain the actual news articles, market data, and task results produced by upstream agents
- **PostgreSQL** stores user accounts, cached articles, watchlists, saved items, and task metadata — serves as redundancy for data loss mitigation
- **Firebase** handles authentication (Google, GitHub, email/password)

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local dev without Docker)
- A Firebase project with Authentication enabled
- AWS S3 credentials (or S3-compatible endpoint)

### 1. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# PostgreSQL
POSTGRES_USER=smartwire
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=smartwire

# S3
AWS_ENDPOINT_URL=https://s3.amazonaws.com
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET=agentic-smartwire

# Firebase (Backend - Admin SDK)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase (Frontend - Client SDK)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2. Start Development

```bash
# Docker (recommended)
./scripts/dev.sh

# Or manually
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The dev script will:
1. Copy `.env.example` if no `.env` exists
2. Start all services with Docker Compose
3. Wait for the backend health check
4. Print service URLs

### 3. Open the App

- **Frontend:** http://localhost:5173
- **API Health:** http://localhost:3001/api/health

## Development

### Local Development (without Docker)

```bash
# Install all dependencies
npm run install:all

# Terminal 1: Start PostgreSQL via Docker
docker compose up postgres flyway -d

# Terminal 2: Start server
cd server && npm run dev

# Terminal 3: Start client
cd client && npm run dev
```

### Project Commands

```bash
npm run dev              # Start full stack via Docker (dev mode)
npm run docker:up        # Docker Compose up with build
npm run docker:down      # Stop all services
npm run docker:dev       # Dev mode with volume mounts
npm run docker:prod      # Production deployment
npm run db:reset         # Reset database (destroys all data)
npm run client:dev       # Start client only
npm run server:dev       # Start server only
npm run install:all      # Install deps for root, client, and server
```

### Deployment Scripts

```bash
./scripts/dev.sh         # Start dev environment
./scripts/deploy.sh prod # Deploy production stack
./scripts/deploy.sh dev  # Deploy dev stack
./scripts/deploy.sh build # Build production images
./scripts/deploy.sh down # Stop all services
./scripts/db-reset.sh    # Reset database with confirmation prompt
```

## Database

### Migrations (Flyway)

Migrations live in `db/migrations/` and follow the Flyway naming convention:

| Migration | Description |
|-----------|-------------|
| V1 | `app_user` table (Firebase UID, email, role, preferences) |
| V2 | `task` table (S3 manifest job tracking) |
| V3 | `news_article` table (cached articles with sentiment, tickers, sectors) |
| V4 | `manifest_cache` table (S3 manifest JSON cache with 24h TTL) |
| V5 | `watchlist` and `saved_article` tables (user personalization) |

Flyway runs automatically on startup via Docker Compose. To add a new migration, create `db/migrations/V6__description.sql`.

### Manual Flyway

```bash
# Run migrations against local DB
docker compose run --rm flyway \
  -url=jdbc:postgresql://postgres:5432/smartwire \
  -user=smartwire \
  -password=smartwire_dev \
  migrate
```

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check with DB status |
| GET | `/api/news` | List articles (query: category, sector, ticker, sentiment, limit, offset) |
| GET | `/api/news/trending` | Trending articles (last 24h) |
| GET | `/api/news/sectors` | Articles grouped by sector |
| GET | `/api/news/categories` | List all categories |
| GET | `/api/news/:id` | Single article |

### Authenticated

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Upsert user on Firebase login |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/preferences` | Update user preferences |
| GET | `/api/manifests` | List cached manifests |
| GET | `/api/manifests/fetch?key=` | Fetch manifest from S3 |
| POST | `/api/manifests/sync` | Sync manifests from S3 prefix |
| GET | `/api/manifests/keys?prefix=` | List S3 keys |
| GET | `/api/watchlists` | Get user watchlists |
| POST | `/api/watchlists` | Create watchlist |
| PATCH | `/api/watchlists/:id` | Update watchlist tickers |
| DELETE | `/api/watchlists/:id` | Delete watchlist |
| GET | `/api/watchlists/saved` | Get saved articles |
| POST | `/api/watchlists/saved/:articleId` | Save an article |

### Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/role` | Update user role |

### Dev Mode Auth

In development, use `Authorization: Bearer dev-token` to bypass Firebase authentication. This creates a dev user with admin privileges.

## S3 Manifest Format

The application expects JSON manifests in S3 with this structure:

```json
{
  "id": "manifest-2025-02-24-001",
  "type": "news",
  "tracking_id": "task-abc123",
  "articles": [
    {
      "title": "Article Title",
      "summary": "Brief summary...",
      "content": "Full article content...",
      "source": "Reuters",
      "author": "Author Name",
      "category": "Earnings",
      "sector": "Technology",
      "tickers": ["NVDA", "AMD"],
      "sentiment": "bullish",
      "sentiment_score": 0.85,
      "image_url": "https://...",
      "source_url": "https://...",
      "published_at": "2025-02-24T14:30:00Z",
      "metadata": {}
    }
  ],
  "metadata": {
    "generated_at": "2025-02-24T15:00:00Z",
    "agent": "news-aggregator-v1"
  }
}
```

Use the Settings page or the `/api/manifests/sync` endpoint to pull manifests from S3 into the local database.

## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Market indices, sector heatmap, news feed, trending tickers, top stories, market breadth, earnings calendar |
| News | `/news` | Full news feed with category filters |
| Sectors | `/sectors` | Sector performance bars and sector-grouped news |
| Screener | `/screener` | Stock screener table with search and filters |
| Saved | `/saved` | Bookmarked articles |
| Settings | `/settings` | Profile, S3 manifest sync, API configuration |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Lucide icons |
| Backend | Express.js, TypeScript, node-postgres |
| Database | PostgreSQL 16, Flyway 10 |
| Auth | Firebase Authentication (Google, GitHub, Email) |
| Storage | AWS S3 (or S3-compatible) via AWS SDK v3 |
| Containerization | Docker, Docker Compose |
