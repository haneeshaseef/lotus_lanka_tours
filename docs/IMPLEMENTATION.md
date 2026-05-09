# 🏗️ Implementation Guide — Lotus Lanka Tours

Deep-dive into the architecture, data models, feature design, and extension patterns.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Models](#2-data-models)
3. [Internationalization (i18n)](#3-internationalization-i18n)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Public Pages](#5-public-pages)
6. [Admin Dashboard](#6-admin-dashboard)
7. [API Routes](#7-api-routes)
8. [Email System](#8-email-system)
9. [Media Uploads](#9-media-uploads)
10. [SEO & Sitemap](#10-seo--sitemap)
11. [Adding New Features](#11-adding-new-features)
12. [Key Utilities](#12-key-utilities)

---

## 1. Architecture Overview

```
Browser
  │
  ├─── Next.js App Router (Server Components by default)
  │      ├── app/[locale]/…       Public pages (SSR, data from Supabase)
  │      ├── app/admin/…          Admin pages (SSR, Clerk-protected)
  │      └── app/api/…            API routes (REST handlers)
  │
  ├─── Supabase (PostgreSQL + Storage)
  │      ├── Public reads  → anon key   (RLS: only published data)
  │      └── Admin writes  → service role key (bypasses RLS)
  │
  ├─── Clerk                      Authentication (admin sign-in)
  │
  └─── Resend                     Transactional emails
```

### Request flow for a public tour page

```
GET /en/tours/sigiriya-cultural-day-tour
  → Next.js Server Component
  → getTourBySlug("sigiriya-cultural-day-tour")   [lib/supabase/queries.ts]
  → Supabase anon client → tours table (RLS: is_published = true)
  → Returns Tour object
  → Renders page with getLocalizedText(tour.title, "en")
```

### Request flow for an admin action (e.g. publish a tour)

```
PATCH /api/admin/tours/:id  { is_published: true }
  → isAdmin()   [lib/clerk.ts]  → reads Clerk session claims
  → createAdminClient()          → Supabase service-role client
  → tours.update({ is_published: true }).eq("id", id)
  → 200 OK → client calls router.refresh()
```

---

## 2. Data Models

All types are defined in `types/index.ts`.

### Tour

```ts
interface Tour {
  id: string;
  slug: string;
  title: LocalizedText;          // { en, si, ta }
  description: LocalizedText;
  category: TourCategory;        // "cultural" | "wildlife" | "beach" | "adventure" | "daytrip" | "multiday"
  duration_days: number;
  max_group_size: number;
  difficulty?: "easy" | "moderate" | "challenging";
  price_per_person?: number;
  price_private?: number;
  cover_image_url?: string;
  gallery_images: string[];
  itinerary: ItineraryDay[];     // [{ day, title: LocalizedText, description: LocalizedText }]
  includes: string[];
  excludes: string[];
  is_published: boolean;
  is_featured: boolean;
  meta_title?: LocalizedText;
  meta_description?: LocalizedText;
  created_at: string;
  updated_at: string;
}
```

### BlogPost

```ts
interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedText;
  content: LocalizedText;        // HTML string per locale
  author: string;
  category?: string;
  tags: string[];
  cover_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
```

### Inquiry

```ts
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tour_id?: string;
  tour_name_text?: string;
  travel_date?: string;
  guests: number;
  message?: string;
  locale: string;
  status: "new" | "replied" | "closed";
  created_at: string;
}
```

### CustomTourRequest

```ts
interface CustomTourRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  destinations: string[];
  duration_days?: number;
  travel_date?: string;
  guests: number;
  interests: string[];
  budget_tier?: string;
  budget_lkr?: number;
  special_requests?: string;
  status: "new" | "in-progress" | "quoted" | "closed";
  created_at: string;
}
```

### LocalizedText

```ts
interface LocalizedText {
  en: string;
  si?: string;
  ta?: string;
}
```

All database JSONB localized fields follow this shape. Use `getLocalizedText(field, locale)` from `lib/utils.ts` to safely extract the right value with an `en` fallback.

---

## 3. Internationalization (i18n)

### How it works

- **`next-intl`** handles routing, translation loading, and the `useTranslations` hook
- Locale is part of the URL: `/en/tours`, `/si/tours`, `/ta/tours`
- The middleware (`middleware.ts`) redirects `/` → `/en` and detects browser locale
- Translation strings live in `messages/en.json`, `messages/si.json`, `messages/ta.json`

### Using translations in Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return <h1>{t("title")}</h1>;
}
```

### Using translations in Client Components

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("inquiry");
  return <button>{t("send")}</button>;
}
```

### Adding a new translation key

1. Add the key to `messages/en.json` under the relevant namespace
2. Add the translated value to `messages/si.json` and `messages/ta.json`
3. Use `t("myKey")` in your component

### Rendering localized database content

```tsx
import { getLocalizedText } from "@/lib/utils";

// locale comes from params or useLocale()
const title = getLocalizedText(tour.title, locale as Locale);
```

---

## 4. Authentication & Authorization

### Clerk setup

- `ClerkProvider` wraps the admin layout in `app/admin/layout.tsx`
- Middleware protects `/admin/*` routes — unauthenticated users are redirected to Clerk's hosted sign-in
- After sign-in, the user is redirected back to `/admin`

### Role-based access

Admin status is stored in Clerk's **public metadata**, not in the database:

```json
{ "role": "admin" }
```

`lib/clerk.ts` exposes two helpers:

```ts
// Returns boolean — safe to use in any context
export async function isAdmin(): Promise<boolean>

// Throws if not admin — use in server actions / route handlers that should hard-fail
export async function requireAdmin(): Promise<void>
```

All `/api/admin/*` routes call `isAdmin()` at the top and return `403` if false.

### Adding a new protected admin route

```ts
// app/api/admin/my-resource/route.ts
import { isAdmin } from "@/lib/clerk";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  // ... handler logic
}
```

---

## 5. Public Pages

### Route map

| Route | File | Data source |
|-------|------|-------------|
| `/[locale]` | `app/[locale]/page.tsx` | `getFeaturedTours`, `getApprovedReviews`, `getAllMedia` |
| `/[locale]/tours` | `app/[locale]/tours/page.tsx` | `getPublishedTours` with filters |
| `/[locale]/tours/[slug]` | `app/[locale]/tours/[slug]/page.tsx` | `getTourBySlug`, `getApprovedReviews`, `getRelatedTours` |
| `/[locale]/blog` | `app/[locale]/blog/page.tsx` | `getPublishedBlogPosts` with category filter |
| `/[locale]/blog/[slug]` | `app/[locale]/blog/[slug]/page.tsx` | `getBlogPostBySlug`, related posts |
| `/[locale]/gallery` | `app/[locale]/gallery/page.tsx` | `getAllMedia` |
| `/[locale]/about` | `app/[locale]/about/page.tsx` | Static content |
| `/[locale]/contact` | `app/[locale]/contact/page.tsx` | Static + inquiry form |
| `/[locale]/build-your-tour` | `app/[locale]/build-your-tour/page.tsx` | `TourBuilderForm` component |

### Tour detail tabs

The tour detail page uses `TourTabs` (`app/[locale]/tours/[slug]/TourTabs.tsx`) — a client component that manages the active tab state for:

- **Overview** — description HTML rendered with `dangerouslySetInnerHTML`
- **Itinerary** — day-by-day accordions from `tour.itinerary`
- **Includes/Excludes** — two-column checklist
- **Reviews** — approved reviews + review submission form

### Custom tour builder

`components/public/TourBuilderForm.tsx` is a 3-step multi-page form:

1. **Destinations & Dates** — destination checkboxes, travel date, duration, group size
2. **Interests & Budget** — interest tags, budget tier, custom LKR amount
3. **Your Details** — name, email, phone, special requests

On submit it calls `POST /api/custom-tour` which saves to Supabase and sends confirmation emails via Resend.

---

## 6. Admin Dashboard

### Layout

```
app/admin/layout.tsx
  └── ClerkProvider
        └── div.flex
              ├── AdminSidebar    (collapsible, highlights active route)
              └── div.flex-1
                    ├── AdminTopbar   (page title + Clerk UserButton)
                    └── main          (page content)
```

### Dashboard stats (`app/admin/page.tsx`)

Calls `getDashboardStats()` from `lib/supabase/queries.ts` which runs 10 parallel Supabase queries in a single `Promise.all`:

- Total & published tours
- Total & new (last 7 days) inquiries
- Total & new custom requests
- Total & pending (unapproved) reviews
- 5 most recent inquiries
- 5 published tours for the "Top Tours" widget

### Admin pages reference

| Page | File | Features |
|------|------|---------|
| Dashboard | `admin/page.tsx` | Stats cards, recent inquiries, top tours |
| Tours list | `admin/tours/page.tsx` | Table, publish/feature toggle, delete |
| Tour form | `admin/tours/TourForm.tsx` | Create/edit with all fields |
| Inquiries | `admin/inquiries/page.tsx` | Table with inline status select |
| Custom requests | `admin/custom-requests/page.tsx` | Cards with status select, destinations, interests |
| Reviews | `admin/reviews/page.tsx` | Cards with approve/reject/delete |
| Blog list | `admin/blog/page.tsx` | Table with publish status |
| Blog form | `admin/blog/BlogForm.tsx` | Create/edit with multilingual content |
| Media | `admin/media/page.tsx` | Drag-and-drop upload grid, copy URL, delete |
| Analytics | `admin/analytics/page.tsx` | Status breakdown, 14-day trend chart, tour overview |
| Users | `admin/users/page.tsx` | Clerk user list with roles |

---

## 7. API Routes

### Public endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/tours` | Paginated published tours with `category`, `duration`, `search`, `page` filters |
| GET | `/api/tours/[slug]` | Single published tour by slug |
| POST | `/api/inquiries` | Submit inquiry → Supabase + Resend email |
| POST | `/api/custom-tour` | Submit custom request → Supabase + Resend email |
| POST | `/api/reviews` | Submit review (pending approval) |
| GET | `/api/blog` | Paginated published posts with `category`, `page` filters |
| GET | `/api/media` | All media items |

### Admin endpoints (require `role: "admin"`)

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/admin/tours` | Create tour |
| PATCH | `/api/admin/tours/[id]` | Update tour fields |
| DELETE | `/api/admin/tours/[id]` | Delete tour |
| GET | `/api/admin/tours/[id]` | Get single tour (for form pre-fill) |
| PATCH | `/api/admin/inquiries/[id]` | Update status |
| DELETE | `/api/admin/inquiries/[id]` | Delete inquiry |
| PATCH | `/api/admin/reviews/[id]` | Approve/reject review |
| DELETE | `/api/admin/reviews/[id]` | Delete review |
| PATCH | `/api/admin/custom-requests/[id]` | Update status |
| POST | `/api/admin/blog` | Create blog post |
| PATCH | `/api/admin/blog/[id]` | Update blog post |
| DELETE | `/api/admin/blog/[id]` | Delete blog post |
| POST | `/api/admin/media/upload` | Upload files to Supabase Storage |
| DELETE | `/api/admin/media/[id]` | Delete file from storage + DB |

---

## 8. Email System

### Architecture

`lib/resend.ts` exports four functions. Each lazily initializes the Resend client (avoids build-time crashes when `RESEND_API_KEY` is not set):

```ts
sendInquiryConfirmation(params)           // → tourist email
sendAdminInquiryNotification(params)      // → admin email
sendCustomTourConfirmation(params)        // → tourist email
sendAdminCustomTourNotification(params)   // → admin email
```

### Email templates

React Email templates in `emails/`:

| File | Recipient | Trigger |
|------|-----------|---------|
| `InquiryConfirmation.tsx` | Tourist | `POST /api/inquiries` |
| `CustomTourConfirmation.tsx` | Tourist | `POST /api/custom-tour` |
| `AdminNotification.tsx` | Admin | Both inquiry and custom tour |

### Adding a new email

1. Create `emails/MyTemplate.tsx` exporting a React Email component
2. Add a send function in `lib/resend.ts`:

```ts
export async function sendMyEmail(params: { … }) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: "…",
    react: MyTemplateEmail(params),
  });
}
```

3. Call it from the relevant API route

---

## 9. Media Uploads

### Flow

```
Admin drops image in MediaLibrary
  → POST /api/admin/media/upload  (FormData with files[])
  → Buffer.from(await file.arrayBuffer())
  → supabase.storage.from("media").upload(filename, buffer)
  → supabase.storage.from("media").getPublicUrl(filename)
  → INSERT INTO media (filename, url, bucket, size_bytes, mime_type)
  → Returns uploaded media rows → displayed in grid
```

### Storage bucket

- Bucket name: `media`
- Access: **Public** (images served directly via CDN URL)
- Policies: public read, service-role write/delete

### Deleting a file

```
DELETE /api/admin/media/[id]
  → SELECT filename, bucket FROM media WHERE id = :id
  → supabase.storage.from(bucket).remove([filename])
  → DELETE FROM media WHERE id = :id
```

---

## 10. SEO & Sitemap

### Per-page metadata

Every page exports a `generateMetadata` function using `next-intl` translations and database data:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  return {
    title: getLocalizedText(tour?.meta_title ?? tour?.title, locale),
    description: getLocalizedText(tour?.meta_description ?? tour?.description, locale),
    openGraph: { … }
  };
}
```

### Dynamic sitemap

`app/sitemap.ts` generates XML for all locales × (static routes + published tours + published blog posts).

Priorities:
- Homepage: 1.0
- Static pages: 0.8
- Tour detail: 0.9
- Blog posts: 0.7

The sitemap is served at `/sitemap.xml` and auto-discovered by search engines via `<head>`.

---

## 11. Adding New Features

### Add a new public page

1. Create `app/[locale]/my-page/page.tsx`
2. Add translation keys to all three `messages/*.json`
3. Add the link to `components/layout/Navbar.tsx`
4. Add the route to `app/sitemap.ts` static routes array

### Add a new tour category

1. Edit `types/index.ts` — add to `TourCategory` union and `CATEGORY_CONFIG`
2. Update the `CHECK` constraint in Supabase SQL Editor:
   ```sql
   ALTER TABLE tours DROP CONSTRAINT tours_category_check;
   ALTER TABLE tours ADD CONSTRAINT tours_category_check
     CHECK (category IN ('cultural','wildlife','beach','adventure','daytrip','multiday','MY_NEW_CATEGORY'));
   ```
3. Add the category label to all three `messages/*.json` under `"categories"`

### Add a new admin section

1. Create `app/admin/my-section/page.tsx` (server component, fetches data)
2. Create any client sub-components needed (`MyActionButton.tsx`)
3. Create `app/api/admin/my-section/route.ts` with `isAdmin()` guard
4. Add the nav item to `components/layout/AdminSidebar.tsx`:
   ```ts
   { href: "/admin/my-section", icon: MyIcon, label: "My Section" }
   ```

### Add a new database table

1. Write SQL in a new migration file `supabase/migrations/002_my_table.sql`
2. Run it in Supabase SQL Editor
3. Add the TypeScript interface to `types/index.ts`
4. Add query functions to `lib/supabase/queries.ts`

---

## 12. Key Utilities

All in `lib/utils.ts`:

| Function | Signature | Purpose |
|----------|-----------|---------|
| `cn` | `(...inputs: ClassValue[]) => string` | Merge Tailwind classes (clsx + tailwind-merge) |
| `getLocalizedText` | `(field, locale) => string` | Extract locale string from JSONB field with `en` fallback |
| `formatDate` | `(dateStr, locale?) => string` | Locale-aware date formatting |
| `formatPrice` | `(amount, currency?) => string` | `Intl.NumberFormat` for LKR/USD |
| `slugify` | `(text) => string` | Convert text to URL-safe slug |
| `estimateReadTime` | `(html) => number` | Minutes to read based on word count |
| `generateExcerpt` | `(html, maxLength?) => string` | Strip HTML and truncate |
| `truncateText` | `(text, maxLength) => string` | Safe text truncation at word boundary |

All in `lib/supabase/queries.ts`:

| Function | Returns | Notes |
|----------|---------|-------|
| `getPublishedTours(params?)` | `{ tours, count }` | Filterable, paginated |
| `getFeaturedTours()` | `Tour[]` | Max 6, is_featured = true |
| `getTourBySlug(slug)` | `Tour \| null` | Published only |
| `getRelatedTours(category, excludeId)` | `Tour[]` | Max 3 in same category |
| `getPublishedBlogPosts(params?)` | `{ posts, count }` | Filterable, paginated |
| `getBlogPostBySlug(slug)` | `BlogPost \| null` | Published only |
| `getApprovedReviews(tourId?)` | `Review[]` | Optionally filtered by tour |
| `getAllMedia()` | `Media[]` | Ordered by upload date |
| `getDashboardStats()` | Stats object | 10 parallel queries |
