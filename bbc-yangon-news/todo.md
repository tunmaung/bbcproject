# BBC Yangon News — Project TODO

## Phase 1: Database Schema & Migrations
- [x] Define articles table in `drizzle/schema.ts` with all required columns
- [x] Generate migration SQL with `pnpm drizzle-kit generate`
- [x] Apply migration via `webdev_execute_sql`
- [x] Create seed data script with 10 sample Yangon-focused articles

## Phase 2: Backend API (tRPC Procedures)
- [x] Implement public procedures: `articles.list`, `articles.featured`, `articles.breaking`, `articles.getById`
- [x] Implement protected procedures: `admin.articles.create`, `admin.articles.update`, `admin.articles.delete`, `admin.articles.list`, `admin.stats`
- [x] Add image upload route (`POST /api/upload`) for Manus S3 storage
- [x] Add database helpers in `server/db.ts`
- [x] Write vitest tests for all procedures

## Phase 3: Frontend Pages & Components
- [x] Create `GeolocationGate` context provider for mandatory permission gate
- [x] Create `Masthead` component (BBC red top bar with navigation)
- [x] Create `BreakingStrip` component (red ticker)
- [x] Create `HeroSection` component (featured article)
- [x] Create `CategoryGrid` component (grouped article cards)
- [x] Create `HomePage` page with all above components
- [x] Create `ArticlePage` detail view at `/article/:id`
- [x] Create `CategoryPage` listing at `/category/:slug`
- [x] Update `App.tsx` with all routes

## Phase 4: Admin Dashboard
- [x] Create `AdminDashboard` page with sidebar layout
- [x] Create `ArticleForm` component (create/edit with validation)
- [x] Create `ArticleTable` component (management list with Edit/Delete)
- [x] Create `AdminStats` component (total count + per-category stats)
- [x] Implement delete confirmation dialog
- [x] Add file upload handler with size validation (5 MB limit)
- [x] Wire all mutations to tRPC procedures

## Phase 5: Styling & Theme
- [x] Define BBC color palette in `client/src/index.css` (red #BB1919, white, charcoal, gray)
- [x] Add Google Fonts (BBC Reith Sans or Noto Sans fallback) to `client/index.html`
- [x] Create responsive grid layout (desktop, tablet, mobile)
- [x] Style geolocation overlay (full-viewport, centered card, required message)
- [x] Style masthead, navigation, breaking strip, hero, cards
- [x] Ensure WCAG AA contrast and visible focus states

## Phase 6: Geolocation Gate Implementation
- [x] Implement browser Geolocation API flow in `GeolocationGate` context
- [x] Store permission state in localStorage
- [x] Render full-screen overlay on denial with exact required message
- [x] Implement Retry button to re-prompt
- [x] Add browser settings guidance for permanently denied permissions
- [x] Ensure overlay is keyboard-accessible with `aria-live`

## Phase 7: Deployment Files
- [x] Create `Dockerfile` for production Node.js deployment
- [x] Create `docker-compose.yml` for local MySQL development
- [x] Create `DEPLOYMENT.md` with Render and Railway step-by-step guides
- [x] Document environment variables and setup instructions

## Phase 8: Testing & Validation
- [x] Test geolocation flow (allow, deny, retry)
- [x] Test article CRUD operations
- [x] Test public article list and filtering
- [x] Test admin authentication (Manus OAuth)
- [x] Test image upload to Manus S3
- [x] Test responsive layout (375px, 768px, 1280px)
- [x] Test keyboard navigation and accessibility
- [x] Verify all console errors are resolved

## Phase 9: Final Checkpoint & Delivery
- [x] Run `pnpm test` to verify all tests pass
- [x] Take screenshots of key pages (homepage, admin, detail)
- [x] Create final checkpoint
- [x] Publish to Manus WebDev
- [x] Deliver live URL and deployment guide to user
