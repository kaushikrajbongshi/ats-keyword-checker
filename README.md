# ATS Keyword Match Checker

A free tool that compares a resume against a job description and shows exactly which
keywords are missing — before an Applicant Tracking System (ATS) filters the resume out.

**Live demo:** [your-vercel-url-here.vercel.app](#)
**Built for:** [Digital Heroes](https://digitalheroesco.com) developer trial task

---

## Why I built this

Most job postings get scanned by ATS software for specific keywords before a human ever
reads them. While optimizing my own resume for ATS compatibility, I kept manually
cross-checking job descriptions against my resume line by line — so I built a tool that
does it in seconds instead.

## Features

- 📋 **Paste or upload** — drop in resume text directly, or upload a `.pdf`, `.docx`, or
  `.txt` file and it's parsed automatically
- 🎯 **Keyword extraction** — pulls relevant skill/role keywords from the job description
  using a curated dictionary of ~150 common technical and soft-skill terms, plus frequency
  analysis to catch domain-specific terms
- ✅ **Match scoring** — instant percentage score, with matched keywords highlighted and
  missing keywords flagged
- 🔒 **Private by design** — everything runs client-side in the browser; nothing is
  uploaded, stored, or sent to any server
- ⚡ **Zero backend** — fully static Next.js export, so it deploys free on Vercel with no
  database or environment variables

## How it works

1. The job description is normalized and scanned against a skill/keyword dictionary
   (e.g. `react`, `sql`, `agile`, `communication`)
2. Frequently repeated non-generic words not already in the dictionary are added as
   extra candidate keywords, to catch role-specific terms
3. Each keyword is checked against the resume text for a case-insensitive,
   word-boundary-aware match
4. The match percentage = matched keywords ÷ total keywords found in the job description

## Tech stack

| Layer       | Choice                                  |
|-------------|------------------------------------------|
| Framework   | Next.js 14 (App Router) + TypeScript    |
| Styling     | Tailwind CSS                            |
| File parsing| `pdfjs-dist` (PDF), `mammoth` (DOCX)     |
| Hosting     | Vercel (free Hobby plan)                |

No database, no API routes, no environment variables.

## Getting started

```bash
git clone https://github.com/kaushikrajbongshi/ats-keyword-match-checker.git
cd ats-keyword-match-checker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx       # root layout + metadata
  page.tsx         # main UI: inputs, file upload, results
  globals.css       # design tokens (graded-paper theme)
lib/
  matchKeywords.ts      # keyword extraction + scoring logic
  parseResumeFile.ts    # PDF / DOCX / TXT text extraction
```

## Deployment

1. Push this repo to GitHub (public)
2. Import it on [vercel.com](https://vercel.com) — Next.js is auto-detected, no config needed
3. Click **Deploy**

## Possible future improvements

- Basic stemming so "communication" also matches "communicator"
- Multi-language keyword support
- Exportable PDF report of the match results

## Author

**Kaushik Rajbongshi**
📧 kaushikraj0241@gmail.com

---

*Built as part of the [Digital Heroes](https://digitalheroesco.com) developer trial task.*
