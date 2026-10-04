# Admin panel setup (one time, about 15 minutes)

The website works without this: until Sanity is connected, it shows the built-in
content from `src/content/fallback.ts`. These steps connect the `/admin` panel.

## 1. Create the Sanity project

1. Sign in at <https://www.sanity.io/manage> (Google login is fine). Create a project called **Sri Shakti Sweets**.
2. When asked, create a dataset named **`production`** with **public** visibility. (Public is fine: only published content is readable, and drafts stay private.)
3. Copy the **Project ID**, for example `ab12cd34`.

## 2. Connect it to the code

Create `.env.local` in the project root (it is git-ignored):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ab12cd34
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=<any long random string>
```

Allow the admin to run in the browser (CORS):

```bash
npx sanity login
npx sanity cors add http://localhost:3000 --credentials
```

## 3. Fill the admin with the current content

```bash
npx sanity exec scripts/seed-sanity.ts --with-user-token
```

This copies the shop details, hours, products, story and hero photo into the admin. You can re-run it safely: it never overwrites anything already edited in `/admin`.

Then run `npm run dev` and open <http://localhost:3000/admin>.

## 4. Go live (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. In Vercel → Settings → Environment Variables, add the three variables above, plus `NEXT_PUBLIC_SITE_URL=https://<your-domain>`.
3. Add the live URL to CORS: `npx sanity cors add https://<your-domain> --credentials`

## 5. Instant updates when publishing (webhook)

In <https://www.sanity.io/manage>, open the project and go to **API → Webhooks → Create webhook**:

| Field | Value |
|---|---|
| URL | `https://<your-domain>/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Projection | `{_type}` |
| HTTP method | POST |
| Secret | the same value as `SANITY_REVALIDATE_SECRET` |

After this, clicking **Publish** in `/admin` updates the live site within a few seconds. Without the webhook, changes still appear, but only within the hour.

## 6. Give the owner access

In Sanity Manage → **Members → Invite**, enter the owner's email and choose the **Editor** role. Editors can change and publish content, but cannot change project settings or members. Keep the **Administrator** role for yourself.

## Backups

Once a month:

```bash
npx sanity dataset export production backups/sanity-YYYY-MM.tar.gz
```
