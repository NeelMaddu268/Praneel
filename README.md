# 🏁 Forza Code Vault

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

1. **`CAR_IMAGE_URL`** — replace the placeholder with your Imgur/Discord image link (the zoomed-in car detail for Question 2). Until it's set, Q2 shows an "Image feed offline" panel.
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

## Deploying to Vercel

**Option A — Dashboard (fastest):** go to [vercel.com/new](https://vercel.com/new), import this GitHub repository, and click **Deploy**. Vercel auto-detects Next.js; no configuration needed.

**Option B — CLI:**

```bash
npm i -g vercel
vercel --prod --yes
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) — carbon-fiber dark theme with neon accents
- [Lucide React](https://lucide.dev/) — icons
