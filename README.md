# Notice Board App

A full-stack Notice Board application built with Next.js (Pages Router), Prisma, and PostgreSQL. Supports full CRUD operations with server-side validation, Urgent-first ordering, responsive design, and optional image URLs.

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Database**: PostgreSQL (local) / Neon or Supabase (production)
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

## How to Run Locally

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running
- npm or yarn

### Setup Steps

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd notice-board-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/notice_board?schema=public"
```

> Replace `your_password` with your PostgreSQL password.

4. **Create the database**

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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notices` | List all notices (Urgent first) |
| POST | `/api/notices` | Create a new notice |
| GET | `/api/notices/[id]` | Get a single notice |
| PUT | `/api/notices/[id]` | Update a notice |
| DELETE | `/api/notices/[id]` | Delete a notice |

## Deployment

### Deploy to Vercel

1. Push the code to a public GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the `DATABASE_URL` environment variable in Vercel's dashboard
4. Deploy (Vercel will automatically run `prisma migrate` during build)

### Database for Production

Use a hosted PostgreSQL database:
- **Neon** (recommended, free tier) — https://neon.tech
- **Supabase** (free tier) — https://supabase.com

## One Thing I Would Improve

With more time, I would add file-based image upload using Cloudinary or AWS S3 instead of just accepting image URLs. This would provide a better user experience by allowing users to upload images directly from their device. Also, I would add pagination or infinite scrolling for when there are many notices, and implement search/filter functionality by category or date range.

## How AI Was Used

This project was built with the assistance of AI (Claude by Anthropic) in the following ways:

1. **Architecture planning**: AI helped design the project structure, database schema, and API route design.
2. **Code generation**: AI generated the initial boilerplate for components, API routes, and pages.
3. **Debugging**: AI assisted in troubleshooting build errors, database connection issues, and TypeScript type errors.
4. **Code review**: AI reviewed the generated code for security issues and best practices.
5. **Documentation**: AI helped write this README file.

All AI-generated code was reviewed and tested by a human developer before deployment.