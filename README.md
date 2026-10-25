# KHQ Services — Corporate Website

Multi-page B2B logistics website for KHQ Services (Cambodia): Next.js (App Router), React, TypeScript, Tailwind CSS v4, React Hook Form + Zod, Lucide icons.

## Run locally

```bash
npm install
cp .env.example .env.local     # then edit
npm run dev                    # http://localhost:3000
```

Other scripts: `npm run lint`, `npm run typecheck`, `npm test`, `npm run check` (all three), `npm run build && npm start`.

## Pages

`/`, `/services`, `/industries/manufacturing`, `/industries/it-technology`, `/industries/government`, `/about`, `/how-it-works`, `/request-quote`, `/contact`, `/privacy`, `/terms`, plus `sitemap.xml`, `robots.txt`, and a custom 404.

## Where things live

| Path | Purpose |
|---|---|
| `src/config/site.ts` | Central business details (all unknowns are `[placeholders]`), upload defaults |
| `src/content/en/` | Translation-ready English content (services, industries, nav, process). Add `src/content/km/` once reviewed Khmer copy exists |
| `src/components/` | Reusable layout, navigation, cards, forms, shared UI |
| `src/lib/validation/` | Zod schemas (shared by browser and server) and file content checks |
| `src/lib/enquiries/` | Storage, reference numbers, submission pipeline |
| `src/lib/email/` | SMTP notifications (nodemailer) |
| `src/app/api/enquiries`, `/api/contact` | POST-only endpoints |
| `public/images/` | **Placeholder SVG illustrations** — replace with licensed photography (keep file names or update `src/content/en/index.ts` and the hero/IT pages). Images are illustrative and must not imply KHQ owns vehicles or warehouses |

## Enquiry handling and modes

Set `ENQUIRY_STORAGE` in `.env.local`:

* `demo` (default): the form validates fully but stores and sends **nothing**. The UI says so and issues no reference number.
* `file`: enquiries are saved as JSON in `ENQUIRY_DATA_DIR` (default `.data/`, git-ignored, outside `public/`). Uploads are saved there under random file names with mode `0600`. **No route lists, reads, or downloads these files**; access them on the server only.

`file` mode needs a persistent writable disk (a VPS or container with a volume). It will not persist on serverless hosts such as Vercel — see "Upgrading storage".

Each enquiry gets a reference like `KHQ-261025-YC4U64` and status `New` (statuses: New, Under Review, Quotation in Progress, Quotation Sent, Confirmed, In Progress, Delivered, Closed, Cancelled — defined in `src/lib/validation/enquiry.ts`; there is no admin UI yet).

Protections: server-side Zod validation, extension allowlist + magic-byte content check + size/count limits for uploads, in-memory rate limit (5 submissions / 10 min / IP), honeypot field, minimum fill time, idempotency key (a repeated submission returns the original reference), security headers, generic error messages.

### Email

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `NOTIFY_EMAIL_TO`. Plain-text notification to the team (uploaded documents are **not** attached) and a confirmation to the customer. Per-email result (`sent` / `skipped` / `failed`) is recorded in the enquiry JSON. Without SMTP configured, emails are `skipped` — never reported as sent. A failed email does not undo a stored enquiry.

### Upgrading storage

`src/lib/enquiries/store.ts` is the only persistence layer. To move to PostgreSQL + private object storage (S3/R2), reimplement `claimSubmission`, `releaseSubmission`, `saveEnquiry`, and `recordNotifications` (e.g. with Prisma) and keep the route handlers unchanged. The rate limiter in `src/lib/security/rate-limit.ts` is per-instance; use a shared store (Redis/Upstash) on multi-instance hosting.

## Testing

* `npm run lint` — ESLint, `npm run typecheck` — TypeScript
* `npm test` — Vitest: validation rules, file-content checks, references, rate limiting, and the enquiry API handler (demo mode, persistence, duplicates, bad uploads, rate limit)
* No Playwright suite is included; the browser flow was checked manually (see below).

Manually verified against a production build: all 11 pages return 200 and unknown URLs return 404; desktop menu; mobile drawer (open, expand, Escape closes, no horizontal overflow); required-field and email validation in the UI; industry prefill from `?industry=`; successful submission with reference; double-click creates one record; private paths are not served.

**Not verified:** real SMTP delivery (no credentials), Khmer content, Lighthouse/Core Web Vitals scores on a deployed site, cross-browser testing, screen-reader testing.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain (used for canonical URLs, sitemap, Open Graph).
2. Choose a host with persistent disk for `file` mode (or implement the DB upgrade above). Set `ENQUIRY_STORAGE=file` and `ENQUIRY_DATA_DIR` to a volume path.
3. Configure SMTP variables as secrets in the host — never commit `.env.local`.
4. `npm ci && npm run build && npm start` behind HTTPS. Back up the data directory.

## Business details still needed

Business email, telephone, messaging contact (Telegram/WhatsApp), office address, business hours (`src/config/site.ts` or `NEXT_PUBLIC_*`); official logo and photography; company background (founding, registration, team) for About; confirmed routes; social links; legal review and completion of Privacy Policy and Terms (retention period, providers, liability/claims/insurance); sender domain for email; analytics choice if any; reviewed Khmer translations.

## Depends on external services or partner confirmation

Freight, customs clearance, warehousing, and local transport are described as coordinated through third-party providers and must be confirmed per route. Not offered/claimed: shipment tracking (no tracker exists), dangerous goods, oversized/heavy-lift, temperature-controlled cargo, insurance, chain-of-custody, specialist IT handling, government approvals.

## Admin login (edit logo and contact details)

Visit `/admin`. Admins can change the logo, email, phone, messaging contact, address, business hours, and social links; changes appear on the public site immediately. Values are saved in `ENQUIRY_DATA_DIR/settings.json` (the logo in `ENQUIRY_DATA_DIR/branding/`), so use a persistent disk and back it up.

Setup (the admin is disabled until all three variables are set):

```bash
npm run admin:hash -- "147ba39583b64d6c08a2c7f802998fe4:68eb006d65dd44569c04b6e140d7762472d3005124eea2155a2ff47bb19dae43dfacfccb9ec70a91fdbdcb27e88e466618a9e2f4f64787b3259fdb34c022166c"
```

Copy the two printed lines (`ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`) into `.env.local`, add `ADMIN_USERNAME=admin`, then restart. The plain password is never stored.

Security: scrypt-hashed password, signed HttpOnly SameSite=Strict session cookie (8 h), same-origin check on every admin POST, login rate limit (5 / 15 min / IP), server-side authorization on every admin route, logo limited to PNG/JPG/WebP verified by content (SVG refused). There is a single admin account and no enquiry viewer yet.
