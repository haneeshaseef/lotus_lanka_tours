# 🔧 Setup Guide — Lotus Lanka Tours

Complete step-by-step instructions to get the project running locally and in production.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 10 | Bundled with Node |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## Step 1 — Clone & Install

```bash
git clone <your-repo-url> lotuslankatours
cd lotuslankatours
npm install
```

---

## Step 2 — Environment Variables

Copy the example file and fill in every value:

```bash
cp env.example .env.local
```

Open `.env.local` and set the following:

### Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. After the project is ready, go to **Settings → API**
3. Copy the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

> ⚠️ **Never** expose `SUPABASE_SERVICE_ROLE_KEY` on the client side.

### Resend

1. Go to [resend.com](https://resend.com) → Create API key
2. Add and verify your sending domain (e.g. `lotuslankatours.com`)

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@lotuslankatours.com
ADMIN_EMAIL=admin@lotuslankatours.com
```

### App

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000          # Change to production URL when deploying
NEXT_PUBLIC_WHATSAPP_NUMBER=94XXXXXXXXX            # Sri Lanka number without + sign
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

To get a Google Maps embed URL:
- Go to [maps.google.com](https://maps.google.com)
- Search your office address → Share → Embed a map → Copy the `src` URL

---

## Step 3 — Supabase Database Setup

### 3a. Run the migrations

1. Open your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor**
3. Run **each file in order**:

| Order | File | Creates |
|-------|------|---------|
| 1 | [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) | All tables, indexes, RLS policies, storage bucket |
| 2 | [`supabase/migrations/002_profiles.sql`](./supabase/migrations/002_profiles.sql) | `profiles` table, RLS, and auto-create-profile trigger for new sign-ups |

### 3b. Load sample data (optional)

In the same SQL Editor, open [`supabase/seed.sql`](./supabase/seed.sql), paste and run it.

This adds 4 sample tours, 2 blog posts, and 4 approved reviews.

### 3c. Storage bucket

The migration script creates the `media` storage bucket automatically. To verify:
- Go to **Storage** in your Supabase dashboard
- Confirm the `media` bucket exists and is set to **Public**

---

## Step 4 — Admin Role Setup

Authentication is handled by **Supabase Auth**. The sign-up trigger automatically creates a row in the `profiles` table with `role = 'user'`. To promote a user to admin:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

3. The user can now sign in at `/en/sign-in` and will be redirected to `/admin`

> The `profiles` table is protected by Row Level Security. Only the service role (used server-side) can update roles — users cannot escalate their own privileges.

---

## Step 5 — Run Locally

```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:3000/en` | English homepage |
| `http://localhost:3000/si` | Sinhala homepage |
| `http://localhost:3000/ta` | Tamil homepage |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/sitemap.xml` | Dynamic sitemap |

---

## Step 6 — Production Build (verify)

```bash
npm run build
npm run start
```

All 40 routes should compile cleanly. If you see Resend or Supabase errors, ensure your `.env.local` values are correct.

---

## Deployment — Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. In **Environment Variables**, add every key from `env.example` with production values
4. Set **Framework Preset** to `Next.js` (auto-detected)
5. Click **Deploy**

After deployment:
- Update `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://lotuslankatours.com`)
- Redeploy for the sitemap to reflect the correct domain

### Custom Domain

In Vercel → your project → **Settings → Domains**:
- Add `lotuslankatours.com` and `www.lotuslankatours.com`
- Follow the DNS instructions to point your domain to Vercel

---

## Deployment — Alternative Hosts

### Railway / Render / Fly.io

```bash
npm run build
NODE_ENV=production npm run start
```

Set `PORT` if needed. All env vars must be set in the host's dashboard.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `Missing API key. Pass it to Resend` | `RESEND_API_KEY` not set in `.env.local` |
| `relation "tours" does not exist` | Run the SQL migration (Step 3a) |
| Admin shows Unauthorized | Run the `UPDATE profiles SET role = 'admin'` SQL (Step 4) |
| Images not loading | Ensure Supabase `media` bucket is **Public** |
| WhatsApp button missing | Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in env |
| Build error on Supabase calls | `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set |
