# Future Planet

Private sales intelligence platform for the Future Planet team. Built on Next.js, deployed to Vercel, gated by Clerk so only invited teammates can sign in.

This README covers **step 1**: getting the foundation live at `futureplanet.vercel.app` with auth working. Steps 2–5 (porting the actual artifacts, saving outputs, history, team library) come after.

---

## What you have right now

A working Next.js scaffold with:

- **Clerk authentication** wrapping every page except `/sign-in`. Unauthenticated visitors are bounced to the login page automatically.
- **A landing dashboard** at `/dashboard` showing placeholder tiles for each of the five artifacts. The actual artifact pages get wired up in step 2.
- **Tailwind CSS** for styling.
- **TypeScript** throughout.

The five source-reference `.docx` files you uploaded are sitting in `_source-references/` — they're git-ignored, so they stay local and don't get deployed.

---

## One-time setup (do these in order)

You'll need three free accounts: **GitHub**, **Vercel**, and **Clerk**. Budget 20–30 minutes the first time.

### 1. Install Node.js (if you don't have it)

Download the **LTS** version from <https://nodejs.org>. After installing, open a terminal and confirm:

```bash
node --version   # should print v20.x or v22.x
npm --version
```

### 2. Install dependencies

In a terminal, from this folder:

```bash
npm install
```

This pulls down Next.js, Clerk, React, Tailwind, and TypeScript. Takes about a minute.

### 3. Create a Clerk account and app

1. Go to <https://dashboard.clerk.com> and sign up (free).
2. Click **Create application**. Name it `Future Planet`.
3. Under **Sign-in options**, turn ON **Email** and turn OFF everything else (Google, GitHub, etc.). We want email-only.
4. Under **Email**, choose **Email verification code** or **Email magic link** — either works. Magic link is the least friction for your team.
5. Click **Create application**.

You'll land on the API keys page. Copy the two values:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
- `CLERK_SECRET_KEY` (starts with `sk_test_...`)

### 4. Lock Clerk down to invite-only

This is the step that makes it private to your team.

In the Clerk dashboard, open **User & Authentication → Restrictions**:

- Set **Sign-up mode** to **Restricted**.
- Under **Allowlist**, add the email address of every teammate who should have access. They can sign in only after you add them here.

(You can also bulk-import emails or add them later as you onboard people.)

### 5. Add your keys locally

Copy `.env.local.example` to a new file called `.env.local`:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your two Clerk keys in. Save the file.

### 6. Run it locally to confirm it works

```bash
npm run dev
```

Open <http://localhost:3000>. You should be bounced to a Clerk sign-in page. Sign in with the same email you added to the allowlist — Clerk emails you a code or magic link. After signing in, you should see the dashboard with the five artifact placeholders.

If that works, you're ready to deploy.

### 7. Push to GitHub

If you don't have a GitHub account, create one at <https://github.com>. Then:

```bash
git init
git add .
git commit -m "Initial scaffold"
```

In GitHub, click **New repository**, name it `future-planet`, make it **Private**, and don't initialize with a README. After creation, GitHub shows you a `git remote add origin ...` command — copy and run those commands from the terminal.

### 8. Deploy to Vercel

1. Go to <https://vercel.com> and sign up using your GitHub account (this auto-links them).
2. Click **Add New → Project** and pick the `future-planet` repo.
3. **Important:** before clicking Deploy, expand the **Environment Variables** section and add the same two Clerk keys you put in `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Click **Deploy**. First build takes 1–2 minutes.

When the build succeeds, you'll get a URL like `future-planet-xxx.vercel.app`. To change it to `futureplanet.vercel.app`:

1. In the Vercel project, go to **Settings → Domains**.
2. Add `futureplanet.vercel.app`. If it's available, Vercel assigns it instantly.

### 9. Add the production domain to Clerk

Back in the Clerk dashboard, go to **Domains** (or **Paths**). Add `futureplanet.vercel.app` as an allowed origin. Without this, sign-in won't work on the deployed site.

You're live. Visit <https://futureplanet.vercel.app>, sign in with an allowlisted email, and you should see the dashboard.

---

## Local development going forward

```bash
npm run dev     # start the dev server at localhost:3000
npm run build   # production build (Vercel runs this on every push)
npm run start   # run the production build locally
```

Every push to the `main` branch on GitHub auto-deploys to Vercel. Pushes to other branches get preview URLs.

---

## What's next

Step 2 is porting the first artifact (recommended: **Sector Intelligence Workflow** since it's the smallest) end-to-end:

- Embed the HTML at `/dashboard/sector-intelligence`.
- Add a "Save output" button that writes to Supabase.
- Show the saved output back to the user.

Once the first one works, the other four follow the same template.

---

## Project layout

```
app/
  layout.tsx                       # Root layout, wraps everything in ClerkProvider
  page.tsx                         # / — redirects to /dashboard
  globals.css                      # Tailwind base styles
  sign-in/[[...sign-in]]/page.tsx  # Clerk-hosted sign-in UI
  dashboard/
    layout.tsx                     # Header with logo + user menu
    page.tsx                       # Dashboard home — artifact tiles
middleware.ts                      # Auth gate (everything except /sign-in is protected)
_source-references/                # Local-only .docx source files (git-ignored)
```
