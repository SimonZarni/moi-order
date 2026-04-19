# Moi Order Admin Dashboard — CLAUDE.md

## Project Overview

Admin dashboard for **Moi Order**, a travel/lifestyle app targeting Myanmar and Southeast Asian users. Core products: 90-day embassy report service, attraction tickets, place listings, and travel services. Backend is Laravel REST API.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| UI Library | Material UI v6 (`@mui/material`) |
| Routing | React Router v6 |
| Charts | ApexCharts (`react-apexcharts`) |
| State | React local state (no Redux) |
| Styling | MUI `sx` prop + `minimal-shared` utils |
| Backend | Laravel REST API |
| Auth | Laravel Sanctum (token in localStorage) |
| User Login | Email, Google OAuth, Apple Sign-in, LINE Login |

---

## Sidebar Navigation Structure

```
Overview              /
Places                /places
  └─ Edit Place       /places/:id/edit
Attractions           /attractions
Bookings ▾
  All Bookings        /bookings
  90-Days Report      /bookings/report
Users                 /users
Payments              /payments
  └─ Payment Detail   /payments/:id
Other Services ▾
  Manage Services     /services
  Submissions         /services/submissions
    └─ Detail Page    /services/submissions/:id
Roles & Permissions   /roles
Reviews               /reviews
```

---

## Project File Structure

```
src/
├── types/index.ts              # All shared TypeScript types
├── pages/                      # Route entry points (lazy-loaded)
│   ├── dashboard.tsx
│   ├── places.tsx
│   ├── place-edit.tsx          # /places/:id/edit
│   ├── attractions.tsx
│   ├── bookings.tsx
│   ├── report.tsx              # 90-Day Report service builder
│   ├── users.tsx
│   ├── payments.tsx
│   ├── payment-detail.tsx      # /payments/:id
│   ├── services.tsx
│   ├── submissions.tsx
│   ├── submission-detail.tsx   # /services/submissions/:id
│   ├── roles.tsx
│   └── reviews.tsx
├── sections/
│   ├── overview/               # Main dashboard charts
│   ├── places/view/
│   │   ├── places-view.tsx     # Table + Add dialog; Edit → page
│   │   └── place-edit-view.tsx # Full page edit: info, gallery, contact
│   ├── attractions/view/
│   │   └── attractions-view.tsx # Cards with photos + pricing options
│   ├── bookings/view/
│   │   └── bookings-view.tsx
│   ├── report/view/
│   │   └── report-view.tsx     # 90-Day Report — service form builder
│   ├── users/view/
│   │   └── users-view.tsx
│   ├── payments/view/
│   │   ├── payments-view.tsx        # Stripe-style payment table
│   │   └── payment-detail-view.tsx  # Detail + comments
│   ├── services/view/
│   │   └── services-view.tsx        # Form builder
│   ├── submissions/view/
│   │   ├── submissions-view.tsx          # Table → navigates to detail
│   │   └── submission-detail-view.tsx    # Files + comments thread
│   ├── roles/view/
│   │   └── roles-view.tsx      # Admin accounts + permissions matrix
│   └── reviews/view/
│       └── reviews-view.tsx
├── layouts/
│   ├── dashboard/nav.tsx               # Collapsible sidebar nav
│   └── nav-config-dashboard.tsx        # Nav items definition
├── routes/sections.tsx                 # All route definitions
├── theme/                              # MUI theme (green: #10B981)
├── components/
│   ├── chart/                          # ApexCharts wrapper
│   ├── iconify/                        # Icon registry (STRICT type)
│   ├── label/                          # Status badges
│   ├── logo/                           # MO logo
│   └── scrollbar/
└── utils/
    ├── format-number.ts    # fNumber, fCurrency, fPercent
    └── format-time.ts      # fDate, fTime, fToNow
```

---

## Key Feature Descriptions

### Places (`/places`)
- Table with search, status filter, pagination, bulk select
- Add Place → dialog modal
- Edit Place → navigates to `/places/:id/edit` full page
- Edit page has: basic info, gallery management (upload/delete/download), contact info, Import/Export Excel buttons

### Attractions (`/attractions`)
- Card grid showing each attraction with cover photo, name, city, pricing
- Add/Edit dialog with: basic info, gallery management, and pricing options (multiple tiers with price + currency + description)
- Like a ticket listing: "Baiyoke Sky Hotel Dining — From 390 THB"

### 90-Day Report (`/bookings/report`)
- NOT an analytics dashboard — it's a SERVICE BUILDER
- Same UI as "Other Services" but for embassy 90-day reports (main product)
- 3 default service types: Normal, Urgent, Re-entry Permit
- Admin can create new service types, edit form fields for each
- Each form has dynamic fields: text, number, textarea, photo, select, date

### Payments (`/payments`)
- Stripe-style table: transaction ID, user, service, amount, status, date
- Summary cards: total revenue, paid, pending, refunded/failed
- Filters: search, service type, payment status
- Click row → navigates to `/payments/:id`
- Detail page: payment info, customer info, status management, comment thread

### Service Submissions (`/services/submissions`)
- Table of all user form submissions from any service
- Click row → navigates to `/services/submissions/:id` (NOT a modal)
- Detail page features:
  - Submission info + form data
  - **File Gallery**: grid of uploaded files, hover to preview/download individual, "Download All" button
  - **Comment Thread** (Facebook-style): admin/user messages, admin can attach photos, Enter to send
  - Status management (Pending/Completed/Cancelled)

### Roles & Permissions (`/roles`)
- Admin accounts table with role assignment
- 4 roles: Super Admin, Admin, Manager, Viewer
- Permission matrix table showing what each role can access
- Toggle active/inactive per admin

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Returns `{ token, user }` |
| POST | `/admin/logout` | Invalidate token |
| GET | `/admin/profile` | Current admin profile |
| PUT | `/admin/profile` | Update profile |

### Places
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/places?page=&per_page=&search=&status=` | List |
| POST | `/admin/places` | Create |
| GET | `/admin/places/:id` | Get single |
| PUT | `/admin/places/:id` | Update (name, description, gallery, contact, status) |
| DELETE | `/admin/places/:id` | Delete |
| POST | `/admin/places/:id/gallery` | Upload gallery photo |
| DELETE | `/admin/places/:id/gallery/:photoId` | Delete photo |
| GET | `/admin/places/export` | Export Excel |
| POST | `/admin/places/import` | Import Excel |

### Attractions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/attractions?page=&per_page=&search=&status=` | List |
| POST | `/admin/attractions` | Create with options |
| GET | `/admin/attractions/:id` | Get single |
| PUT | `/admin/attractions/:id` | Update |
| DELETE | `/admin/attractions/:id` | Delete |

**Attraction object:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "city": "string",
  "category": "string",
  "cover_url": "string",
  "gallery": ["url1", "url2"],
  "status": "active | inactive | pending",
  "sold_count": 0,
  "options": [
    { "id": "string", "name": "Adult Ticket", "price": 390, "currency": "THB", "description": "string" }
  ]
}
```

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/bookings?page=&per_page=&search=&status=` | List |
| GET | `/admin/bookings/:id` | Get single |
| PUT | `/admin/bookings/:id/status` | Update status |

### 90-Day Report Services (same as Services but separate endpoint)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/report-services` | List service types |
| POST | `/admin/report-services` | Create service type |
| PUT | `/admin/report-services/:id` | Update |
| DELETE | `/admin/report-services/:id` | Delete |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/payments?page=&per_page=&search=&status=&service_type=` | List |
| GET | `/admin/payments/:id` | Detail |
| PUT | `/admin/payments/:id/status` | Update status (paid/pending/refunded/failed) |
| GET | `/admin/payments/export` | Export CSV |

**Payment object:**
```json
{
  "id": "string",
  "transaction_id": "TXN-100001",
  "user_name": "string",
  "user_email": "string",
  "user_avatar": "url",
  "service_name": "string",
  "service_type": "ticket | service | booking | 90day-report",
  "amount": 45.00,
  "currency": "USD",
  "status": "paid | pending | refunded | failed",
  "paid_at": "ISO date"
}
```

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users?page=&per_page=&search=&status=` | List |
| GET | `/admin/users/:id` | Detail |
| PUT | `/admin/users/:id/ban` | Ban user |
| PUT | `/admin/users/:id/unban` | Unban user |

### Other Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/services` | List |
| POST | `/admin/services` | Create + fields |
| PUT | `/admin/services/:id` | Update |
| DELETE | `/admin/services/:id` | Delete |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/submissions?page=&per_page=&search=&status=&service_id=` | List |
| GET | `/admin/submissions/:id` | Detail with files + comments |
| PUT | `/admin/submissions/:id/status` | Update status |
| GET | `/admin/submissions/:id/files/:fileId/download` | Download single file |
| GET | `/admin/submissions/:id/files/download-all` | Download all as zip |
| POST | `/admin/submissions/:id/comments` | Add comment (text + optional files) |

**Submission object:**
```json
{
  "id": "string",
  "service_id": "string",
  "service_name": "string",
  "user_name": "string",
  "user_email": "string",
  "user_avatar": "url",
  "status": "pending | completed | cancelled",
  "data": { "Field Label": "user value" },
  "files": [
    { "id": "string", "name": "passport.jpg", "url": "url", "type": "image | document", "size": "245 KB" }
  ],
  "comments": [
    { "id": "string", "author": "Admin", "avatar_url": "url", "is_admin": true, "text": "string", "files": [], "created_at": "ISO date" }
  ],
  "submitted_at": "ISO date"
}
```

### Roles & Admin Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/admins` | List admin accounts |
| POST | `/admin/admins` | Create admin |
| PUT | `/admin/admins/:id` | Update (name, email, role) |
| PUT | `/admin/admins/:id/toggle` | Toggle active/inactive |
| DELETE | `/admin/admins/:id` | Delete (not super_admin) |

---

## Connecting Mock Data to Real API

All views currently use local mock data. Replace each one following this pattern:

```tsx
const [data, setData] = useState([]);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/places?page=${page + 1}&per_page=${rowsPerPage}&search=${filterName}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
    .then(r => r.json())
    .then(({ data, meta }) => { setData(data); setTotal(meta.total); })
    .finally(() => setLoading(false));
}, [page, rowsPerPage, filterName, filterStatus]);
```

For detail pages with `useParams`, use `id` param to fetch:
```tsx
const { id } = useParams();
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/submissions/${id}`, { ... })
    .then(r => r.json())
    .then(setSubmission);
}, [id]);
```

---

## Critical ESLint Rule: Import Sorting

Rule: `perfectionist/sort-imports` with `type: 'line-length', order: 'asc'`

**Groups (each separated by blank line):**
1. `import type` statements (all together, sorted by length)
2. External packages (`react`, `react-router-dom`, `minimal-shared`)
3. `@mui/material/...` imports (sorted by length)
4. `src/routes/...` imports
5. `src/utils/...` imports  ← **blank line required before next group**
6. `src/layouts/...` and other `src/...` imports
7. `src/components/...` imports
8. Relative `../` or `./` imports

**Within each group: shortest line first (line-length ascending)**

```tsx
// ✅ Correct
import type { Foo } from 'src/types';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
```

---

## Available Icons (STRICT — only these work)

The `icon` prop on `<Iconify>` is strictly typed. Only these names are valid:

```
solar:pen-bold               solar:eye-bold              solar:share-bold
solar:cart-3-bold            solar:restart-bold           solar:eye-closed-bold
solar:check-circle-bold      solar:trash-bin-trash-bold   solar:chat-round-dots-bold
solar:clock-circle-outline   solar:bell-bing-bold-duotone solar:home-angle-bold-duotone
solar:settings-bold-duotone  solar:shield-keyhole-bold-duotone
eva:more-vertical-fill       eva:search-fill              eva:done-all-fill
eva:checkmark-fill           eva:trending-down-fill       eva:trending-up-fill
eva:arrow-ios-forward-fill   eva:arrow-ios-downward-fill  eva:arrow-ios-upward-fill
ic:round-filter-list         mingcute:add-line            mingcute:close-line
carbon:chevron-sort          socials:google               socials:facebook
socials:github               socials:twitter              socials:linkedin
custom:menu-duotone
```

For dynamic icon lookups from a Record, type it as `Record<..., IconifyName>`:
```tsx
import type { IconifyName } from 'src/components/iconify';
const ICONS: Record<FieldType, IconifyName> = { text: 'solar:pen-bold', ... };
```

---

## TypeScript Fixes (Pre-applied)

```ts
// MUI v6: theme.shape.borderRadius is string | number — cast it
borderRadius: Number(theme.shape.borderRadius) * 2,  // ✅

// Chart height goes in sx, not as a prop
<Chart type="bar" series={...} options={...} sx={{ height: 260 }} />  // ✅

// Chip variant: only "outlined" | "filled" (no "soft")
<Chip variant="outlined" />  // ✅
```

---

## Theme

Primary green: `#10B981` (Emerald 500)

```ts
primary: { lighter: '#D1FAE5', light: '#6EE7B7', main: '#10B981', dark: '#059669', darker: '#065F46' }
```

---

## Adding a New Section

1. Create `src/sections/{name}/view/{name}-view.tsx`
2. Create `src/sections/{name}/view/index.ts` — `export { FooView } from './foo-view'`
3. Create `src/pages/{name}.tsx`
4. Add route in `src/routes/sections.tsx`
5. Add nav item in `src/layouts/nav-config-dashboard.tsx`

---

## Shared Components

| Component | Import | Usage |
|-----------|--------|-------|
| `<Label>` | `src/components/label` | `<Label color="success">Active</Label>` |
| `<Iconify>` | `src/components/iconify` | `<Iconify icon="solar:pen-bold" width={16} />` |
| `<Scrollbar>` | `src/components/scrollbar` | Wrap `<TableContainer>` |
| `<DashboardContent>` | `src/layouts/dashboard` | Page wrapper |
| `fDate(date)` | `src/utils/format-time` | Format dates |
| `fCurrency(n)` | `src/utils/format-number` | Format USD |
| `useRouter()` | `src/routes/hooks` | `.push('/path')` for navigation |
| `useParams()` | `react-router-dom` | Get `:id` from URL |

---

## Dev Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```
