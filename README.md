# ATS Keyword Match Checker

Paste a job description and a resume, get an instant keyword-match score, and see
exactly which keywords are missing — all client-side, nothing is stored or sent anywhere.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS. No database, no backend,
no environment variables — which means zero-config deploys on Vercel's free Hobby plan.

## 1. Before you deploy — edit these two lines

Open `app/page.tsx` and change:

```ts
const AUTHOR_NAME = "Kaushik [Your Last Name]";
const AUTHOR_EMAIL = "your.email@example.com";
```

to your real, reachable name and email. They show up in the header/footer of the live page.

## 2. Run it locally (optional, to preview)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "ATS keyword match checker"
gh repo create ats-keyword-match-checker --public --source=. --remote=origin --push
```

(No `gh` CLI? Create an empty public repo on github.com first, then:)

```bash
git remote add origin https://github.com/<your-username>/ats-keyword-match-checker.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Vercel (free Hobby plan)

1. Go to vercel.com → sign in with GitHub (free, no card).
2. "Add New Project" → import the repo you just pushed.
3. Framework preset auto-detects as **Next.js** — leave all defaults as-is.
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in under a minute.

## 5. Submission checklist

- [ ] Live Vercel URL works and produces a real match score
- [ ] "Built for Digital Heroes" button (header + footer) links to https://digitalheroesco.com
- [ ] Your real name + email are visible on the page
- [ ] GitHub repo is public
- [ ] Added to your portfolio
- [ ] ₹0 spent anywhere
