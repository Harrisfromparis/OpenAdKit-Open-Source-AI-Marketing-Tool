# Autism & Me Ad Studio

This repository is the Autism & Me Ad Studio, built on [OpenAdKit](https://github.com/IamRamgarhia/OpenAdKit-Open-Source-AI-Marketing-Tool) by Dicecodes (MIT licence; the original `LICENSE` and `NOTICE.md` are kept unchanged).

## What Autism & Me changed

- **Brand kit 1.1.** Dark-teal ground (#05222B), cream text, orange for the one call to action with black text, Poppins headings and Atkinson Hyperlegible body text (self-hosted under the SIL Open Font Licence in `app/fonts`), 18px body and nothing under 16px, the reversed Autism & Me logo, no flashing or pulsing motion.
- **Ad Check** (`lib/ad-check.ts`, page `/check`, and a panel under every generator result). Checks Meta's personal-attributes rule, health and outcome claims, deficit language, puzzle pieces, social-issue wording (Meta stopped political and social-issue ads in the EU in October 2025), staff–child physical contact in image prompts, the brand voice and field lengths. Verdicts: Pass, Pass with warnings, Needs your review, Revise before use. It is a helper, not legal or policy clearance.
- **House rules in every AI prompt** (`AUTISM_AND_ME_HOUSE_RULES` in `lib/brand-brain.ts`).
- **Autism & Me brand profile** ready to add from the Clients page (`lib/autism-and-me-brain.ts`). Facts only, no invented reviews or figures.
- **ANposting hand-off** (`lib/handoff.ts`). An approved ad becomes a saved-draft JSON file (`autismandme.adstudio.handoff/1`) with UTM tags and a SHA-256 hash of the approved text. Ad Studio never posts and never spends.
- **No third-party page readers.** The Jina Reader, Jina search and AllOrigins fallbacks are removed; pages are read only by this app's own `/api/ingest` route. Search engines are told not to index the site.

## Run

```bash
npm ci
npm run dev   # http://localhost:3005
npm test
```

Deployed on Vercel from this repository.
