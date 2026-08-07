# Wanderlust - Travel Packages & Booking Client

A modern, responsive web application for viewing luxury travel packages and booking slots in real time. Built with **Next.js (App Router)**, **Redux Toolkit (RTK Query)**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- ✈️ **Travel Packages Listing**: View all available travel packages fetched dynamically from the Express/MongoDB backend via RTK Query.
- ⚡ **Instant Slot Counter Reflection**: Clicking **"Book Now"** instantly decrements the package's `availableSlots` count in **< 1ms** using RTK Query **optimistic cache updates** (`onQueryStarted`) without requiring a hard page refresh.
- 🔄 **Automatic Tag Invalidation**: Background re-synchronization with MongoDB state via RTK Query `providesTags` and `invalidatesTags`.
- 🛡️ **Interactive Slot Control**:
  - Highlights slot changes with a pulse animation.
  - Automatically transitions button state to **"Fully Booked"** and disables booking when `availableSlots === 0`.
- 🔍 **Search, Filter & Sort**: Search destinations by title/description, filter by availability status (*All*, *Available*, *Sold Out*), and sort by price or available slots.
- ➕ **Add Custom Packages**: Built-in modal form to test `POST /api/packages` directly from the UI.
- 🔔 **Toast Feedback System**: Visual feedback alerts for booking confirmations and server errors.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4 (Dark mode theme & custom glassmorphism effects)
- **Icons**: Lucide React
- **Language**: TypeScript

---

## 🛠️ API Integration Specifications

Connected to Express/MongoDB backend at `http://localhost:8000/api` (configurable via `NEXT_PUBLIC_API_BASE_URL`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/packages` | Fetch all travel packages |
| `POST` | `/api/packages` | Create a new travel package |
| `GET` | `/api/packages/:id` | Fetch details for a specific package |
| `POST` | `/api/packages/:id/book` | Book 1 slot for a travel package |

---

## 📁 Project Structure

```
travel-client/
├── app/
│   ├── globals.css         # Global Tailwind styles & font declarations
│   ├── layout.tsx          # Root layout shell with ReduxProvider wrapper
│   └── page.tsx            # Main Travel Packages dashboard page
├── components/
│   ├── PackageCard.tsx     # Travel card with instant slot decrement & book button
│   ├── Navbar.tsx          # Top navigation bar & API status indicator
│   ├── CreatePackageModal.tsx # Form modal to add new packages
│   └── Toast.tsx           # Success & error toast notifications
├── lib/
│   └── redux/
│       ├── provider.tsx    # 'use client' Redux Provider wrapper
│       ├── store.ts        # Redux store configuration with RTK Query middleware
│       ├── types.ts        # TypeScript data interfaces
│       └── services/
│           └── packagesApi.ts # RTK Query API slice with query/mutation logic
├── public/                 # Static assets & destination card imagery
├── THINKING.md             # Architectural strategy, caching design & bug reports
└── README.md               # Project documentation
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+) or Bun (v1.0+)
- Express & MongoDB backend running on `http://localhost:3000`

### 1. Installation
Clone the repository and install dependencies:

```bash
bun install
# or
npm install
```

### 2. Environment Variables (Optional)
If your Express server is running on a port other than `3000`, create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3. Run Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is used by your API server) in your browser.

---

## 📖 Architecture & Design Thinking

For an in-depth breakdown of:
- Next.js **Server vs. Client Components** strategy
- **RTK Query Optimistic Updates** & Cache Management
- Bug resolution (Turbopack font loader fix)

Please read [`THINKING.md`](./THINKING.md).
