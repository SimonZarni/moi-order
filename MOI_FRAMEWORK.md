# Moi Order — Framework Reference

> Living document. Update whenever a migration, model, or payment flow changes.
> Last updated: 2026-04-20

---

## 1. Project Layout

```
moi-order/
├── moi-order-backend/     Laravel 12 · PHP 8.3 · MySQL 8 · Redis
├── moi-order-frontend/    React Native · Expo · TypeScript 5
└── moi-order-admin/       React 18 · TypeScript · Vite · Material UI v6
```

API namespaces:
- `GET /api/v1/…`          — mobile app (Sanctum user tokens)
- `GET /api/admin/v1/…`    — admin dashboard (Sanctum admin tokens, AdminAuthenticate middleware)

---

## 2. Database Tables & Relationships

### 2.1 Entity Map

```
users
 ├── service_submissions  (user_id → users.id)
 │    ├── submission_documents  (submission_id → service_submissions.id)
 │    └── payments  [polymorphic payable]
 │
 ├── ticket_orders  (user_id → users.id)
 │    ├── ticket_order_items  (ticket_order_id → ticket_orders.id)
 │    │    └── ticket_variants  (ticket_variant_id → ticket_variants.id)
 │    └── payments  [polymorphic payable]
 │
 └── favorite_places  [pivot]  (user_id → users.id, place_id → places.id)

services
 └── service_types  (service_id → services.id)
      └── service_submissions  (service_type_id → service_types.id)

tickets
 ├── ticket_variants  (ticket_id → tickets.id)
 │    └── ticket_order_items
 └── ticket_images  (ticket_id → tickets.id)

places
 ├── place_images  (place_id → places.id)
 ├── categories  (category_id → categories.id)
 └── favorite_places  [pivot]

payments  (payable_type + payable_id → polymorphic)
```

---

### 2.2 Table Schemas

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| name | VARCHAR(255) | |
| email | VARCHAR(255) UNIQUE | |
| password | VARCHAR(255) | bcrypt hashed |
| date_of_birth | DATE NULL | |
| is_admin | BOOLEAN | default false |
| deleted_at | TIMESTAMP NULL | soft delete |

#### `services`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| name | VARCHAR(100) | Burmese |
| name_en | VARCHAR(100) | English |
| name_mm | VARCHAR(100) NULL | Myanmar (added later) |
| slug | VARCHAR(100) UNIQUE | |
| is_active | BOOLEAN | default true |
| deleted_at | TIMESTAMP NULL | |

#### `service_types`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| service_id | BIGINT FK → services.id | CASCADE |
| name / name_en / name_mm | VARCHAR(100) | multilingual |
| price | BIGINT UNSIGNED | **satangs** |
| field_schema | JSON NULL | dynamic form definition |
| is_active | BOOLEAN | |
| deleted_at | TIMESTAMP NULL | |

#### `service_submissions`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| user_id | BIGINT FK → users.id | CASCADE |
| service_type_id | BIGINT FK → service_types.id | RESTRICT |
| price_snapshot | BIGINT UNSIGNED | **satangs**, frozen at submit time |
| status | VARCHAR(20) | see SubmissionStatus enum |
| idempotency_key | CHAR(36) UNIQUE | UUID, prevents duplicate submissions |
| submission_data | JSON NULL | key→value answers from dynamic form |
| completed_at | TIMESTAMP NULL | |
| deleted_at | TIMESTAMP NULL | |

**SubmissionStatus values:** `pending_payment` → `processing` → `completed` / `payment_failed` / `cancelled`

#### `submission_documents`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| submission_id | BIGINT FK → service_submissions.id | CASCADE |
| document_type | VARCHAR(50) | CHECK constraint (enum values) |
| file_path | VARCHAR(500) | UUID-named path under `storage/app/private/` — **never serialised raw** |
| deleted_at | TIMESTAMP NULL | |

**Document types:** `passport_bio_page`, `visa_page`, `old_slip`, `identity_card_front`, `identity_card_back`, `tm30`, `upper_body_photo`, `airplane_ticket`, `passport_size_photo`

#### `tickets`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| name | VARCHAR(255) | |
| highlight_description | VARCHAR(500) | |
| description | TEXT | |
| google_maps_link | VARCHAR(2048) | |
| address | VARCHAR(500) | |
| city / province | VARCHAR(100) | |
| cover_image_path | VARCHAR(2048) | stored via FileStorageService |
| is_active | BOOLEAN | |
| sort_order | UNSIGNED INT | |
| deleted_at | TIMESTAMP NULL | |

#### `ticket_variants`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| ticket_id | BIGINT FK → tickets.id | CASCADE |
| name | VARCHAR(255) | e.g. "Adult", "Child" |
| description | TEXT NULL | |
| price | BIGINT UNSIGNED | **whole THB** ⚠️ (not satangs — see §4.1) |
| is_active | BOOLEAN | |
| sort_order | UNSIGNED INT | |
| deleted_at | TIMESTAMP NULL | |

#### `ticket_images`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| ticket_id | BIGINT FK → tickets.id | CASCADE |
| path | VARCHAR(2048) | stored via FileStorageService |
| sort_order | UNSIGNED SMALLINT | |
| INDEX | (ticket_id, sort_order) | |

#### `ticket_orders`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| user_id | BIGINT FK → users.id | RESTRICT |
| ticket_id | BIGINT FK → tickets.id | RESTRICT |
| visit_date | DATE | server-validated: today → today+6 days |
| status | VARCHAR(50) | see TicketOrderStatus enum |
| idempotency_key | CHAR(36) UNIQUE | UUID |
| eticket_path | VARCHAR(2048) NULL | path to generated PDF e-ticket |
| completed_at | TIMESTAMP NULL | |
| deleted_at | TIMESTAMP NULL | |

**TicketOrderStatus values:** `pending_payment` → `processing` → `completed` / `payment_failed`

#### `ticket_order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| ticket_order_id | BIGINT FK → ticket_orders.id | CASCADE |
| ticket_variant_id | BIGINT FK → ticket_variants.id | RESTRICT |
| quantity | TINYINT UNSIGNED | |
| price_snapshot | BIGINT UNSIGNED | **whole THB**, frozen at order time |

#### `payments`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| payable_type | VARCHAR(255) | `App\Models\ServiceSubmission` or `App\Models\TicketOrder` |
| payable_id | BIGINT UNSIGNED | ID in the payable table |
| stripe_intent_id | VARCHAR(255) UNIQUE | Stripe PaymentIntent ID |
| amount | BIGINT UNSIGNED | **satangs** (see §4.1 for TicketOrder caveat) |
| currency | CHAR(3) | default `thb` |
| status | VARCHAR(50) | `pending` → `succeeded` / `failed` |
| qr_image_url | TEXT NULL | Stripe-hosted PromptPay QR URL |
| expires_at | TIMESTAMP NULL | |
| stripe_payload | JSON NULL | full Stripe response — **write-once, never exposed via API** |
| idempotency_key | CHAR(36) UNIQUE | UUID |
| deleted_at | TIMESTAMP NULL | |

**INDEX:** `(payable_type, payable_id)` composite

---

### 2.3 How to Reach a User from a Payment

Payments have **no direct `user_id`** column. The chain is polymorphic:

```
payments.payable_type  ──►  'App\Models\ServiceSubmission'
payments.payable_id    ──►  service_submissions.id
                                └── service_submissions.user_id  ──►  users.id

payments.payable_type  ──►  'App\Models\TicketOrder'
payments.payable_id    ──►  ticket_orders.id
                                └── ticket_orders.user_id  ──►  users.id
```

In Eloquent (AdminPaymentService):
```php
Payment::with([
    'payable' => fn (MorphTo $q) => $q->morphWith([
        ServiceSubmission::class => ['user', 'serviceType.service'],
        TicketOrder::class       => ['user', 'ticket'],
    ]),
])
```

In AdminPaymentResource:
```php
$userName = null;
if ($this->relationLoaded('payable') && $this->payable !== null) {
    $userName = $this->payable->user?->name;
}
```

---

## 3. Payment Flows

### 3.1 Service Submission Payment Flow

```
Mobile App                   Backend                        Stripe
──────────                   ───────                        ──────
POST /service-submissions ──► ServiceSubmission created
                              status = pending_payment
                              idempotency_key = UUID

POST /payments (submission) ──► PaymentService::create()
                                → Stripe::paymentIntents()->create()
                                   amount: price_snapshot (satangs)
                                   currency: thb
                                   payment_method_types: [promptpay]
                              ◄── PaymentIntent + next_action.display_qr_code.image_url
                              Payment record created
                                status = pending
                                qr_image_url = Stripe QR URL
                              ◄── { qr_image_url, amount, expires_at }

User scans QR in banking app ─────────────────────────────► Stripe processes
                                                             Webhook fired ──►
                              POST /webhooks/stripe
                              PaymentService::handleWebhook()
                                Verify Stripe signature
                                Match payment_intent.id → Payment
                              [succeeded]
                                Payment.status = succeeded
                                ServiceSubmission.status = processing
                                event(SubmissionPaymentConfirmed)
                              [failed]
                                Payment.status = failed
                                ServiceSubmission.status = payment_failed
```

### 3.2 Ticket Order Payment Flow

```
Mobile App                   Backend                        Stripe
──────────                   ───────                        ──────
POST /ticket-orders ─────────► TicketOrder + TicketOrderItems created
                                status = pending_payment
                                price = sum of (variant.price × quantity) [whole THB]
                                idempotency_key = UUID

POST /payments (ticket_order) ► PaymentService::create()
                                amount = TicketOrder::getPayableAmountSatangs()
                                       = getPayableAmountThb() × 100
                              ◄── Same QR flow as above

[succeeded webhook]
  Payment.status = succeeded
  TicketOrder.status = processing
  event(TicketOrderPaymentConfirmed)
  → Listener generates PDF e-ticket → stored at eticket_path
  → TicketOrder.status = completed
```

### 3.3 QR Code — Where Images Live

The `qr_image_url` column stores a **Stripe-hosted URL** (not a local file). Stripe generates a PromptPay QR PNG and serves it from their CDN. The full Stripe response (including the image URL) is also archived in `stripe_payload` for audit.

No QR image bytes are stored in our filesystem or S3.

### 3.4 Webhook Deduplication

Every Stripe webhook carries a unique event ID. The webhook handler:
1. Verifies the `Stripe-Signature` header against `STRIPE_WEBHOOK_SECRET`
2. Looks up the `Payment` by `stripe_intent_id`
3. Checks current `Payment.status` — if already terminal (`succeeded`/`failed`), returns 200 immediately (idempotent)
4. Wraps state changes in `DB::transaction()`

---

## 4. Money Handling

### 4.1 Units at Each Layer

| Location | Unit | Example |
|----------|------|---------|
| `service_types.price` | satangs | 15000 = ฿150 |
| `service_submissions.price_snapshot` | satangs | 15000 = ฿150 |
| `ticket_variants.price` | **whole THB** ⚠️ | 150 = ฿150 |
| `ticket_order_items.price_snapshot` | **whole THB** ⚠️ | 150 = ฿150 |
| `payments.amount` | satangs | 15000 = ฿150 |
| `TicketOrder::getPayableAmountThb()` | whole THB | 150 |
| `TicketOrder::getPayableAmountSatangs()` | satangs | 15000 |
| Stripe API call | satangs | 15000 |
| Admin dashboard `fCurrency()` | **divide by 100 first** | `fCurrency(amount / 100)` |
| Mobile `formatPrice()` | **divide by 100 first** | `formatPrice(amount / 100)` |

> ⚠️ `ticket_variants.price` is the one inconsistency — it was designed as whole THB because tickets display prices directly without sub-unit granularity. Always convert via `getPayableAmountSatangs()` before passing to Stripe.

### 4.2 Server is Source of Truth

- Client **never** sends a price to the backend.
- Payment amount is always read from `price_snapshot` (ServiceSubmission) or computed via `getPayableAmountSatangs()` (TicketOrder).
- Admin can never override payment amount — `amount` on Payment is write-once at creation.

---

## 5. File Storage

All file I/O goes through `FileStorageInterface` (`app/Contracts/FileStorageInterface.php`) implemented by `FileStorageService`. **Never call `Storage::disk()` directly.**

| Asset | Stored At | Served Via |
|-------|-----------|------------|
| Submission documents | `storage/app/private/submissions/{uuid}` | Signed URL, 30 min TTL |
| Ticket cover images | `storage/app/private/tickets/{uuid}` | Signed URL, 30 min TTL |
| Ticket gallery images | `storage/app/private/tickets/{ticket_id}/{uuid}` | Signed URL, 30 min TTL |
| Place images | `storage/app/private/places/{place_id}/{uuid}` | Signed URL, 30 min TTL |
| E-tickets (PDF) | `storage/app/private/etickets/{uuid}.pdf` | Signed URL, 30 min TTL |
| Payment QR codes | Stripe CDN (URL in `payments.qr_image_url`) | Direct URL |

Raw `file_path` / `path` columns are **hidden** on all models and never returned by any Resource.

---

## 6. Authentication

### 6.1 Mobile (User)
- Laravel Sanctum personal access tokens
- Login via email+password, Google OAuth, Apple Sign-in, LINE Login
- Token stored in `expo-secure-store` (never AsyncStorage)
- 401 response → immediate logout + token deletion (no silent refresh)
- Abilities are explicit per `createToken()`

### 6.2 Admin
- Separate `admins` table, separate Sanctum token guard
- `AdminAuthenticate` middleware on all `/api/admin/v1/…` routes
- Admin token never stored in mobile app

---

## 7. Key Enums

### PaymentStatus
| Value | Meaning |
|-------|---------|
| `pending` | QR generated, awaiting scan |
| `succeeded` | Stripe confirmed payment |
| `failed` | Stripe reported failure or expired |

### SubmissionStatus
| Value | Meaning |
|-------|---------|
| `pending_payment` | Created, no successful payment yet |
| `processing` | Payment confirmed, admin working on it |
| `payment_failed` | Payment failed |
| `completed` | Admin marked complete |
| `cancelled` | Cancelled |

### TicketOrderStatus
| Value | Meaning |
|-------|---------|
| `pending_payment` | Order placed, awaiting payment |
| `processing` | Paid, e-ticket being generated |
| `payment_failed` | Payment failed |
| `completed` | E-ticket issued |

---

## 8. Idempotency

Both `service_submissions` and `ticket_orders` carry a `idempotency_key` (UUID v4, client-generated). The backend has a UNIQUE index on this column. A duplicate submission returns the existing record with HTTP 200 instead of creating a new one.

Same pattern applies to `payments.idempotency_key` — a retry with the same key returns the stored Payment.

---

## 9. API Response Shapes

```jsonc
// Single resource
{ "data": { ...fields } }

// List with pagination
{
  "data": [ ...items ],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 20,
    "total": 72
  }
}

// Error (all errors)
{
  "message": "human readable",
  "code": "machine_readable_snake_case",
  "errors": { "field": ["message"] }   // only on 422
}
```

HTTP status codes:
| Code | When |
|------|------|
| 200 | Successful read / update |
| 201 | Resource created |
| 204 | Deleted (no body) |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role / not your resource) |
| 404 | Record not found |
| 409 | Business rule violated (DomainException) |
| 422 | Validation failed |
| 500 | Unexpected server error |

---

## 10. SOLID Quick-Reference

| Layer | Rule |
|-------|------|
| Controller | HTTP only. ≤ 20 lines/action. One service call. Never touches DB. |
| Service | All business logic. Receives DTO. `DB::transaction()` on multi-table writes. |
| FormRequest | All validation + authorization. Never passed to Service — extract DTO in Controller. |
| Model | Fillable explicit. Domain methods guard transitions. Named scopes. SoftDeletes. |
| Resource | Explicit `toArray()`. Sensitive fields never present. Raw paths never present. |
| Event/Listener | Listeners `ShouldQueue` by default. Failure never rolls back original transaction. |

---

## 11. Common Gotchas

1. **`ticket_variants.price` is whole THB, not satangs** — use `getPayableAmountSatangs()` before sending to Stripe.
2. **`submission_documents.file_path` is hidden** — always serve via signed URL through `FileStorageService::url()`.
3. **Payment has no `user_id`** — reach user through `payable → user` (two hops via polymorphic relation).
4. **QR image URL** — lives on Stripe CDN, stored as plain URL in `payments.qr_image_url`. It expires. Full payload in `stripe_payload` for audit.
5. **Soft deletes on all business entities** — admin queries use `withTrashed()`, restore uses plain `$id` (not route model binding).
6. **`price_snapshot` is immutable** — captured at submission/order time. Never recalculate from current `service_types.price`.
7. **Admin currency display** — always `fCurrency(amount / 100)` because `payments.amount` is satangs.
8. **Mobile currency display** — always `formatPrice(amount / 100)` for the same reason.
