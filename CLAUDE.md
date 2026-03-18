# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server (port 3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

No test framework is configured.

## Architecture

This is a **Next.js 16** contact/landing page for LIT School using the App Router, React 19, TypeScript, and Tailwind CSS 4.

### Routing

- `/` (`app/page.tsx`) — Main landing page with hero, contact form, FAQ, newsletter, and footer
- `/contact` (`app/contact/page.tsx`) — Redirects to `/`
- `/api/contact` (`app/api/contact/route.ts`) — POST endpoint for contact form submission

### Contact Form Flow

1. Client-side validation in `app/page.tsx` (name, email, phone, message length)
2. POST to `/api/contact` with form data
3. Server-side: input sanitization (HTML strip), validation, rate limiting (5 req/60s per IP), honeypot spam check
4. Data inserted into Supabase `leads` table via REST API (not the JS client)
5. Supabase client is initialized in `lib/supabase.ts` but the API route uses direct REST calls with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Leads Table Columns

`name`, `email`, `phone`, `dob`, `gender`, `location`, `enquiry_type`, `course_interest`, `message`, `sent_confirmation`

### Styling

- Dark theme (`#0a0a0a` background) with glassmorphism effects
- CSS custom properties defined in `app/globals.css` for colors, gradients, spacing, and transitions
- Two fonts: **Bricolage Grotesque** (headings, via Google Fonts) and **OpenSauceOne** (body, local files in `public/fonts/`)
- Responsive breakpoints: 1024px (tablet), 640px (mobile), 480px (small mobile)
- Scroll animations use Intersection Observer with CSS class toggling

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).
