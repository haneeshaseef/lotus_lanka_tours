# 📡 API Reference — Lotus Lanka Tours

All API routes are under `/api/`. Public routes require no authentication. Admin routes require a valid Clerk session with `role: "admin"` in public metadata.

---

## Public Endpoints

### `GET /api/tours`

Returns paginated, published tours.

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category slug |
| `duration` | number | — | Filter by exact duration in days |
| `search` | string | — | Full-text search on title/description (English) |
| `page` | number | 1 | Page number |
| `limit` | number | 12 | Results per page |

**Response `200`**

```json
{
  "tours": [ { "id": "...", "slug": "...", "title": { "en": "...", "si": "...", "ta": "..." }, ... } ],
  "count": 42
}
```

---

### `GET /api/tours/[slug]`

Returns a single published tour by slug.

**Response `200`** — Tour object  
**Response `404`** — `{ "error": "Not found" }`

---

### `POST /api/inquiries`

Submit a tour inquiry.

**Request body**

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+94771234567",
  "tourId": "uuid-optional",
  "tourName": "Sigiriya Day Tour",
  "travelDate": "2025-03-15",
  "guests": 2,
  "message": "We'd like a private vehicle.",
  "locale": "en"
}
```

**Response `200`** — `{ "success": true }`  
**Response `400`** — `{ "error": "Validation error message" }`

Side effects:
- Saves inquiry to `inquiries` table with `status: "new"`
- Sends confirmation email to tourist
- Sends notification email to admin

---

### `POST /api/custom-tour`

Submit a custom tour request.

**Request body**

```json
{
  "name": "Alice Wong",
  "email": "alice@example.com",
  "phone": "+65XXXXXXXX",
  "destinations": ["Kandy", "Ella", "Mirissa"],
  "durationDays": 7,
  "travelDate": "2025-04-20",
  "guests": 4,
  "interests": ["Cultural", "Wildlife", "Food"],
  "budgetTier": "mid",
  "budgetLkr": 500000,
  "specialRequests": "Vegetarian meals throughout."
}
```

**Response `200`** — `{ "success": true }`  
**Response `400`** — `{ "error": "..." }`

Side effects:
- Saves to `custom_tour_requests` with `status: "new"`
- Sends confirmation email to tourist
- Sends notification email to admin

---

### `POST /api/reviews`

Submit a tour review (pending approval).

**Request body**

```json
{
  "tourId": "uuid",
  "reviewerName": "Marcus T.",
  "reviewerCountry": "Germany",
  "rating": 5,
  "comment": "Absolutely amazing experience!"
}
```

**Response `200`** — `{ "success": true }`  
**Response `400`** — `{ "error": "..." }`

The review is saved with `is_approved: false`. It appears on the site only after an admin approves it.

---

### `GET /api/blog`

Returns paginated, published blog posts.

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category label |
| `page` | number | 1 | Page number |
| `limit` | number | 12 | Results per page |

**Response `200`**

```json
{
  "posts": [ { "id": "...", "slug": "...", "title": { "en": "..." }, ... } ],
  "count": 15
}
```

---

### `GET /api/media`

Returns all media items ordered by upload date (newest first).

**Response `200`**

```json
[
  {
    "id": "uuid",
    "filename": "sigiriya-hero.jpg",
    "url": "https://<project>.supabase.co/storage/v1/object/public/media/sigiriya-hero.jpg",
    "size_bytes": 204800,
    "mime_type": "image/jpeg",
    "uploaded_at": "2025-01-15T10:30:00Z"
  }
]
```

---

## Admin Endpoints

> All admin endpoints return `403 { "error": "Unauthorized" }` if the caller is not authenticated with `role: "admin"`.

---

### Tours

#### `POST /api/admin/tours`

Create a new tour.

**Request body** — Tour fields (see [Data Models](./IMPLEMENTATION.md#2-data-models))

```json
{
  "title": { "en": "New Tour", "si": "...", "ta": "..." },
  "description": { "en": "<p>...</p>" },
  "slug": "new-tour",
  "category": "cultural",
  "duration_days": 2,
  "max_group_size": 10,
  "difficulty": "moderate",
  "price_per_person": 95.00,
  "is_published": false,
  "is_featured": false,
  "includes": ["Hotel pickup", "Guide"],
  "excludes": ["Meals"]
}
```

**Response `201`** — Created tour object

---

#### `PATCH /api/admin/tours/[id]`

Update any tour fields (partial update).

```json
{ "is_published": true }
```

**Response `200`** — `{ "success": true }`

---

#### `DELETE /api/admin/tours/[id]`

Permanently delete a tour.

**Response `200`** — `{ "success": true }`

---

#### `GET /api/admin/tours/[id]`

Fetch a single tour by ID (includes drafts).

**Response `200`** — Tour object

---

### Inquiries

#### `PATCH /api/admin/inquiries/[id]`

Update inquiry fields (e.g. change status).

```json
{ "status": "replied" }
```

Valid statuses: `"new"` · `"replied"` · `"closed"`

**Response `200`** — `{ "success": true }`

---

#### `DELETE /api/admin/inquiries/[id]`

Permanently delete an inquiry.

**Response `200`** — `{ "success": true }`

---

### Reviews

#### `PATCH /api/admin/reviews/[id]`

Approve or reject a review.

```json
{ "is_approved": true }
```

**Response `200`** — `{ "success": true }`

---

#### `DELETE /api/admin/reviews/[id]`

Permanently delete a review.

**Response `200`** — `{ "success": true }`

---

### Custom Tour Requests

#### `PATCH /api/admin/custom-requests/[id]`

Update status of a custom request.

```json
{ "status": "quoted" }
```

Valid statuses: `"new"` · `"in-progress"` · `"quoted"` · `"closed"`

**Response `200`** — `{ "success": true }`

---

### Blog

#### `POST /api/admin/blog`

Create a blog post.

```json
{
  "title": { "en": "Top 10 Things to Do in Kandy" },
  "content": { "en": "<p>...</p>" },
  "slug": "top-10-kandy",
  "author": "Kasun Fernando",
  "category": "Travel Tips",
  "is_published": false
}
```

**Response `201`** — Created post object

---

#### `PATCH /api/admin/blog/[id]`

Update a blog post.

**Response `200`** — `{ "success": true }`

---

#### `DELETE /api/admin/blog/[id]`

Permanently delete a blog post.

**Response `200`** — `{ "success": true }`

---

### Media

#### `POST /api/admin/media/upload`

Upload one or more image files.

**Request** — `multipart/form-data` with field name `files` (multiple allowed)

**Response `201`**

```json
{
  "uploaded": [
    {
      "id": "uuid",
      "filename": "my-photo.jpg",
      "url": "https://<project>.supabase.co/storage/v1/object/public/media/1234567890-abc.jpg",
      "size_bytes": 512000,
      "mime_type": "image/jpeg"
    }
  ]
}
```

Files that fail to upload are silently skipped; successfully uploaded ones are returned.

---

#### `DELETE /api/admin/media/[id]`

Delete a media file from both Supabase Storage and the `media` table.

**Response `200`** — `{ "success": true }`

---

## Error Format

All error responses follow this shape:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes used:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 403 | Unauthorized (not admin) |
| 404 | Resource not found |
| 500 | Server / database error |
