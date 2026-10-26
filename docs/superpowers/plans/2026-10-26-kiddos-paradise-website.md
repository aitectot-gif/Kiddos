# Kiddos Paradise Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Six-page static website (+ privacy, 404) for Kiddos Paradise, deployable on Vercel from the repo root.

**Architecture:** Hand-written HTML pages sharing one stylesheet (`assets/css/styles.css`, extended from `_draft/styles.css`) and one script (`assets/js/main.js`). No build step. Header/footer duplicated per page. Checks run with bash (`tests/check-site.sh`) and headless Chrome (`tests/form.test.html` via `--dump-dom`) because Node/Python are not installed.

**Tech Stack:** HTML5, CSS, vanilla JS (ES2020), Google Fonts (Nunito, Open Sans), Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-10-26-kiddos-paradise-website-design.md`

## Global Constraints

- Phones always together, in order: `99727 76012 | 91879 63957`; links `tel:+919972776012`, `tel:+919187963957`.
- Email `kiddosparadise19@gmail.com`; Instagram `https://www.instagram.com/kiddos_explorers__hub/`.
- Address: `20th Cross Road, opposite St. John the Baptist Church, CHBS Layout, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040`.
- No `wa.me`/WhatsApp, no `unsplash`, no reviews/ratings/offers/fees anywhere outside `_draft/`.
- Logo `assets/img/kiddos-paradise-logo.png` byte-identical to `docs/brief/Kiddos Paradise - Logo.png`.
- Unconfirmed items wrapped in `.review-note`; `body.launch .review-note{display:none}`.
- Minimum font size 12px; canonical base `https://kiddosparadise.com/`.
- `vercel.json` must keep `_draft/`, `docs/`, `tests/` from being served.

## Review Focus

1. Parent submits form with no endpoint configured → must see honest "email draft" message, never "Thank you…submitted". (Task 2 test `mailto fallback`.)
2. Endpoint returns 500 / network error → error message with both phone numbers, button re-enabled. (Task 2 test `endpoint failure`.)
3. Bot fills honeypot → no submission, no mailto. (Task 2 test `honeypot`.)
4. Deep link to `programs.html#daycare` etc. from Home cards → anchor exists. (Task 4 anchor check.)
5. Unknown URL on Vercel → custom `404.html`. (Task 5 `vercel.json` + 404 page.)

---

### Task 1: Assets, stylesheet, site check script

**Files:**
- Create: `assets/img/kiddos-paradise-logo.png` (copy), `assets/css/styles.css`, `tests/check-site.sh`

**Interfaces:**
- Produces: CSS classes reused from draft plus new: `.page-hero`, `.chips`, `.program-detail`, `.compare-table`, `.steps`, `.doc-list`, `.photo-ph` (with `data-label`), `.filter-chip[aria-pressed]`, `.prose`, `.review-note`, `.skip-link`, `.header-phones`.
- `tests/check-site.sh` exits non-zero and prints `FAIL: <reason>` on any violation.

- [ ] Write `tests/check-site.sh` checking, for each of the 8 HTML pages: both `tel:` links present, both display numbers present, exactly one `<h1`, `<title>` present, every `href="x.html"`/`href="x.html#id"`/`href="#id"` resolves to a file and an `id="id"`; repo-wide (excluding `_draft`, `docs`, `.git`): no `unsplash`, no `wa.me`; logo hash matches; no `font-size` below 12px in styles.css.
- [ ] Run it → FAIL (no pages yet).
- [ ] Copy logo; build styles.css from draft: raise sub-12px sizes to 12px, add new components, header logo sized via `object-fit:cover` crop of transparent padding is NOT allowed (alters logo display) → instead use `object-fit:contain` with larger box (logo artwork occupies ~55% of canvas).
- [ ] Commit.

### Task 2: main.js with form logic + browser test

**Files:**
- Create: `assets/js/main.js`, `tests/form.test.html`

**Interfaces:**
- Produces: `window.KP = { FORM_ENDPOINT, buildMailto(fields) -> string, submitEnquiry(form, {endpoint, fetchImpl, navigate}) -> Promise<'mailto'|'sent'|'error'|'blocked'> }`. `fields` = `{parentName, phone, childAge, program, startDate, message}`.
- Messages (exact): sent → `Thank you for enquiring with Kiddos Paradise. Your details have been submitted. The school team will contact you using the information provided.`; mailto → `Opening an email draft to Kiddos Paradise. Your enquiry is sent only when you send that email.`; error → `Sorry, your enquiry could not be sent. Please call 99727 76012 or 91879 63957.`

- [ ] Write `tests/form.test.html` that builds a form fixture, loads `../assets/js/main.js`, runs cases and writes `PASS name`/`FAIL name` lines into `<pre id="out">`: `mailto fallback` (endpoint '' → returns 'mailto', navigate called with string starting `mailto:kiddosparadise19@gmail.com?subject=`, status text = mailto message); `endpoint success` (fetch stub 200 → 'sent', sent message); `endpoint failure` (stub 500 → 'error', error message, button not disabled); `honeypot` (company filled → 'blocked', fetch & navigate not called); `buildMailto encodes` (`&` in message appears as `%26`).
- [ ] Run via `chrome --headless=new --dump-dom http://localhost:8080/tests/form.test.html` → FAIL (no main.js).
- [ ] Implement main.js: nav toggle, year, gallery filters, lightbox (only items with `img`), form wiring calling `KP.submitEnquiry`.
- [ ] Rerun → all PASS. Commit.

### Task 3: Home page

**Files:** Create `index.html`
- [ ] Sections per spec §5 Home row; program cards link to `programs.html#<id>`; JSON-LD Preschool; photo slots use `.photo-ph`.
- [ ] Run check-site (index only expected to pass its own checks). Commit.

### Task 4: Inner pages

**Files:** Create `about.html`, `programs.html`, `admissions.html`, `gallery.html`, `contact.html`, `privacy.html`, `404.html`
- Program ids: `toddler, playgroup, nursery, lkg, ukg, daycare, tuition, camp, art-centre, evening`. Form anchor `#enquiry` on admissions and contact. Gallery categories: `classroom, art, play, events, camps, environment`.
- [ ] Write pages with copy from brief §6–§11.
- [ ] `bash tests/check-site.sh` → PASS. Commit.

### Task 5: Deploy config, SEO files, README, verify, push

**Files:** Create `vercel.json`, `robots.txt`, `sitemap.xml`, `README.md`
- `vercel.json`: `cleanUrls: true`, and rewrites/headers so `/_draft/*`, `/docs/*`, `/tests/*` return 404.
- [ ] Serve locally, screenshot every page at 1366 and 390 (iframe), check visually.
- [ ] check-site + form tests PASS.
- [ ] Commit, `git push origin main`, confirm `kiddos-kappa.vercel.app` returns 200 (curl).
