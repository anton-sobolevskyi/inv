# Inventory

Next.js 16 app with MySQL (Drizzle ORM) and a Socket.IO server for live session counts.

| Service  | What it is                   | Port |
| -------- | ---------------------------- | ---- |
| `web`    | Next.js app (`/`)            | 3000 |
| `socket` | Socket.IO server (`/server`) | 3001 |
| `mysql`  | MySQL 8.4                    | 3306 |

## Development

Requirements: Node 24, pnpm 12.18 (see `mise.toml`), Docker.

```bash
cp .env.example .env
pnpm install
pnpm docker:up        # MySQL + socket server
pnpm db:migrate
pnpm db:seed
pnpm dev              # http://localhost:3000
```

Other commands: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm test`,
`pnpm db:generate` (create a migration after changing `src/db/schema`).

## Production build, locally

Runs the same containers you would deploy: a production `next build`, migrations,
the socket server and MySQL, all through Docker Compose.

```bash
cp .env.example .env          # then change JWT_SECRET and passwords
docker compose -f docker-compose.yml up --build
```

Open http://localhost:3000. On start, `migrate` runs once and exits, then `web` starts.

### Seed data (first run only)

The seed script **deletes and re-creates** the catalog data (prices, products,
orders), so it is never run automatically.

```bash
docker compose -f docker-compose.yml --profile seed run --rm seed
```

Log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `.env`.

### Everyday commands

```bash
docker compose -f docker-compose.yml up -d --build   # start in background
docker compose -f docker-compose.yml logs -f web     # follow logs
docker compose -f docker-compose.yml down            # stop, keep the database
docker compose -f docker-compose.yml down -v         # stop and DELETE the database
```

### Environment variables

| Variable                                                                   | Used by       | Notes                                                            |
| -------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| `JWT_SECRET`                                                               | web           | Required. `openssl rand -hex 32`                                 |
| `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` | mysql, web    | Defaults to the dev values                                       |
| `SOCKET_URL`                                                               | web (browser) | Public URL of the socket server, default `http://localhost:3001` |
| `CORS_ORIGIN`                                                              | socket        | Exact URL of the web app, no trailing slash                      |
| `NEXT_PUBLIC_API_URL`                                                      | web           | **Inlined at build time**, rebuild after changing                |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`                                 | seed          | Admin user created by the seed                                   |

`DATABASE_HOST` and `DATABASE_PORT` are set by the compose file (`mysql:3306`),
whatever your `.env` says.

### Troubleshooting

- **Port already in use:** stop the dev stack (`pnpm docker:down`) or change the ports in the compose file.
- **CORS error in the browser:** `CORS_ORIGIN` must exactly match the page origin, for example `http://localhost:3000` (no `/` at the end).
- **Changed `NEXT_PUBLIC_API_URL` or `SOCKET_URL` but nothing happened:** run with `--build`.
- **Build fails on `react-leaflet` types:** make sure `@types/leaflet` is a dev dependency (`pnpm add -D @types/leaflet`).
- **Login fails after `down -v`:** the database was wiped, run the seed again.
