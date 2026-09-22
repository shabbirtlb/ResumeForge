# ResumeForge

A resume and portfolio builder that turns structured form input into a polished, downloadable resume (PDF) and a matching personal portfolio site (HTML) — with per-section customization for fonts, colors, spacing, and layout.

Built during the **Bolt Hackathon**.

## Features

- **Guided form flow** — enter personal info, experience, education, projects, and skills through dedicated forms
- **Section reordering** — control the order sections appear in on the resume vs. the portfolio independently
- **Live preview** — see the resume update in real time as you edit
- **Full customization** — fonts, colors, spacing, borders, and layout are configurable per section
- **PDF export** — generates a pixel-accurate PDF from the live preview (via `jsPDF` + `html2canvas`)
- **Portfolio export** — generates a standalone, styled portfolio HTML page from the same data
- **Save & manage multiple resumes** — dashboard to create, edit, duplicate, search, and delete saved resumes
- **Auth & cloud storage** — resumes are saved per-user via Supabase, so they persist across sessions/devices

## Tech stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Postgres + Auth), with SQL migrations included
- **PDF/HTML generation:** `jsPDF`, `html2canvas` (client-side, no server rendering needed)
- **Icons:** lucide-react

## Data model

Supabase tables (see `supabase/migrations/`):

- `profiles` — user profile info, linked to `auth.users`
- `resumes` — stores each saved resume as JSONB (`data` column), with RLS policies so users can only access their own resumes

## Project structure

```
src/
  App.tsx                       # Multi-step form flow & state
  components/
    auth/                         # Login/register forms
    dashboard/Dashboard.tsx         # Saved resumes list, search/filter, PDF/portfolio export
    forms/                           # PersonalInfo, Experience, Education, Projects, Skills forms
    SectionOrderForm.tsx               # Drag/reorder sections
    CustomizationForm.tsx               # Font/color/layout controls
    PreviewSection.tsx                   # Live resume preview
  contexts/AuthContext.tsx               # Supabase auth context
  hooks/
    useLocalStorage.ts                     # Draft persistence while editing
    useResumeStorage.ts                      # Supabase CRUD for saved resumes
  utils/
    pdfGenerator.ts                            # Preview -> PDF export
    portfolioGenerator.ts                        # Data -> standalone portfolio HTML
  lib/supabase.ts                                # Supabase client init
supabase/migrations/                               # SQL schema (profiles, resumes, RLS policies)
```

## Setup

```bash
npm install
```

Create a `.env` file with your Supabase project credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the migrations in `supabase/migrations/` against your Supabase project (via the Supabase SQL editor or CLI), then:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Status

Hackathon build with a real backend (Supabase auth + RLS-secured storage) rather than a static demo — functional end-to-end, but not yet hardened for production traffic (e.g. no rate limiting on exports).
