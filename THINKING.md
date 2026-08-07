# Development & Architectural Thinking Document

This document outlines the architectural strategy, state management design, bug resolution, and local execution instructions for the **Wanderlust Travel Packages & Booking Client**.

---

## 1. Next.js Component Structure Strategy (Server vs. Client Components)

Next.js App Router defaults to Server Components for performance and SEO. However, interactive state management requires client-side execution. Our component tree is structured as follows:

```
app/layout.tsx (Server Component Entrypoint)
  └── ReduxProvider ('use client' Wrapper)
        └── app/page.tsx ('use client' Interactive Page Component)
              ├── Navbar ('use client')
              ├── PackageCard ('use client')
              ├── ToastContainer ('use client')
              └── CreatePackageModal ('use client')
```

### Key Decisions:
- **`app/layout.tsx` (Server Component)**: Serves as the top-level HTML document shell, defining metadata (title, meta tags) and global font fallbacks. It delegates stateful client context to `ReduxProvider`.
- **`lib/redux/provider.tsx` (`'use client'`)**: Wraps the React tree with Redux `<Provider store={store}>`, allowing RTK Query hooks and Redux state to be accessed across all descendant components without converting the entire layout into a client boundary.
- **`app/page.tsx` & Sub-components (`'use client'`)**: The main page and its child components handle real-time user interactions, local state (search, filter, modal visibility, toast timers), and RTK Query hooks (`useGetPackagesQuery`, `useBookPackageMutation`, `useCreatePackageMutation`).

---

## 2. Caching & State Update Strategy with RTK Query

To strictly satisfy the requirement: *"The UI must instantly reflect the updated `availableSlots` count after a successful booking without requiring a hard page refresh"*, we implemented a **Dual-Layer Cache Update Strategy** in [`packagesApi.ts`](file:///c:/Users/TPNL/Desktop/travel-client/lib/redux/services/packagesApi.ts):

### A. Instant Optimistic Updates (`onQueryStarted`)
When a user clicks **"Book Now"**, waiting for the network round-trip introduces latency. Using RTK Query's `onQueryStarted` lifecycle hook:
1. We immediately dispatch a draft mutation (`updateQueryData('getPackages', undefined, (draft) => ...)`).
2. The target package's `availableSlots` is decremented by 1 in the Redux store **in < 1ms**.
3. If the backend POST request fails (e.g. HTTP 400 No Slots Available or network error), `patchResult.undo()` automatically rolls back the cache state, and an error toast notification is displayed.

### B. Tag Invalidation for Server Synchronization (`invalidatesTags`)
1. The `getPackages` query provides tag definitions:
   ```ts
   providesTags: (result) =>
     result
       ? [...result.map(({ _id }) => ({ type: 'Packages' as const, id: _id })), { type: 'Packages', id: 'LIST' }]
       : [{ type: 'Packages', id: 'LIST' }]
   ```
2. The `bookPackage` mutation invalidates these tags upon server response:
   ```ts
   invalidatesTags: (result, error, id) => [
     { type: 'Packages', id },
     { type: 'Packages', id: 'LIST' },
   ]
   ```
This ensures that the UI updates **instantly** via optimistic draft updates while seamlessly re-synchronizing with MongoDB in the background.

---

## 3. Challenges & Resolution

### Bug Encountered: Next.js 16 Turbopack Font Resolution Error
During initial development with Next.js 16 (Turbopack), importing `Geist` from `next/font/google` caused a runtime build failure:
```
Build Error: Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

#### Root Cause Analysis:
Turbopack's internal Google Font loader attempted to fetch external web font assets via an internal module path `@vercel/turbopack-next/internal/font/google/font`, which failed in the local environment without direct Google Font CDN access.

#### Resolution:
Removed `next/font/google` dependencies from `app/layout.tsx` and replaced them with robust system font stacks in `app/globals.css`:
```css
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Consolas, monospace;
}
```
This eliminated external build dependencies, resolved the compilation failure, and improved page load performance.

### CORS & Base URL Configuration:
Because the Express backend runs on `http://localhost:3000/api` and Next.js dev server may run on `http://localhost:3000` or `http://localhost:3001`, `packagesApi.ts` reads `process.env.NEXT_PUBLIC_API_BASE_URL` with fallback to `http://localhost:3000/api`, ensuring seamless cross-origin requests.

---

## 4. Local Execution Instructions

### Prerequisites
- Node.js (v18+) or Bun (v1.0+)
- MongoDB instance running locally on `mongodb://127.0.0.1:27017/travel-db`

### Step 1: Start the Backend Service
1. Clone and enter your Express backend directory.
2. Ensure MongoDB is running (`mongod`).
3. Install dependencies and start the Express API:
   ```bash
   npm install
   PORT=3000 npm start
   ```
4. Verify backend endpoints:
   - `GET http://localhost:3000/api/packages`

### Step 2: Start the Next.js Frontend Client
1. In the `travel-client` directory, install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```
2. (Optional) Create a `.env.local` file if your backend runs on a different port:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```
3. Run the dev server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied by the API server).

### Step 3: Verify Functionality
1. View available packages listed on the page.
2. Click **"Book Now"** on a package card.
3. Observe that the `availableSlots` count decrements **instantly** without a hard page refresh.
4. When slots reach `0`, the button changes state to **"Fully Booked"** and is disabled.
