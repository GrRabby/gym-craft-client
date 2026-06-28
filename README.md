<div align="center">

# 🏋️ GymCraft

**Forge Your Strongest Self.**

A production-grade gym & fitness management platform with role-based dashboards, Stripe-powered class booking, a community forum, and rich platform analytics.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Embedded%20Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)


</div>

---

## 📑 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🎨 Design System](#-design-system)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔌 Key API Endpoints](#-key-api-endpoints)
- [🔒 Security Highlights](#-security-highlights)
- [🎓 What I Learned](#-what-i-learned)
- [👤 Author](#-author)

---

## 🎯 Overview

GymCraft is a role-based fitness platform where three audiences meet:

| Role | What They Do |
|------|--------------|
| 👤 **Member** | Browse classes, book sessions, favorite trainers, comment on the community forum |
| 🏋️ **Trainer** | Create and manage classes, share insights as forum posts, track student enrollment |
| 🛡️ **Admin** | Moderate users, classes, and posts — view platform-wide analytics |

The entire experience runs on a custom **"Forge"** design system — gold-on-black aesthetic with signature chamfered geometry on every surface. Built with consumer-grade polish that you'd expect from a real fitness SaaS product.

---

## ✨ Features

### 🌍 Public (No Login Required)

- 🏠 **Home Page** — Hero, featured classes (ranked by bookings), how-it-works flow, BMI calculator, latest forum posts, six discipline categories
- 💪 **All Classes** — Server-side pagination, search across class name + trainer, category multi-select filter, animated grid transitions
- 💬 **Community Forum** — Server-side pagination + search across title, description, and author name
- 📊 **BMI Calculator** — Live calculation, metric/imperial toggle, animated range marker, color-coded category, GymCraft-tied recommendations

### 🔐 Authenticated (All Roles)

- 💳 **Stripe Embedded Checkout** — One-click class booking with USD pricing, idempotent booking creation
- 👍 **Vote on Forum Posts** — Like / Dislike with one-vote-per-user constraint at the DB level
- 💬 **Threaded Comments** — Post, reply, edit your own, delete your own — with cascade delete that takes replies with it
- 🔔 **In-App Notifications** — Bell icon in navbar with unread badge, 30-second polling, tab-focus refresh, optimistic mark-as-read

### 👤 Member Dashboard

- 📊 **Overview** — Stats cards, profile, prominent trainer application card with status-aware messaging
- 📅 **Booked Classes** — Server-rendered table with schedule and trainer details
- ⭐ **Favorite Classes** — Optimistic delete with framer-motion exit animation
- 📝 **Apply as Trainer** — Status-aware flow (pending / approved / rejected with feedback + reapply)

### 🏋️ Trainer Dashboard

- 📊 **Overview** — Linked stat card (Classes Created) + passive stat (Students Enrolled)
- ➕ **Add Class** — Cloudinary image upload, schedule builder, duration & price
- ✍️ **Add Forum Post** — Imgbb image upload (server-side, key never reaches browser), title + description + image
- 📰 **My Forum Posts** — Grid view with delete confirmation toast, optimistic remove

### 🛡️ Admin Dashboard

- 📊 **Overview with Analytics** — Recharts visualizations:
  - 📈 Area chart of bookings over the last 30 days (gold gradient fill)
  - 🍩 Donut chart of users by role (with center label)
  - 📊 Horizontal bar chart of bookings by category
- 👥 **Manage Users** — Block, unblock, change role, demote trainers
- 📋 **Applied Trainers** — Approve / reject with feedback (triggers in-app notification to member)
- ✅ **Manage Trainers** — View all trainers, demote back to member
- 🎯 **Manage Classes** — Approve, reject, or delete (with paid-booking guard)
- 📝 **Add Forum Post** — Same form as trainer with admin role permission
- 🗑️ **Forum Post Manage** — Moderate any post, search by title/author/content, cascade-deletes votes and comments

### ⚙️ Cross-Cutting Features

| Feature | Detail |
|---------|--------|
| 🔒 **Layout-level role guards** | `/dashboard/{role}/**` enforces access at the layout, not the page |
| ⚡ **Optimistic UI** | Every mutation updates UI immediately, rolls back on server failure |
| 🌊 **Cascade deletes** | Deleting a post takes its votes and comments; deleting a top-level comment takes its replies |
| 🔎 **Server-side search** | URL-driven (`?search=...`), debounced input (350 ms), regex-escaped, multi-field |
| 📄 **Server-side pagination** | `?page=N&limit=12` with smart pager (first/last + window + ellipses) |
| 🎬 **framer-motion animations** | Grid transitions, modal entrances, comment exits |
| 🔔 **In-app notifications** | Generic type system, easily extensible to new event kinds |

---

## 🛠️ Tech Stack

### Frontend

| Tech | Purpose |
|------|---------|
| ⚡ **Next.js 16** | App Router, Turbopack dev server, server components |
| ⚛️ **React 19** | UI primitives |
| 🎨 **Tailwind CSS v4** | Utility-first styling |
| 🎭 **HeroUI v3** | Headless component primitives |
| 🔑 **Better Auth** | Email/password + Google OAuth, JWT tokens via JWKS |
| 🎬 **framer-motion** | Animations and transitions |
| 📊 **Recharts** | Admin analytics visualizations |
| 🎯 **lucide-react** | Icon set across the entire app |
| 💳 **@stripe/stripe-js** | Embedded Checkout client |
| 🍞 **sonner** | Toast notifications |

### Backend

| Tech | Purpose |
|------|---------|
| 🚂 **Express** | REST API server |
| 🍃 **MongoDB + Mongoose** | Document store + schemas |
| 🔐 **Better Auth (JWT)** | Token-based auth verified via JWKS |
| 💵 **Stripe** | Embedded Checkout sessions, idempotent booking |
| ☁️ **Cloudinary** | Class image hosting |
| 🖼️ **Imgbb** | Forum image hosting (server-side upload) |
| 🛡️ **jose** | JWT verification against JWKS endpoint |

---

## 🎨 Design System

The **"Forge"** identity uses a consistent visual language across every page:

- 🌑 **Background palette** — `#050505`, `#070707`, `#0a0a0a`, `#0f0f0f` (layered blacks)
- ✨ **Gold gradient** — `#F7E4A3 → #E8C667 → #C9962E` for CTAs and highlights
- 📝 **Typography** — Bebas Neue for headlines, Oswald for UI labels (uppercase + tracked)
- 🔷 **Chamfered geometry** — Signature angled corners on cards, buttons, and inputs via `clip-path`
- 💫 **Ambient glows** — Subtle blurred gold radial backgrounds in corners
- 🚦 **Status colors** — Green (#4ade80), Gold (#E8C667), Red (#ff5a5a) used consistently across states

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│  Next.js Client (App Router)        │
│  ───────────────────────────────    │
│  • Server Components (default)      │
│  • Client Components (interactive)  │
│  • Server Actions (mutations)       │
└──────────────┬──────────────────────┘
               │ JWT Bearer
               ▼
┌─────────────────────────────────────┐
│  Express API Server                 │
│  ───────────────────────────────    │
│  • verifyToken (jose + JWKS)        │
│  • requireRole + requireActiveUser  │
│  • Route-level middleware chains    │
└──────────────┬──────────────────────┘
               │ Mongoose
               ▼
┌─────────────────────────────────────┐
│  MongoDB                            │
│  ───────────────────────────────    │
│  user, classes, bookings,           │
│  favorites, forum_posts,            │
│  post_votes, comments,              │
│  notifications, trainer_applications│
└─────────────────────────────────────┘
```

**Key architectural decisions:**

- 🔁 **Optimistic-first mutations** — UI updates instantly, rolls back on server failure
- 🎯 **Single-endpoint state changes** — Vote toggling and comment threading are one endpoint each, server figures out the right transition
- 📦 **`$facet` aggregations** — Combined data + count queries on paginated endpoints (single round trip)
- 🔄 **Cascade deletes in handler logic** — No DB-level cascades; explicit parallel `deleteMany` calls keep behavior visible
- 🚪 **Layout-level auth gates** — One check per role-section, not repeated on every page

---

### ▶️ Running

```bash
# Terminal 1 — Backend
cd gym-craft-server
npm run dev          # Express on http://localhost:5000

# Terminal 2 — Frontend
cd gym-craft-client
npm run dev          # Next.js on http://localhost:3000
```

Then visit 👉 **http://localhost:3000**

### 🧪 Test Cards (Stripe)

| Card | Behavior |
|------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires 3D Secure |

Use any future expiry date and any 3-digit CVC.

---

## 📁 Project Structure

```
gym-craft/
│
├── 🚂 gym-craft-server/             # Express backend
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  #   Better Auth singular "user"
│   │   ├── GymClass.js              #   Classes
│   │   ├── Booking.js               #   Paid bookings (partial unique idx)
│   │   ├── Favorite.js              #   User favorites
│   │   ├── ForumPost.js             #   Community posts
│   │   ├── PostVote.js              #   Like/dislike (unique idx)
│   │   ├── Comment.js               #   Threaded comments
│   │   ├── Notification.js          #   In-app notifications
│   │   └── TrainerApplication.js    #   Trainer applications
│   ├── routes/                      # API endpoints
│   │   ├── classes.js
│   │   ├── bookings.js
│   │   ├── favorites.js
│   │   ├── checkout.js
│   │   ├── forum-posts.js
│   │   ├── post-votes.js
│   │   ├── comments.js
│   │   ├── notifications.js
│   │   ├── trainer-applications.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js                  # verifyToken, requireRole, requireActiveUser
│   ├── config/db.js
│   └── server.js
│
└── ⚡ gym-craft-client/              # Next.js frontend
    ├── app/                         # App Router
    │   ├── page.jsx                 #   Public home
    │   ├── classes/                 #   Public classes list + auth-gated details
    │   ├── forum/                   #   Public forum list + auth-gated details
    │   ├── login/  register/
    │   └── dashboard/
    │       ├── layout.jsx           # Auth-required base layout
    │       ├── member/              # Role layout + pages
    │       ├── trainer/
    │       └── admin/
    ├── components/                  # Reusable UI
    │   ├── home/                    # Home page sections
    │   ├── NotificationBell.jsx
    │   ├── CommentsSection.jsx
    │   ├── PostVoteButtons.jsx
    │   ├── ClassesGrid.jsx
    │   ├── ForumGrid.jsx
    │   └── ...
    ├── actions/                     # Server actions
    │   ├── classes.js
    │   ├── bookings.js
    │   ├── forum-posts.js
    │   ├── comments.js
    │   ├── notifications.js
    │   └── ...
    └── lib/
        ├── api-token.js             # JWT helper
        ├── auth.js                  # Better Auth config
        └── permissions.js           # getCurrentUser
```

---

## 🔌 Key API Endpoints

### 🌍 Public

```
GET    /api/classes/public                  Paginated, searchable, filtered class list
GET    /api/classes/public/featured         Top classes by booking count
GET    /api/forum-posts/public              Paginated, searchable forum posts
```

### 🔐 Authenticated

```
POST   /api/checkout/session                Create Stripe Checkout session
GET    /api/checkout/session-status/:id     Idempotent booking creation
GET    /api/bookings/me                     My paid bookings
GET    /api/favorites/me                    My favorites
POST   /api/favorites                       Add favorite
DELETE /api/favorites/:classId              Remove favorite
GET    /api/forum-posts/:id                 Post details with vote counts
POST   /api/post-votes                      Toggle/switch vote
GET    /api/comments?postId=                Comments for a post
POST   /api/comments                        Create comment (one-level threading)
PATCH  /api/comments/:id                    Edit own
DELETE /api/comments/:id                    Hard delete (cascade for top-level)
GET    /api/notifications/me                My notifications + unread count
PATCH  /api/notifications/:id/read          Mark single read
PATCH  /api/notifications/read-all          Mark all read
```

### 🛡️ Admin Only

```
GET    /api/admin/stats                     Platform analytics (6 aggregations)
GET    /api/users                           All users
PATCH  /api/users/:id/status                Block/unblock
PATCH  /api/users/:id/role                  Promote/demote
GET    /api/forum-posts                     All posts with author info
```

---

## 🔒 Security Highlights

- 🛡️ **JWT verification via JWKS** — Tokens validated against Better Auth's JWKS endpoint, no secret sharing
- 🚪 **Layered access control** — `verifyToken` → `requireRole` → `requireActiveUser` middleware chain
- 🔐 **DB-level constraints** — Unique indexes prevent duplicate bookings (per user per class), duplicate votes (per user per post), duplicate favorites
- 🧹 **Regex escaping** — All user-input search terms escaped before MongoDB regex match
- 🚷 **Owner-or-admin checks** — Comment edit/delete, forum post delete, etc. enforce ownership at the API layer
- 🔒 **Image upload key isolation** — Imgbb API key is server-side only (`IMGBB_API_KEY`, no `NEXT_PUBLIC_` prefix)
- ⛔ **Soft-banned user gating** — `requireActiveUser` blocks every mutation for users with `status: "blocked"`

---

## 🎓 What I Learned

This project pushed me through several non-trivial technical decisions:

- 🎯 **Optimistic UI vs. Pessimistic UI** — When to update locally first vs. wait for the server (votes are optimistic; comments are pessimistic because we need the real ID)
- 🔄 **Server actions vs. API routes** — Server actions trigger auto-refresh that breaks sticky scrolling; thin API routes bypass this for in-page mutations
- 🧬 **One-level threading vs. infinite nesting** — Server-side flattening of reply parents prevents deep trees regardless of client behavior
- 📦 **MongoDB `$facet`** — Single-aggregation data + count for paginated endpoints saves a round trip
- 🪢 **Cascade ordering** — Delete children first, parent second. If cascade fails, parent stays around for retry rather than orphaning data
- 🚨 **Webhook-free Stripe** — Idempotent booking creation via sparse unique index on `stripeSessionId` lets the return URL flow work without webhooks
- 🎬 **`framer-motion` `popLayout` mode** — Smooth grid reflow when individual items exit (vs. items snapping to new positions)


---

## 👤 Author

<div align="center">

**Gulam Robbani Rappy** (Rabby)

🌍 *Full-stack developer based in Sylhet, Bangladesh*

[![GitHub](https://img.shields.io/badge/GitHub-GrRabby-181717?style=for-the-badge&logo=github)](https://github.com/GrRabby)
[![Email](https://img.shields.io/badge/Email-grrabby9%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:grrabby9@gmail.com)

</div>

---

<div align="center">

⭐ **If you find this project useful, give it a star!**

*Built with ☕ in Sylhet 🇧🇩*

</div>