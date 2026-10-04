# Sri Shakti Sweets — website

The brand website for Sri Shakti Sweets (Okalipuram, Bengaluru), with an admin panel at `/admin`.

- **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Motion · Sanity (admin)
- **Plan and design decisions:** [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)
- **Connecting the admin panel:** [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000   (admin: /admin)
npm run build      # production build
npm run lint && npm run typecheck
```

Without Sanity configured, the site uses `src/content/fallback.ts`.

## Where things live

| What | Where |
|---|---|
| Page sections | `src/components/sections/` |
| Design tokens (colours, type, spacing) | `src/app/globals.css` (`@theme`) |
| Content shape | `src/types/content.ts` |
| Built-in / seed content | `src/content/fallback.ts` |
| Admin schemas and sidebar | `sanity/schemaTypes/`, `sanity/structure.ts` |
| CMS fetch and normalisation | `src/lib/data.ts` |
| WhatsApp, phone and maps links | `src/lib/links.ts` |
| Live opening status (Asia/Kolkata) | `src/lib/hours.ts` |
| Publish webhook | `src/app/api/revalidate/route.ts` |

## Before launch

- Replace the representative hero photo and the illustrated product tiles with real photos (upload them in `/admin`).
- Confirm the products with the owner and tick "Owner confirmed we sell this" for each.
- Confirm the WhatsApp number (currently assumed to be +91 93412 22517).
- Get the owner's approval for the redrawn logo (`src/components/ui/Logo.tsx`).
