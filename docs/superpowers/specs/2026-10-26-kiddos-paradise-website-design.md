# Kiddos Paradise Pre School — Website Design Spec

**Date:** 2026-10-26
**Prepared for:** Tectot Business Solutions LLP (client: Kiddos Paradise, Vijayanagar, Bengaluru)
**Source brief:** `docs/brief/kiddos_paradise_website_content_and_design_plan.md` (the "brief")
**Visual reference:** `_draft/index.html` + `_draft/styles.css` (single-page draft)
**Repository:** https://github.com/aitectot-gif/Kiddos.git

## 1. Intent

Replace the school's suspended old website with a fast, mobile-first static site that turns local parents (many arriving from Meta ads on phones) into admission enquiries for preschool, daycare and tuition.

**Success actions:** tap-to-call either number, submit an enquiry, open directions, browse programs.

**Decided with the user:**
- Six-page sitemap from the brief (not a single page).
- Reuse the draft's visual design and CSS; extend it for the new pages.
- Plain HTML/CSS/JS, no build step, no framework.

**Assumptions (unconfirmed by client, per brief):** official name, photos, WhatsApp number, Google Maps listing URL, reviews, office hours, Art Centre / Evening Activities / Camp details, documents list, form service. These ship as clearly marked placeholders.

## 2. Non-negotiable content rules (from the brief)

1. Logo used exactly as supplied (transparent PNG, verified alpha=0 background). No recolour, crop, stretch or effects.
2. Both numbers always shown together, in order: **99727 76012 | 91879 63957**, in header, hero, contact and footer. Separate `tel:` links: `tel:+919972776012`, `tel:+919187963957`.
3. No WhatsApp button until the number is confirmed.
4. No fabricated reviews, ratings, awards, offers, discounts, "limited seats" or fees.
5. No stock photos of children presented as the school. All photo slots are branded placeholders labelled "School photo coming soon" until real, consent-approved photos are supplied.
6. Approach described as "Reggio Emilia and Montessori-inspired" — never as accredited/affiliated.
7. Program class hours are never presented as office hours.

## 3. File structure

```
index.html          Home
about.html          About Us
programs.html       Programs
admissions.html     Admissions
gallery.html        Gallery
contact.html        Contact
privacy.html        Privacy Policy
404.html            Not found
assets/css/styles.css
assets/js/main.js
assets/img/kiddos-paradise-logo.png   (byte-identical copy of supplied PNG)
robots.txt
sitemap.xml
README.md
docs/brief/…        client brief + original logo files
_draft/…            previous single-page draft (reference only, not deployed)
```

Header, footer and mobile action bar are duplicated in each HTML page (no build step). The README lists every repeated block so edits are made consistently. The active nav link is marked with `aria-current="page"`.

## 4. Shared layout

- **Announcement bar:** tagline + "Vijayanagar, Bengaluru".
- **Header (sticky):** logo (links to `index.html`), nav `Home | About Us | Programs | Admissions | Gallery | Contact`, both phone numbers, primary button **Enquire About Admissions** → `admissions.html#enquiry`. Mobile: hamburger menu (existing draft behaviour).
- **Footer:** logo, tagline, quick links (incl. Privacy Policy), both numbers, email, full address, Instagram (`https://www.instagram.com/kiddos_explorers__hub/`), © year.
- **Mobile sticky bar (≤520px):** **Call** (first number) and **Enquire**.
- **Page hero** (inner pages): kicker, H1 and lead from the brief's page-hero copy, on the cream background.

## 5. Page content

All copy comes from the brief section noted; wording is trimmed only where needed for layout.

| Page | Sections (brief §) |
|---|---|
| Home | Hero (5.2), Welcome (5.3), Programs overview — 10 cards linking to `programs.html#<id>` (5.4), Teaching approach (5.5), Facilities (5.6), Daycare band (5.7), Tuition band (5.8), Gallery preview — 5 placeholders + link (5.9), Admissions teaser (5.10), Reviews placeholder (5.11), FAQ preview — 6 Q&As (5.12) |
| About | Page hero, Our story (6), Meet the Director — Amirtha Ravi, portrait placeholder, no invented bio, Vision, Mission (5 bullets), Learning philosophy. Certificates section omitted (none supplied). |
| Programs | Page hero, jump-link chips, one section per program with Age / Timing / Seats facts + description (7.1–7.10), Daycare and Tuition as visually distinct bands, comparison table (7), enquiry CTA. Program section ids: `toddler, playgroup, nursery, lkg, ukg, daycare, tuition, camp, art-centre, evening`. |
| Admissions | Page hero + Call / Submit buttons (8), 5 steps, provisional documents list, fees policy, enquiry form `#enquiry`. |
| Gallery | Page hero (9), filter chips (All + 6 categories from 9), grid of labelled placeholders (each with `data-category`), lightbox for real images once added, Instagram link. |
| Contact | Page hero (10), contact details, program hours list, "Get Directions" (provisional Maps search link), Instagram, enquiry form `#enquiry`, sitewide FAQ — 12 Q&As (11). |
| Privacy | Plain-language policy: what the form collects, purpose (responding to enquiries), who receives it, retention, contact for removal. Marked for client/legal review. |
| 404 | Friendly message + links to Home, Programs, Contact + both numbers. |

## 6. Review notes ("confirm" markers)

Every item the brief marks as needing confirmation gets an inline element with class `review-note` (small, yellow, styled like the draft's `.confirm-tag` / `.micro-note`). One rule in `styles.css` — `body.launch .review-note{display:none}` — plus adding `class="launch"` to `<body>` hides them all at launch. The README documents this. Copy must still read correctly with the notes hidden.

## 7. Enquiry form

Same form on Admissions and Contact.

- **Fields:** parent/guardian name (required), phone (required, pattern `[0-9+\s()-]{8,18}`), child's age (required select), program (required select: 10 programs + "Not sure yet"), preferred start date (optional, date), message (optional), consent checkbox (required, links to `privacy.html`).
- **Validation:** native constraint validation + an `aria-live="polite"` status region with a plain error/success message.
- **Delivery:** `main.js` holds `const FORM_ENDPOINT = '';`.
  - Empty (default): build a pre-filled `mailto:kiddosparadise19@gmail.com` draft and say honestly that the enquiry is only sent once the parent sends that email.
  - Set (e.g. Formspree or Google Apps Script → Sheet): `fetch` POST as `FormData`; show the brief's thank-you message **only on a 2xx response**; on failure show an error with both phone numbers. Button is disabled while sending.
- A hidden honeypot field (`company`) silently drops bot submissions.

## 8. JavaScript (`assets/js/main.js`)

Small, dependency-free, each feature guarded so it no-ops if its elements are absent on a page:
1. Mobile nav toggle (from draft).
2. Footer year.
3. Gallery filter chips (toggle `hidden` on items, `aria-pressed` on chips).
4. Lightbox (`<dialog>`, from draft) — only for items that contain a real `<img>`.
5. Enquiry form (section 7).

## 9. Visual design

Reuse the draft's tokens and components: palette from the logo (`#F6C928` yellow, `#4CB2B4` teal, `#A6C83A` green, `#E73532` coral, `#7E2A1D` brown, `#FFF9EE` cream, `#303238` ink), Nunito headings, Open Sans body, rounded cards, doodles, ticker, daycare/tuition bands. New components: page hero, jump chips, program detail rows, comparison table, steps list, document list, photo placeholder, filter chips, privacy prose. Body text must stay ≥ 14px on mobile and meet WCAG AA contrast; the draft's 9–11px text sizes are raised to at least 12px.

Photo placeholder: rounded block in a brand pastel with a simple icon and the caption "School photo coming soon" + intended subject (e.g. "Classroom"), so the client knows what to supply.

## 10. SEO and metadata

- Per page: unique `<title>` and meta description targeting "preschool in Vijayanagar, Bengaluru" + page topic; canonical `https://kiddosparadise.com/<page>`; Open Graph title/description.
- JSON-LD `Preschool` on Home and Contact with only verified-as-supplied fields: name, address, both telephones, email, url, sameAs Instagram. No ratings.
- `sitemap.xml` (6 pages + privacy), `robots.txt` pointing to it.
- GA4 / Search Console / Meta Pixel: not included; README lists them as launch tasks.

## 11. Accessibility and performance

Semantic landmarks, one H1 per page, skip link, visible focus styles, labelled form controls, `alt` on logo, decorative glyphs `aria-hidden`, `prefers-reduced-motion` respected. No third-party scripts. Only external request: Google Fonts (`display=swap`). Logo is the only image asset.

## 12. Verification

1. Serve locally (`npx serve` or `python -m http.server`) and load every page — no console errors.
2. Automated link check: every internal `href` and `#anchor` resolves.
3. Grep check: every page contains both phone numbers and both `tel:` links; no `unsplash` or `wa.me` anywhere outside `_draft/`.
4. Form: required-field errors, mailto fallback string, and (with a stub endpoint) success-only-on-2xx behaviour.
5. Visual check at 375px, 768px and 1280px widths.
6. Logo file hash equals the supplied PNG's hash.

## 13. Out of scope

Hosting/DNS migration, connecting a real form service, analytics setup, real photos/reviews, WhatsApp. These are launch tasks listed in the README with the brief's §15 open questions.
