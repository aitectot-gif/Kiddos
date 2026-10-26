# Kiddos Paradise Pre School — Website

Static website for Kiddos Paradise, Vijayanagar, Bengaluru. Built by Tectot Business Solutions LLP.
No build step: plain HTML, one stylesheet, one script. Deployed on Vercel from the repo root.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About Us |
| `programs.html` | Programs (ids: `toddler playgroup nursery lkg ukg daycare tuition camp art-centre evening compare`) |
| `admissions.html` | Admissions + enquiry form (`#enquiry`) |
| `gallery.html` | Gallery with filters + lightbox |
| `contact.html` | Contact + enquiry form (`#enquiry`) + FAQ (`#faq`) |
| `privacy.html` | Privacy Policy (draft for review) |
| `404.html` | Not found (uses root-relative `/` links so it works at any URL) |

Shared: `assets/css/styles.css`, `assets/js/main.js`, `assets/img/kiddos-paradise-logo.png` (supplied logo, unchanged).

## Repeated blocks — edit on every page

These are copied into each HTML file. When you change one, change it everywhere (search for the text):

- Announcement bar (tagline left; location + both phone numbers right), `<header class="site-header">` (nav + Enquire button)
- `<footer class="site-footer">` and `<div class="mobile-actions">`
- Enquiry form (`admissions.html` and `contact.html`)
- JSON-LD business details (`index.html` and `contact.html`)

Rule from the brief: always show **99727 76012 | 91879 63957** together.

After changing `styles.css` or `main.js`, bump the `?v=` on their links in every page (browsers cache `/assets` for 7 days).

## Preview locally

Serve the folder with any static server and open http://localhost:8080/ — e.g. `npx serve -l 8080 .` or `python -m http.server 8080`.

## Checks

```bash
bash tests/check-site.sh          # links, anchors, phone numbers, one <h1>, no stock photos/WhatsApp, logo unchanged, font sizes
```
Form logic: serve the repo and open `/tests/form.test.html` (all lines should read PASS).

## Before launch

1. **Review notes:** yellow "Confirm…" notes mark unconfirmed details. After the client confirms them, update the copy, then add `class="launch"` to `<body>` on every page to hide any remaining notes.
2. **Photos:** replace every "School photo coming soon" placeholder (`.photo-ph`) with real, compressed (WebP) school photos. Written parent/guardian consent is required for identifiable children. Gallery instructions are in a comment in `gallery.html`.
3. **Enquiry form:** follow `integrations/google-apps-script/SETUP.md` (Google Sheet + email alert to kiddosparadise19@gmail.com), then set `FORM_ENDPOINT` in `assets/js/main.js` to the web app `/exec` URL and send a live test. Until then the form opens a pre-filled email draft and tells the parent so.
4. **Google Maps:** replace the provisional search link in `contact.html` with the verified listing and optionally embed the map.
5. **WhatsApp:** add only after the WhatsApp number is confirmed.
6. **Reviews:** add 3–6 genuine, approved parent reviews and the Google Reviews link (Home, reviews section).
7. **Director:** add the approved portrait (and optional message) on `about.html`.
8. **Analytics:** GA4, Search Console and Meta Pixel after IDs and consent are confirmed (update `privacy.html` first).
9. **Domain:** connect `kiddosparadise.com` in Vercel after checking existing email DNS records. Canonical URLs and `sitemap.xml` already use that domain.

Open client questions are listed in `docs/brief/kiddos_paradise_website_content_and_design_plan.md` §15.

## Not deployed

`.vercelignore` keeps `_draft/` (old one-page draft), `docs/` (brief, spec, plan) and `tests/` off the public site.
