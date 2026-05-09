# 🌿 Lotus Lanka Tours

A production-ready, multilingual tour booking platform for Sri Lanka — built with Next.js 16, Supabase, Clerk, Tailwind CSS, and Resend.

---

## ✨ Features

- **Multilingual** — English, Sinhala, Tamil via `next-intl`
- **Public site** — Homepage, Tours listing/detail, Blog, Gallery, About, Contact, Build-Your-Tour
- **Booking flow** — Inquiry form, WhatsApp CTA, multi-step custom tour builder
- **Admin dashboard** — Tours CRUD, Inquiries, Custom requests, Blog, Reviews, Media library, Analytics
- **Authentication** — Clerk-powered admin sign-in with role-based access
- **Email notifications** — Resend-powered confirmations and admin alerts
- **SEO** — Dynamic sitemap, per-page metadata, OpenGraph
- **Storage** — Supabase Storage for media uploads
- **Database** — Supabase PostgreSQL with Row Level Security

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp env.example .env.local

# 3. Set up the database (see SETUP.md)

# 4. Run the development server
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) to view the site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 🗂️ Documentation

| File | Purpose |
|------|---------|
| [`SETUP.md`](./SETUP.md) | Step-by-step environment, database, and third-party service setup |
| [`docs/IMPLEMENTATION.md`](./docs/IMPLEMENTATION.md) | Architecture, file structure, data models, and feature guide |
| [`env.example`](./env.example) | All required environment variables with descriptions |
| [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) | Full database schema with RLS policies |
| [`supabase/seed.sql`](./supabase/seed.sql) | Sample data for tours, blog posts, and reviews |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (en / si / ta) |
| Database | Supabase PostgreSQL |
| Auth | Clerk |
| Email | Resend + React Email |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |

---

## 📁 Project Structure

```
lotuslankatours/
├── app/
│   ├── [locale]/          # Public multilingual pages
│   │   ├── page.tsx       # Homepage
│   │   ├── tours/         # Tour listing & detail
│   │   ├── blog/          # Blog listing & detail
│   │   ├── gallery/       # Photo gallery
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   └── build-your-tour/  # Custom tour builder
│   ├── admin/             # Protected admin dashboard
│   │   ├── page.tsx       # Dashboard with stats
│   │   ├── tours/         # Tour management
│   │   ├── blog/          # Blog management
│   │   ├── inquiries/     # Inquiry management
│   │   ├── custom-requests/  # Custom request management
│   │   ├── reviews/       # Review moderation
│   │   ├── media/         # Media library
│   │   ├── analytics/     # Analytics view
│   │   └── users/         # User list (Clerk)
│   ├── api/               # API routes
│   │   ├── tours/         # Public tour endpoints
│   │   ├── blog/          # Public blog endpoint
│   │   ├── inquiries/     # Inquiry submission
│   │   ├── custom-tour/   # Custom tour submission
│   │   ├── reviews/       # Review submission
│   │   ├── media/         # Media fetch
│   │   └── admin/         # Protected admin endpoints
│   └── sitemap.ts         # Dynamic XML sitemap
├── components/
│   ├── layout/            # Navbar, Footer, AdminSidebar, AdminTopbar
│   └── public/            # TourCard, BlogCard, ReviewCard, HeroSection, etc.
├── lib/
│   ├── supabase/          # Server & admin Supabase clients + queries
│   ├── clerk.ts           # isAdmin / requireAdmin helpers
│   ├── resend.ts          # Email sending functions
│   └── utils.ts           # cn, formatDate, slugify, getLocalizedText, etc.
├── emails/                # React Email templates
├── messages/              # i18n JSON (en, si, ta)
├── supabase/
│   ├── migrations/        # SQL schema
│   └── seed.sql           # Sample data
└── types/                 # TypeScript interfaces & CATEGORY_CONFIG
```

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Locales

The site is fully translated in three languages:

| Code | Language |
|------|----------|
| `en` | English (default) |
| `si` | Sinhala (සිංහල) |
| `ta` | Tamil (தமிழ்) |

Translation files live in `messages/`.  
All tour titles, descriptions, blog content, and metadata support JSONB localized fields: `{ "en": "...", "si": "...", "ta": "..." }`.

---

## 🔐 Admin Access

1. Sign in at `/admin` via Clerk
2. Grant admin role in your Clerk dashboard → Users → select user → Public metadata: `{ "role": "admin" }`
3. All admin API routes (`/api/admin/*`) verify this role via `lib/clerk.ts:isAdmin()`

---

## 🚢 Deployment

**Recommended: Vercel**

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add all env vars from `env.example`
4. Deploy — Vercel auto-detects Next.js

**Alternative: Any Node.js host** (Railway, Render, Fly.io)  
Run `npm run build && npm run start` with `NODE_ENV=production`.
# lotus_lanka_tours
