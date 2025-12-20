# SIP Project

Laravel 12 + Next.js 16 monorepo for **Sistem Informasi Perpustakaan (SIP)**.

## Tech stack

- **Backend:** PHP 8.2, Laravel 12, Sanctum, MySQL 8.
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn-inspired UI kit.
- **Tooling:** Docker Compose (MySQL + phpMyAdmin), Composer 2, Node.js 20+ / npm 10+.

## Repository layout

```
sip-project/
├─ docker-compose.yaml
├─ sip-backend/
└─ sip-frontend/
```

## Prerequisites

| Component | Requirement                                                        |
| --------- | ------------------------------------------------------------------ |
| Backend   | PHP 8.2+, Composer 2, MySQL 8, Node 18+ (optional for Vite assets) |
| Frontend  | Node.js 20+, npm 10+                                               |
| Tooling   | Git, Docker                                                        |

## Quick start

### 1. Clone & install

```cmd
cd path\to\projects
git clone <repo-url> sip-project
cd sip-project
```

### 2. Start database services (optional)

If you don't already have MySQL locally, use the included compose file:

```cmd
docker compose up -d
```

This provisions:

- `mysql_db` on `localhost:3306`.
- `phpMyAdmin` on http://localhost:7070 for quick inspection.

> Bring services down with `docker compose down` when finished.

## Backend (`sip-backend/`)

### Environment

1. Install dependencies and bootstrap Laravel:

   ```cmd
   cd sip-backend
   composer install
   copy .env.example .env
   php artisan key:generate
   ```

2. Update `.env` with values matching your DB + frontend origin:

   ```ini
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:3000
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sip_backend
   DB_USERNAME=root
   DB_PASSWORD=your_password
   APP_TIMEZONE=Asia/Jakarta
   ```

3. Run migrations and seeders (sessions/cache rely on database tables):

   ```cmd
   php artisan migrate --seed
   php artisan storage:link
   ```

4. Run schedule worker in a separate terminal (optional):

   ```cmd
   php artisan schedule:work
   ```

### Daily commands

| Action                 | Command                                          |
| ---------------------- | ------------------------------------------------ |
| Serve API              | `php artisan serve`                              |
| Run schedule           | `php artisan schedule:work`                      |
| Re-run seeds           | `php artisan db:seed --class=ClassName`          |
| Run tests              | `composer test` (alias for `php artisan test`)   |
| Format/lint (optional) | `vendor\bin\pint` / `vendor\bin\phpstan analyse` |

### Notes

- All JSON responses must use `App\ResponseFormatter` to return `{ meta, data }` envelopes.
- Protected routes stack `auth:sanctum`; admin-only endpoints also use the `admin` middleware alias (EnsureUserIsAdmin).
- File uploads store under `storage/app/public/covers`. Always reference them via `/storage/...` and ensure `php artisan storage:link` ran locally.

## Frontend (`sip-frontend/`)

### Environment

1. Install dependencies:

   ```cmd
   cd ..\sip-frontend
   npm install
   ```

2. Configure the backend URL (if different from default) via `.env.local`:

   ```ini
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
   ```

### Scripts

| Purpose           | Command         |
| ----------------- | --------------- |
| Dev server        | `npm run dev`   |
| Production build  | `npm run build` |
| Start production  | `npm run start` |
| Lint & type check | `npm run lint`  |

### Architecture highlights

- Auth state flows through `src/context/auth-context.tsx`, which stores Sanctum tokens in `localStorage + cookies` and fetches `/profile` on boot.
- HTTP requests go through `src/lib/http.ts` to automatically prefix `NEXT_PUBLIC_BACKEND_URL` and attach the token.
- Prefer Server Components for data fetching; only opt into Client Components for hooks/browser APIs (forms, interactive charts, etc.).

## Recommended workflow

1. Bring up MySQL via Docker (or your local instance).
2. Start the backend (`php artisan serve`) so Sanctum and APIs are reachable.
3. Run the frontend dev server (`npm run dev`) and visit http://localhost:3000.
4. Use seeded credentials (see `database/seeders/*`) to log in and exercise flows.

## Testing & quality gates

- **Backend:** `composer test` runs the Laravel/PHPUnit suite. Ensure migrations are up-to-date before running.
- **Frontend:** `npm run lint` validates ESLint + TypeScript. Add component/E2E tests as the UI becomes stateful.

## Troubleshooting

| Issue                  | Fix                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| Sanctum token rejected | Confirm requests originate from the same top-level domain or that `SANCTUM_STATEFUL_DOMAINS` is configured. |
| 419 / CSRF errors      | Clear browser cookies and ensure `APP_URL` + `FRONTEND_URL` share the same scheme/domain.                   |
| Storage 404s           | Re-run `php artisan storage:link` and confirm your web server exposes `/storage`.                           |
| DB connection errors   | Verify MySQL is running (Docker container healthy) and `.env` credentials match.                            |

## License

This project is currently private for internal use. Please contact the maintainers before redistributing.
