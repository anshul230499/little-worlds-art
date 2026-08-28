# Sumedha Bhargava — Art Portfolio

A warm, editorial art portfolio built with Next.js 16.3.3 and designed for Vercel.

## Change the personal details

Before publishing, edit `app/page.js` and replace:

- the placeholder artist statement
- the About bio
- `hello@example.com`
- the Instagram link

Also update the site title and description in `app/layout.js`.

## Run locally

Requires Node.js 20.9+ (a current Node 22 or 24 installation is ideal).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Push to GitHub

Create an empty GitHub repository, then run:

```bash
git init
git add .
git commit -m "Initial art portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Deploy on Vercel

1. In Vercel, choose **Add New → Project**.
2. Import the GitHub repository.
3. Vercel will detect Next.js automatically.
4. Click **Deploy**. No custom build settings are needed.

Every later push to `main` will update the production site automatically.

## Artwork files

Artwork lives in `public/art` and studio/process photography in `public/studio`.
The gallery metadata and display order are defined near the top of `app/page.js`.


## Current placeholders

The site now uses the artist name **Sumedha Bhargava**. It still intentionally uses a Frida Kahlo quote, placeholder contact information, and the line “Artist bio to be described and updated.” Replace those once Sumedha’s preferred bio, email, and Instagram are available.

## Credits and copyright

- Original artwork: © 2026 Sumedha Bhargava. All rights reserved.
- Studio/process imagery: courtesy of Sumedha Bhargava.
- Alpine window background: original image generated with OpenAI for this portfolio and stored locally at `public/backgrounds/alpine-window.webp`. No Unsplash image is used.
- Third-party characters, trademarks, and referenced intellectual property remain the property of their respective rights holders.
- The Frida Kahlo quote on the site is attributed to Frida Kahlo.
