# STROKE & SOUL — Premium Handcrafted Sketch Studio & Admin CMS

A complete, production-grade sketch artist commission website and administrative management portal. Built with an editorial luxury aesthetic (#F7F3EB Warm Ivory, #292722 Charcoal, #A58A61 Antique Gold) featuring Playfair Display and Inter typography.

---

## 🎨 System Highlights

1. **Exactly Two Public-Facing Pages**:
   - `/`: **Home / Artist Portfolio** (Announcement Bar, Navigation, Editorial Hero, About the Artist, 6 Commission Services, Featured Artwork Gallery with Lightbox & Before/After comparisons, 4-Step Process, Customer Reviews with demo indicators, Pricing & Size Guide, FAQs Accordion, Final CTA, and Luxury Studio Footer).
   - `/order`: **Order & Custom Sketch Enquiry** (Full Name, Contact, Sketch Type, Scale, Subjects Stepper, Orientation, Paper Type, Framing, Reference Photo Upload with previews/delete, Custom instructions, Preferred delivery date, Wax-sealed gift packaging, Live dynamic price estimator tied to database pricing rules, and Unique Reference Number generation).

2. **Secure Admin Management Portal** (`/admin/login` & `/admin/dashboard`):
   - **Zero Public Registration**: Strictly restricted to authorized administrators.
   - **Security**: Password hashing with bcrypt, JSON Web Tokens in secure httpOnly cookies, rate limiting, and input sanitization.
   - **Dashboard**: Key metric counters, 6-month monthly enquiry volume trend chart, commission pipeline distribution, recent enquiries, latest artwork showcase.
   - **Enquiry & Order Management**: Search by reference number/patron name, status filtering, date range, high-res reference photo inspector with direct download, milestone status updates with mandatory audit reason, quoted price editor, completion date picker, internal notes thread, and a **chronological activity history timeline**.
   - **Full Website CMS**: Live editor for website name, typography logo, favicon, top announcement bar (text, bg color, text color, visibility), hero title, description, buttons, image, artist biography, philosophy, years experience, section ordering & visibility switches.
   - **Artwork Gallery Management**: Upload new pencil artworks, edit descriptions, assign categories, tag mediums, link optional before/after client photographs, mark featured works, reorder, or delete.
   - **Commission Services Management**: Configure 6+ portrait services, starting prices, size availability, and delivery estimates.
   - **Pricing Rules Engine**: Base prices per paper scale (A5 to A2), extra subject fees, framing add-ons, and gift packaging fees.
   - **Reviews & FAQs Management**: Full CRUD for testimonials and accordion questions.
   - **Central Media Library**: Upload, preview, copy URLs, and manage assets.

---

## 🏛️ Color System & Design Language

- **Primary Background**: `#F7F3EB` (Warm Ivory)
- **Secondary Background**: `#EDE5D9` (Soft Beige)
- **Primary Text**: `#292722` (Charcoal)
- **Secondary Text**: `#777166` (Muted Taupe)
- **Accent Highlight**: `#A58A61` (Antique Gold)
- **Accent Hover**: `#8C734F` (Deep Antique Gold)
- **Borders**: `#DED6CA` (Warm Grey)
- **Cards**: `#FFFDFA` (Off White)
- **Dark Sections**: `#292722` (Charcoal Studio Dark)
- **Headings Font**: Playfair Display (Serif)
- **Body Font**: Inter (Sans-Serif)
- **Accent Font**: Cormorant Garamond (Serif)

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express, Multer (secure multi-file uploads), bcryptjs, jsonwebtoken, cookie-parser.
- **Database & ORM**: Prisma ORM with SQLite for zero-friction out-of-the-box local persistence (compatible with PostgreSQL in production).
- **Tooling**: Vite for optimized frontend bundling, tsx for TypeScript runtime execution.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer; tested on Node.js v24.15)
- npm or pnpm

### 2. Environment Configuration
The project includes a pre-configured `.env` file (copied from `.env.example`):

```bash
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="stroke_and_soul_super_secret_jwt_key_2026_sketch_studio"
JWT_EXPIRES_IN="7d"
ADMIN_INITIAL_EMAIL="admin@strokeandsoul.art"
ADMIN_INITIAL_PASSWORD="AdminArtStudio2026!"
ADMIN_INITIAL_NAME="Alex Morgan"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=15
```

### 3. Database Initialization & Seeding
Generate the Prisma client, push the schema to SQLite, and seed initial demonstration content:

```bash
# Generate Prisma Client
npm run prisma:generate

# Push database schema (creates dev.db SQLite database)
npm run prisma:push

# Seed database with default admin, 6 services, 8 realistic artworks, 4 reviews, 8 FAQs, and pricing
npm run prisma:seed
```

### 4. Running in Production
Build the optimized React frontend and start the integrated full-stack server:

```bash
# Build the client bundle to /dist
npm run build

# Start the fullstack production server (serves API + Frontend on port 5000)
npm run serve
```
Open **`http://localhost:5000`** in your browser.

### 5. Running in Development (Concurrent Server + Vite HMR)
```bash
npm run dev
```
- Client with Hot Module Replacement: `http://localhost:5173`
- Backend API Server: `http://localhost:5000`

---

## 🔐 Administrative Access

Navigate to **`/admin/login`** (or click "Studio Portal" in the website footer):

- **Default Admin Email**: `admin@strokeandsoul.art`
- **Default Password**: `AdminArtStudio2026!`
- **Role**: Administrator

*(Note: Admin passwords can be updated directly from `/admin/dashboard` under the "Studio Settings" tab).*

---

## 🗄️ Database Entities & Architecture

1. **AdminUser**: Administrative authentication and credential storage.
2. **WebsiteSetting**: Global branding, studio contacts, social media, SEO tags, announcement bar styling, and section configuration.
3. **PageSection**: Controls visibility and ordering of public homepage sections.
4. **Service**: Master commission services (Single, Couple, Family, Pet, Custom, Gift).
5. **ServicePricing**: Paper dimensions, base pricing, extra subject charges, framing fees, and turnaround time.
6. **GalleryCategory**: Categorization for artwork studies.
7. **GalleryImage**: Artworks with image URLs, before/after reference images, medium tags, and featured status.
8. **Testimonial**: Customer feedback with star ratings (1-5), dates, and demo markers.
9. **Faq**: Interactive questions and answers.
10. **Enquiry**: Commission requests submitted by visitors with auto-generated reference numbers (`SNS-2026-XXXXX`), status milestones, and pricing calculations.
11. **EnquiryAttachment**: Stored uploaded reference photographs.
12. **EnquiryNote**: Internal timestamped studio notes.
13. **EnquiryStatusHistory**: Full audit trail of status milestones.
14. **MediaLibrary**: Central image and asset repository.

### Switching to PostgreSQL (Production Setup)
To switch from SQLite to PostgreSQL (e.g. Supabase, AWS RDS, Neon, or Railway):
1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sketch_studio?schema=public"
   ```
3. Run `npx prisma db push` and `npx tsx server/src/seed.ts`.

---

## 🧪 Functional Verification Checklist

Run the automated end-to-end verification suite:
```bash
npx tsx server/src/test-e2e.ts
```

All 27 automated tests verify:
- [x] Database connection and admin user authentication
- [x] Password hashing and token generation
- [x] Website settings and page section configurations
- [x] Active commission services (6 services)
- [x] Pricing rules calculation engine
- [x] Artwork gallery and category links
- [x] Demonstration reviews and FAQ registrations
- [x] Customer enquiry creation with reference photograph attachment
- [x] Reference number format generation (`SNS-2026-XXXXX`)
- [x] Status transition audit logging in chronological timeline
- [x] Internal studio notes thread persistence
