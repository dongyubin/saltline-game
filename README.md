# Saltline — playable landing page

A search-intent landing page for the keyword **"saltline"**: the browser FPS that
Anthropic's **Claude Fable 5.2** generated from a single prompt. The page answers
the three things people searching "saltline" actually want, in order:

1. **Play it now** — the full game is embedded on the first screen (no download,
   no account). Click the stage to capture the mouse and start.
2. **How to play** — the game's real controls and the four mission objectives.
3. **What is it** — how it was made, the cost/time stats, press coverage and FAQ.

The whole game ships as one self-contained `game/index.html` (~1.4 MB, Three.js
and all models/textures/sound made in code). The landing shell is plain HTML/CSS/JS
with a custom "harbor-neon" design system — no framework, no build step.

## Attribution

This is a **community mirror** for local / static-host play. Saltline was created
by **Felix Rieseberg** using Claude Fable 5.2 (Anthropic) and shared on 2026-11-09.
All credit for the game goes to its original author. This project is **not
affiliated with or endorsed by Anthropic**. If you are the author and want the
game removed, open an issue. See [`LICENSE`](LICENSE) for details — the MIT license
covers the landing code only, **not** the game.

- Source mirror: https://github.com/realcodebear/saltline-fable-5.2
- Original artifact: https://claude.ai/artifact/BGY1SztrAYcJQHSsnHHGmp

## Run locally

It is a static site. Serve the folder with any static server:

```sh
python -m http.server 8899
# then open http://localhost:8899
```

Click the game stage to capture the mouse and start the sound. `Esc` releases the
mouse. Best on desktop with mouse + keyboard.

## Deploy: GitHub → Vercel

1. **Push to GitHub.** Create a repo and push this folder (the repo root should
   contain `index.html`).
2. **Import to Vercel.** Vercel dashboard → *Add New… → Project* → import the repo.
   - Framework Preset: **Other**
   - Build Command: *(leave empty)*
   - Output Directory: *(leave as root `./`)*
   `vercel.json` already sets `cleanUrls` and cache headers; `.vercelignore`
   excludes the upstream template reference.
3. **Custom domain.** The production URL is **https://saltline-game.wwkejishe.top**.
   All SEO URLs (canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`)
   already point there. In Vercel → Project → Settings → Domains, add
   `saltline-game.wwkejishe.top`, then create the DNS record Vercel shows
   (typically a CNAME to `cname.vercel-dns.com`) at the DNS provider for
   `wwkejishe.top`. Keeping the canonical and social-card URLs on this domain
   matters for indexing and link previews.

## Project structure

```
.
├── index.html            # landing page (SEO head + JSON-LD + all sections)
├── assets/
│   ├── css/main.css      # harbor-neon design system
│   ├── js/main.js        # nav, scrollspy, reveals, counters, game stage, FAQ
│   ├── poster.webp       # key art (stage + showcase)
│   └── og.jpg            # 1200×630 social card
├── game/index.html       # the playable game (single-file mirror)
├── robots.txt
├── sitemap.xml
├── vercel.json           # cleanUrls + cache headers
├── .vercelignore
└── LICENSE               # MIT for landing code; game is third-party
```

## SEO notes

- One page, one intent cluster: playable tool + informational support, targeting
  `saltline`, `saltline game`, `saltline unblocked`, `how to play saltline`.
- Title / description / H1–H2 follow the intent; FAQ is mirrored in `FAQPage`
  JSON-LD; the game is described with `VideoGame` JSON-LD.
- After deploying, submit `sitemap.xml` in Google Search Console and request
  indexing. New pages typically take 2–4 weeks to earn impressions.
