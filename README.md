# Whereto 🗺️
> AI-powered date planning app for Toronto, Vancouver & Montreal

## Deploy Guide (GitHub → Vercel)

### Step 1 — Upload to GitHub
1. Go to [github.com](https://github.com) → sign up / log in
2. Click **"New repository"** → name it `whereto` → click **"Create repository"**
3. Upload all files: click **"uploading an existing file"** → drag the entire `whereto-deploy` folder contents

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → sign up with GitHub
2. Click **"Add New Project"** → import your `whereto` repo
3. Click **"Deploy"** (default settings are fine)

### Step 3 — Add API Keys (Environment Variables)
In Vercel dashboard → your project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | Your OpenAI secret key (`sk-proj-...`) |
| `GOOGLE_MAPS_CLIENT_KEY` | Your Google Maps **client-side** key |

Then go to **Deployments → Redeploy** to apply.

### Step 4 — Set Google Maps API key in the HTML
In `public/whereto-results.html`, find this line near the bottom:
```
const key = 'MAPS_CLIENT_KEY_PLACEHOLDER';
```
Replace `MAPS_CLIENT_KEY_PLACEHOLDER` with your actual Google Maps client key.

> ⚠️ The client key should have **HTTP referrer restrictions** set in Google Cloud Console
> to only allow requests from your Vercel domain (e.g. `whereto.vercel.app/*`)

---

## Project Structure
```
whereto-deploy/
├── api/
│   └── generate.js        ← Backend: calls OpenAI API (key stays secret)
├── public/
│   ├── index.html         ← Home page
│   ├── whereto-quiz.html
│   ├── whereto-quiz-location.html
│   ├── whereto-quiz-food.html
│   ├── whereto-quiz-afterdinner.html
│   ├── whereto-quiz-budget.html
│   └── whereto-results.html  ← Results with Google Maps + AI courses
├── vercel.json            ← Routing config
├── package.json
└── .gitignore
```
