# GIA Educare API

Node + Express + MongoDB (Mongoose). Serves the public website, the admin panel
and enquiry capture.

```
src/
├── config/       env validation (zod), mongo connection, logger
├── models/       mongoose schemas + shared plugins
├── controllers/  request handlers (incl. the generic CRUD factory)
├── services/     token issuing, aggregated site content
├── routes/       public / auth / admin routers
├── middleware/   auth guards, validation, rate limits, error handler
├── validators/   zod request schemas
├── lib/          resource registry — the single source of truth for collections
├── seed/         launch content + admin user
├── app.js        express wiring
└── server.js     bootstrap + graceful shutdown
```

## Design notes

**One registry, thirteen REST resources.** `lib/resourceRegistry.js` lists every
content collection with its model, zod schema and searchable fields.
`routes/admin/content.routes.js` walks that list and mounts a full REST surface
per entry using `controllers/crud.factory.js` — so adding a content type means
adding one registry entry and one model, not another controller.

**Auth.** Short-lived JWT access token (15m) in memory + rotating refresh token
in an httpOnly cookie. Refresh tokens are stored hashed; reuse of an old token
revokes the session. Roles: `super_admin` › `admin` › `editor`.

**Validation** happens at the edge via zod (`middleware/validate.js`), so
controllers only ever see well-formed input. Mongoose validators are the second
line of defence.

**Errors** funnel through one handler that normalises zod, mongoose validation,
cast and duplicate-key errors into `{ success, message, errors[] }`.

## Scripts

```bash
npm run dev          # nodemon
npm start            # production
npm run seed         # idempotent — safe to re-run, keeps existing edits
npm run seed:fresh   # wipe content collections first (users/enquiries kept)
```

## API reference

Base URL: `/api/v1`

### Public (no auth)
| Method | Path | Notes |
|---|---|---|
| GET | `/health` | uptime probe |
| GET | `/public/content` | **everything the website needs, one payload** |
| GET | `/public/settings` | site settings only |
| GET | `/public/:resource` | published rows of any collection |
| POST | `/public/enquiries` | form submission (rate limited, honeypot) |

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | returns access token, sets refresh cookie |
| POST | `/auth/refresh` | rotates the refresh token |
| POST | `/auth/logout` | revokes the stored refresh token |
| GET·PATCH | `/auth/me` | current user / update profile |
| POST | `/auth/change-password` | signs out other sessions |

### Admin (Bearer token)
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/dashboard` | counts, 30-day trend, pipeline, activity |
| GET·POST | `/admin/:resource` | list (page, limit, sort, search, published) / create |
| GET·PATCH·DELETE | `/admin/:resource/:id` | read / update / delete |
| PATCH | `/admin/:resource/:id/publish` | toggle visibility |
| PATCH | `/admin/:resource/reorder` | `{ items: [{ id, order }] }` |
| GET | `/admin/enquiries` | filter by status, destination, date, search |
| GET | `/admin/enquiries/export` | CSV |
| PATCH | `/admin/enquiries/:id` | status / assignee |
| POST | `/admin/enquiries/:id/notes` | append an internal note |
| GET·PATCH | `/admin/settings` | site settings (admin+) |
| GET·POST·PATCH·DELETE | `/admin/sections` | editable section copy |
| GET·POST·DELETE | `/admin/uploads` | media library |
| GET·POST·PATCH·DELETE | `/admin/users` | team accounts (super admin) |

`:resource` is one of: `destinations`, `courses`, `course-categories`,
`study-levels`, `services`, `testimonials`, `team`, `milestones`, `values`,
`stats`, `process-steps`, `faqs`, `comparison-rows`.

## Response shape

```jsonc
// success
{ "success": true, "data": {...}, "meta": { "page": 1, "limit": 20, "total": 8, "pages": 1 } }

// failure
{ "success": false, "message": "Validation failed",
  "errors": [{ "field": "answer", "message": "Answer is too short" }] }
```

## Security

- `helmet`, CORS allow-list, `compression`
- Rate limits: 600/15min general · 10/15min on login · 20/hour on enquiries
- Passwords hashed with bcrypt (cost 12); password fields never serialised
- Uploads restricted to images ≤4MB, filenames sanitised
- Audit log records every create/update/delete/login
