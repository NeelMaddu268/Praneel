# 🏁 Forza Code Vault

**▶️ Play it: https://neelmaddu268.github.io/Praneel/**

An interactive, high-octane quiz game built with **Next.js (App Router)**, **Tailwind CSS v4**, and **Lucide React**. Answer 5 questions to progressively decrypt a 25-character Forza Horizon game code — one segment per correct answer.

## How It Works

- The code `?????-?????-?????-?????-?????` starts fully locked.
- Each correct answer decrypts one 5-character segment with a neon reveal animation.
- Questions cover F1 trivia, visual car identification, UGA trivia, NBA Finals history, and one final… *high-stakes* question. 😉
- Wrong answers trigger a red shake — unlimited retries (well, almost — see the final question's warning).
- Q1–Q4 include a **"Need a hint?"** button.
- Victory screen shows the full code with a **Copy to Clipboard** button.

## ⚙️ Configuration (do this before sharing!)

All game content lives in [`lib/quiz-config.ts`](lib/quiz-config.ts):

1. **`CAR_IMAGE_URL`** — replace the placeholder with your Imgur/Discord image link (the zoomed-in car detail for Question 2). Until it's set, Q2 shows a styled "photo slot" panel. If you also use the standalone build, set the matching `CAR_IMAGE_URL` near the top of the `<script>` in [`standalone/forza-code-vault.html`](standalone/forza-code-vault.html).
2. **`CAR_ACCEPTED_ANSWERS`** — update the accepted answers to match the car in *your* image. Matching is forgiving: capitalization, punctuation, and spacing are ignored.
3. **`CAR_HINT`** — the hint shown for Question 2.
4. **`CODE_SEGMENTS`** — the prize code, split into five 5-character segments.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Single-file build

[`standalone/forza-code-vault.html`](standalone/forza-code-vault.html) is the whole game in one 93 KB HTML file — fonts inlined as data URIs, no build step, no network requests. Open it directly in a browser, email it, or drop it on any static host. It's a hand-maintained mirror of the Next.js app, so if you change a question in `lib/quiz-config.ts`, mirror it in the `QUESTIONS` array inside that file.

## Deploying

**Vercel (recommended):** go to [vercel.com/new](https://vercel.com/new), import this repository, and click **Deploy**. Vercel auto-detects Next.js; no configuration needed.

**GitHub Pages — live, and already automatic.** Pages is enabled with Source set to *GitHub Actions*, so every push to `main` rebuilds and redeploys via [the workflow](.github/workflows/deploy-pages.yml). Nothing to run by hand.

The workflow sets `GITHUB_PAGES=true`, which flips [`next.config.ts`](next.config.ts) into static-export mode with the right `basePath` for the `/Praneel/` project path. Vercel deploys are unaffected by that flag.

**Vercel CLI:** `vercel --prod --yes` works from any machine with network access to `api.vercel.com`.

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) — carbon-fiber dark theme with neon accents
- [Lucide React](https://lucide.dev/) — icons
