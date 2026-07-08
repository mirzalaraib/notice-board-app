# Notice Board App

A full-stack Notice Board application built with Next.js (Pages Router), Prisma, and PostgreSQL. Supports full CRUD operations with server-side validation, Urgent-first ordering, responsive design, and optional image URLs.

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Database**: PostgreSQL (local) → Neon Cloud (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (Hobby tier)

## Features

- ✅ **Create** notices with title, body, category, priority, publish date, and optional image URL
- ✅ **Read** notices displayed as responsive cards (1 col mobile → 2 col tablet → 3 col desktop)
- ✅ **Update** notices using the same form pre-filled with existing data
- ✅ **Delete** notices with confirmation dialog
- ✅ **Urgent-first ordering** — done in database query via Prisma `orderBy`
- ✅ **Urgent badge** — visible red "Urgent" badge on Urgent notices
- ✅ **Server-side validation** — required fields, valid date, category/priority enum checks
- ✅ **Responsive design** — works on phone and desktop
- ✅ **Image support** — optional image URL for notices

## Local Setup & Testing (PostgreSQL)

The application was first developed and tested locally using PostgreSQL.

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running locally
- npm or yarn

### Local Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/mirzalaraib/notice-board-app.git
cd notice-board-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up local environment variables**

Create a `.env` file in the root directory:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/notice_board?schema=public"
```

> Replace `your_password` with your PostgreSQL password.

4. **Create the local database**

```bash
psql -U postgres -c "CREATE DATABASE notice_board;"
```

5. **Run Prisma migrations**

```bash
npx prisma migrate dev --name init
```

6. **Start the development server**

```bash
npm run dev
```

7. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000)

### What Was Tested Locally

| Feature | Test Performed | Result |
|---------|---------------|--------|
| Create Notice | POST request via form and Postman | ✅ 201 Created |
| Read Notices | List page loads with all notices | ✅ 200 OK |
| Read Single Notice | GET by ID | ✅ 200 OK |
| Update Notice | Edit form pre-filled, PUT request | ✅ 200 OK |
| Delete Notice | Confirmation dialog, DELETE request | ✅ 200 OK |
| Server Validation | Empty title/body, invalid date | ✅ 400 Bad Request |
| Wrong HTTP Method | PATCH on GET-only route | ✅ 405 Method Not Allowed |
| 404 Handling | Non-existent notice ID | ✅ 404 Not Found |
| Urgent Ordering | Urgent notices above Normal ones | ✅ Correct order |
| Responsive Design | Mobile, Tablet, Desktop viewports | ✅ Grid adapts 1→2→3 cols |
| Data Persistence | Refresh page, restart server | ✅ Data preserved |

## Cloud Migration (Neon)

After local testing, the database was migrated to **Neon** (cloud PostgreSQL) for production deployment.

### Why Neon?

The assignment PDF recommends:
- **Neon** (recommended) — PostgreSQL, 500MB free tier, no credit card required
- **Supabase** — PostgreSQL, 500MB free tier
- **TiDB Cloud** — MySQL-compatible, 5GB free tier

Neon was chosen because:
- ✅ PostgreSQL compatible (same as local setup)
- ✅ Free tier with 500MB storage
- ✅ No credit card required
- ✅ Easy connection with Prisma
- ✅ Serverless — scales to zero when not in use

### Migration Steps

1. **Create a Neon account**

   - Go to [https://neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project named `notice-board-db`

2. **Get the connection string**

   - In Neon Console → Project Dashboard → Click "Connect"
   - Select **"Prisma"** from the dropdown
   - Copy the connection string (it will look like):
   ```
   postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

3. **Update `.env` file**

   ```env
   # Local PostgreSQL (for local development)
   # DATABASE_URL="postgresql://postgres:your_password@localhost:5432/notice_board?schema=public"

   # Neon Cloud PostgreSQL (for both local development and production)
   DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Run Prisma migration on Neon**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Verify in Neon Dashboard**

   - Go to Neon Console → Tables tab
   - The `Notice` table should be visible with all the columns
   - Data created through the app appears in real-time

### Switching Between Local and Cloud

Comment/uncomment the relevant line in `.env`:

```env
# For local development
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/notice_board?schema=public"

# For cloud/production testing
# DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

> ⚠️ The `.env` file is in `.gitignore` and will NOT be pushed to GitHub for security reasons.

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|-------------|
| GET | `/api/notices` | List all notices (Urgent first) | 200 |
| POST | `/api/notices` | Create a new notice | 201, 400 |
| GET | `/api/notices/[id]` | Get a single notice | 200, 404 |
| PUT | `/api/notices/[id]` | Update a notice | 200, 400, 404 |
| DELETE | `/api/notices/[id]` | Delete a notice | 200, 404 |

## Deployment

### Deploy to Vercel

1. Push the code to a public GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. In Vercel dashboard → Project Settings → Environment Variables:
   - Add `DATABASE_URL` = `postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require`
4. Deploy — Vercel will automatically build and run the migration

After deployment, the app is publicly accessible at: **https://notice-board-app-five.vercel.app**

### Database for Production

- **Neon** (used in this project) — https://neon.tech
- **Supabase** (alternative) — https://supabase.com

## One Thing I Would Improve

With more time, I would add file-based image upload using Cloudinary or AWS S3 instead of just accepting image URLs. This would provide a better user experience by allowing users to upload images directly from their device. Also, I would add pagination or infinite scrolling for when there are many notices, and implement search/filter functionality by category or date range.

## How AI Was Used

This project was built with the assistance of AI (Claude by Anthropic) in the following ways:

1. **Architecture planning**: AI helped design the project structure, database schema, and API route design.
2. **Code generation**: AI generated the initial boilerplate for components, API routes, and pages.
3. **Debugging**: AI assisted in troubleshooting build errors, database connection issues, and TypeScript type errors.
4. **Code review**: AI reviewed the generated code for security issues and best practices.
5. **Documentation**: AI helped write this README file and test plans.

All AI-generated code was reviewed and tested by a human developer before deployment.