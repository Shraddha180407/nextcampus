# NextCampus — College Discovery & Admission Intelligence Platform

NextCampus is a production-grade web application built to help prospective students explore colleges, compare institutes side-by-side, and calculate admission probabilities based on historical closing cutoff intelligence.

Built for the **AI Software Engineer Internship Demo Task** (Track A: College Discovery Platform).

---

## 🌟 Key Features

### 1. College Listing & Advanced Multi-Dimensional Filtering
- **Debounced Search** (300ms) across college names, short codes, cities, and states.
- **6 Filtering Dimensions**:
  - **Discipline / Stream**: Multi-select (Engineering, Medical, Management, Law, Science, Design, Pharmacy)
  - **State / Location**: Multi-select across Indian states
  - **Accepted Entrance Exams**: Multi-select (JEE Main, JEE Advanced, NEET, CAT, BITSAT, CLAT, VITEEE, GATE)
  - **Student Rating**: Single-select (3.5+, 4.0+, 4.5+ Stars)
  - **Annual Tuition Fees**: Interactive range slider (₹50K to ₹15L+)
  - **Institute Type**: Government, Private, Deemed, Central
- **URL-Synchronized State**: All filters, search keywords, sorting, and pagination are synchronized with browser URL parameters for shareable, bookmarkable links.
- **Sort Options**: Highest Rated, NIRF Ranking (Top First), Alphabetical (A-Z).

### 2. College Detail Page
- **Server-Side Rendered (SSR)** for SEO and metadata generation.
- **Tabbed Architecture**:
  - **Overview**: Institutional background, accreditation (NAAC/NIRF), established year, campus size, and student-faculty ratio.
  - **Courses & Fees**: Complete degree table with level (UG/PG), duration, annual tuition fee, full course fee, and eligibility requirements.
  - **Placements**: Year-by-year placement history (2022–2024) highlighting highest package, average CTC, median CTC, placement rate %, and top recruiting companies.
  - **Reviews**: Categorized star ratings (Infrastructure, Faculty, Placement, Hostels), authentic pros/cons, and an interactive **Review Submission Modal** that recalculates college aggregate ratings atomically in database transactions.

### 3. Side-by-Side College Comparison Tool
- **Limited to 2–3 Colleges**: Optimized specifically for readability on both desktop and mobile screens.
- **Persistent Comparison Tray**: Sticky bottom tray on all pages allowing users to queue colleges on-the-fly and jump to comparison.
- **Color-Coded Comparison Matrix**:
  - Highlights the **Most Affordable** annual tuition fee in green.
  - Highlights the **Highest Average CTC** and **Highest Domestic Package** in green.
  - Compares NIRF ranking, NAAC grades, accepted exams, streams, and reviews.
- **Add/Remove Modals**: Search and add additional colleges directly within the matrix.

### 4. Rank & Admission Predictor Tool
- **Supported Exams**: JEE Main, JEE Advanced, NEET UG, CAT, BITSAT, CLAT, VITEEE.
- **Inputs**: Test Score / All India Rank / Percentile, Reservation Category (General, OBC, SC, ST, EWS), and Gender Pool.
- **3-Tier Match Probability Algorithm**:
  - 🟢 **Strong Match**: Rank is comfortably within historical round 1 closing cutoff (>= 15% safety margin).
  - 🟡 **Possible Match**: Rank is within 15% boundary of historical cutoffs.
  - 🔴 **Reach / Target**: Rank is above typical cutoffs; potential opportunity during special/spot rounds.
- **Prominent Disclaimer**: Transparent labeling stating that results are historical estimations and not guaranteed admission.

---

## 🛠️ Tech Stack & Architecture Decisions

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server Components for fast initial loads, API Route Handlers for backend endpoints. |
| **Language** | TypeScript | Strict type safety across ORM models, API contracts, and UI components. |
| **Styling** | TailwindCSS + Lucide Icons | Responsive design system, clean color palette, accessible components. |
| **Database & ORM** | Prisma ORM + PostgreSQL (Neon) | Type-safe schema migrations, relational modeling, native JSON column support for recruiters. |
| **Data Fetching** | SWR | Client-side caching, optimistic UI updates, and seamless pagination. |
| **Validation** | Zod | Defensive input validation on all query parameters and mutation request bodies. |

---

## 📐 Database Schema & Relational Modeling

The database separates entities into clean, normalized relational tables:

```
┌───────────────┐       1:N       ┌──────────────┐
│    College    ├────────────────►│    Course    │
└───────┬───────┘                 └──────┬───────┘
        │ 1:N                            │
        ├────────────────► Placement     │ 1:N
        │                                │
        ├────────────────► Review        │
        │                                │
        ├────────────────► CollegeStream │
        │                                │
        ├────────────────► CollegeExam   │
        │                                │
        └────────────────► CollegeCutoff ◄
```

- **`College`**: Master institutional metadata (NIRF rank, NAAC, location, ratings).
- **`Course`**: Program name, level (UG/PG), duration, annual & total tuition fees.
- **`Placement`**: Annual placement records with `topRecruiters` stored as native PostgreSQL `Json`.
- **`Review`**: Individual student review with sub-category ratings, text, pros, cons, and timestamps.
- **`CollegeCutoff`**: Exam-wise, category-wise opening and closing ranks for the admission predictor.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (or Node 20+)
- PostgreSQL database (or free [Neon](https://neon.tech) serverless database)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd nextcampus

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` (or `.env`) file in the root directory:
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DBNAME]?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to your database
npx prisma db push

# Seed the database with 8 representative colleges across all domains
npx tsx prisma/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

A dedicated test suite (`tests/api.test.ts`) verifies all 16 core test cases:

```bash
# Run tests against the development server
npx tsx tests/api.test.ts
```

### Test Coverage:
1. `GET /api/colleges` — 200 OK, pagination, and response array.
2. Search query filter (`?q=IIT`) — full-text match across names and short codes.
3. Discipline + Rating filter (`?stream=MEDICAL&minRating=4.0`).
4. Fee range slider filter (`?minFee=0&maxFee=250000`).
5. Combined AND filters (`?exam=NEET&state=Delhi`).
6. Boundary validation error (`?minRating=6` -> 400 Bad Request).
7. Invalid pagination (`?page=0` -> 400 Bad Request).
8. Nonexistent college detail (`/api/colleges/invalid-slug` -> 404 Not Found).
9. Compare 2 colleges (`?ids=iit-delhi,iit-bombay` -> 200 OK).
10. Compare 1 college (`?ids=iit-delhi` -> 400 Bad Request, requires >= 2).
11. Compare 4 colleges (`?ids=a,b,c,d` -> 400 Bad Request, max 3 limit).
12. Predictor algorithm (`POST /api/predictor` -> Strong Match / Possible / Reach tiers).
13. Predictor missing inputs (`POST /api/predictor` without rank -> 400 Bad Request).
14. Review submission validation (name too short, rating > 5 -> 400 Bad Request).

---

## ⚖️ Engineering Trade-Offs & Decisions

1. **Compare Limited to 3 Colleges**: Rather than supporting arbitrary numbers of colleges, capping at 3 ensures that tables remain legible, scannable, and non-cluttered on mobile screens.
2. **Predictor Labeling**: Labeled output as **Strong Match / Possible / Reach** rather than "Guaranteed Safe", demonstrating honesty regarding real-world cutoff fluctuations.
3. **Phased Seed Data Strategy**: Seeded 8 deep, representative colleges spanning Engineering (IIT, NIT, BITS, VIT), Medical (AIIMS), Management (IIM), and Law (NLU) with complete course, placement, and cutoff relations to test every code path thoroughly.
4. **Prisma Json Column for Top Recruiters**: Used native PostgreSQL `Json` instead of comma-separated string blobs or an overly complex standalone table, optimizing query simplicity and type safety.

---

## 📄 License & Disclaimer

*Demo Dataset Notice: Admission cutoff values, placement packages, and institutional statistics are simulated for demonstration purposes and do not represent official institutional guarantees.*
