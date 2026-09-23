# RISHI RAJ SINGH — MASTER BUILD PLAN
### Personal Brand + Portfolio · Founder of schoolM
*Creative brief and complete implementation spec for Claude Code*

---

## 0. Quick facts

| Item | Value |
|---|---|
| Client | Rishi Raj Singh |
| Site type | Personal Brand + Founder Portfolio |
| Primary product | schoolM — school management software |
| One-liner | I build software that runs schools, so schools can focus on students. |
| Mission | Make school management simple and affordable for every school worldwide. |
| Primary CTA | "Book a schoolM demo" → schoolM website demo page (URL placeholder: `https://schoolm.in/demo` — **confirm**) |
| Feeling | Cinematic · premium · minimal · bold · warm · welcoming · futuristic |
| Video mode | 3 separate cinematic clips (not continuous) |
| Identity reference | `Media/rishi-reference.png` — studio portrait, black suit, white shirt, dark tie |
| Brand assets | `assets/img/schoolm-logo.png` (wordmark), `logo-mark.png`, `LogoOnly.png`, `LogoCircle1.png` |
| Project root | `/home/rishiraj/rishiraj-portfolio/` |

---

## 1. Website overview

> **v2.4 — Device compatibility (2026-09-23).** Verified: no horizontal overflow at 360/390/768/1024/1440/1920; Chromium + Firefox desktop and phone; emulated iPhone touch swipes are blocked while a clip plays (lock = Lenis stop + `overflow:hidden` + non-passive `touchmove`/`wheel`/key preventDefault). Fast jumps or nav links past an interlude remove it silently with the view held steady (`passed()` = more than half above the fold). Reduced-motion viewers get no interludes. If GSAP/ScrollTrigger or Lenis fail to load from CDN the page falls back to static content (`html.no-anim`) / native scrolling. WebKit could not be launched on the build machine (missing system libs, needs sudo) — test on a real iPhone/Safari before launch.

> **v2.3 — Interludes: play-through, not scrub (2026-09-23).** Per Rishi: scrolling is disabled on the two video interludes. When a `.cine` section reaches the top of the viewport the page snaps to it, scrolling locks (Lenis stop + `overflow:hidden`), the clip plays once at `data-rate` (2×, ≈5 s), then the section fades out, is removed from the flow (the next section is now exactly under the viewer) and scrolling is released. Reverse scrolling never shows a finished clip; scrolling back above it re-inserts it reset, so it plays again on the next pass. A safety timer releases the lock if a clip fails to play. No `refreshPriority` on any trigger — `ScrollTrigger.sort()` runs before every refresh so pins below are measured correctly.

> **v2.2 — Smoothness pass (2026-09-23).** Removed the Experience card-stack pin and the About pin (they left old content fixed behind new content); both are now normal flowing sections with staggered fade-and-rise entrances. Interludes now pin for `data-scrub` viewports + 1: the clip scrubs to its end first (forward-only — scrolling up holds the last frame, re-entering from above restarts it), then the following section slides up over the video via `.cover-next` (margin-top −100vh, z-index 2) so no finished video lingers. Section padding tightened (`--section-y: clamp(72px, 10vh, 140px)`).

> **v2.1 — Themes + cinematic interludes (2026-09-23).** Dark and light themes via `data-theme` on `<html>` (inline boot script reads localStorage, falls back to `prefers-color-scheme`; sun/moon toggle in the nav). All hard-coded rgba colors were tokenized (`--bg-rgb`, `--fg-rgb`, `--card-l`) so both themes share one stylesheet; in light mode the hero orbit video (black background) is hidden and the transparent cutout portrait shows instead. The desk and corridor clips are now standalone `.cine` sections: 100vh, pinned for 200vh of scroll, video scrubbed 0→end, **nothing layered on top** (nav hides while pinned; on mobile/iOS they simply play while on screen). Story and Contact no longer have video backgrounds.

> **v2 — Portfolio pivot (2026-09-23, evening).** At Rishi's request the site was redesigned from a schoolM founder site into a **personal developer portfolio** with all schoolM branding removed (logos, dashboard mock, demo CTAs). Content comes from his resume (`assets/Rishi-Raj-Singh-Resume.pdf`), the GitHub API (snapshot in `assets/data/`, live-refreshed client-side), and company sites (Lentra, Tech Mahindra). Positioning: *"Software that banks trust."* — Full Stack Software Engineer, Java/Spring Boot microservices + React/Next.js, fintech & lending (Lentra LMS/LOS). Sections: Hero (orbit video + tech chips) → tech marquee + stats → About statement → Experience (Lentra / Tech Mahindra / upGrad as stacked panels with logos and animated cards: loan lifecycle flow, roles matrix, stack grid) → Story (desk video) → Projects gallery (SchoolM, Rishi Tracker, JobsAtEz, Popcornpass, Next.js E-commerce, React Chat App — linked to GitHub) → Skills grid with devicon icons + live GitHub card + education/certifications → Contact (corridor video, email/LinkedIn/GitHub). Images: devicon SVGs (`assets/img/tech`), company favicons/logo (`assets/img/logos`), Unsplash photos (`assets/img/photos`), GitHub avatar. SchoolM remains only as a project entry, unbranded.

> **Update (2026-09-23, later).** The three scene clips were generated by Rishi with an external tool from `tools/VIDEO-PROMPTS.md` and dropped into `assets/video/` (1280×720 sources, 10 s each, upscaled/encoded to 1080p H.264 + VP9 + 480p mobile + posters, keyframe every 12 frames for smooth scrubbing). Scene 01 (360° orbit on black) autoplays looped inside the hero portrait column with a radial feather mask, replacing the static cutout; Scene 02 (desk) and Scene 03 (corridor) are full-bleed, scroll-scrubbed backgrounds behind the Story and CTA sections. Sections detect their video via `initSceneVideos()` and add `.has-video`, which dims the canvas layers.

> **Earlier build status (2026-09-23).** Veo video generation returned 429 (no free-tier quota; the Google project needs billing). The site therefore ships a **no-video cinematic fallback** that is the current live design: the hero is built around Rishi's real portrait (`assets/img/rishi-cutout-*.webp`, background removed with rembg) over an animated canvas aurora, grid and particles, with floating glass UI chips and mouse parallax; the Story section uses a tilted portrait card; the CTA uses a rotating dotted globe of school pins (canvas). Work cards carry per-card hue and CSS pattern art. When billing is enabled, run `tools/generate-videos.mjs` and re-introduce the `<video>` layers behind these elements at reduced opacity. `tools/generate-stills.mjs` generates the three scenes as stills (Gemini image models) once quota allows.

A single-page, scroll-driven cinematic site that introduces Rishi Raj Singh as the founder who is quietly rebuilding how schools run. It is not a corporate SaaS landing page and not an influencer page. It sits between the two: the clarity of a product site with the intimacy of a founder's story.

The scroll is the narrative:

1. **Arrival** — Rishi, alone, in a dark studio. A single line: *"Schools shouldn't run on spreadsheets."*
2. **Proof** — numbers count up as the studio fades.
3. **Why** — the mission, set in giant type.
4. **What** — three pillars of schoolM revealed one at a time.
5. **Who** — Rishi's story, three years of sitting in staff rooms.
6. **The product** — schoolM as a living dashboard.
7. **Featured work** — selected builds and moments.
8. **Invitation** — book a demo. One button, no noise.

Every section is designed to be understood in 3 seconds, and rewarded on the 30th.

---

## 2. Core positioning

**Positioning statement**
Rishi Raj Singh is the founder of schoolM, the school management platform built from inside schools, not boardrooms. He has spent 3+ years sitting with principals, accountants, and teachers to understand how a school actually runs — and turned that into software any school in the world can afford.

**Headline (hero)**
> Schools shouldn't run on spreadsheets.

**Sub-headline**
> I'm Rishi Raj Singh, founder of schoolM. I build the software that runs attendance, finance, and everyday operations for schools — so educators can get back to teaching.

**Tagline options (footer / meta)**
- Built inside schools. For every school.
- Software that runs schools.
- Simple. Affordable. Everywhere.

**Differentiators**
1. **Built from the staff room, not the boardroom** — every feature comes from a real school problem Rishi saw firsthand.
2. **One system, whole school** — attendance, fees, finance, events, communication, in one place.
3. **Priced for every school** — a fee structure a small-town school can say yes to.

**Audience**
- Primary: school owners, principals, administrators (India first, global second)
- Secondary: edtech investors, partners, collaborators, hiring candidates
- Tertiary: people googling "Rishi Raj Singh"

---

## 3. Brand personality

| Trait | What it looks like | What it never looks like |
|---|---|---|
| **Calm confidence** | Short sentences. Big type. Whitespace. | Exclamation marks. Hype. |
| **Warm** | Warm sunlight in the films, human photography, "you" language. | Cold enterprise gray. |
| **Builder** | Dashboards, systems, real UI. | Stock photos of handshakes. |
| **Grounded** | Talks about attendance registers and fee receipts. | Buzzwords. "Revolutionizing." |
| **Ambitious** | "Every school worldwide." | Apologetic. Small. |

**Voice**: First person. Plain. A founder talking to a principal over chai, not a pitch deck.

---

## 4. Visual direction

**Concept: "Midnight Campus"**
Deep midnight backgrounds like a school at 5 a.m. before anyone arrives. schoolM's own **navy** becomes the deep glow of a dashboard in a dark office; schoolM's **lime green** becomes the single warm-bright signal — the color of "present", "paid", "done" — and of every call to action. The palette is lifted straight from the schoolM logo so the personal brand and the product read as one family, while the dark cinematic treatment keeps this unmistakably a founder's site, not the product's landing page.

**Palette**

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#06090F` | Page background |
| `--ink-2` | `#0B111C` | Section backgrounds, cards |
| `--ink-3` | `#121B2B` | Elevated surfaces, borders |
| `--paper` | `#F3F5F8` | Primary text |
| `--paper-dim` | `#97A3B8` | Secondary text |
| `--navy` | `#194E82` | Brand navy (from logo) — glows, gradients, dashboard chrome |
| `--navy-bright` | `#2F78C4` | Lit navy — links, highlighted words, lit timeline dots |
| `--lime` | `#90C036` | Brand lime (from logo) — CTA buttons, key numbers, one word per section |
| `--lime-deep` | `#6F9A25` | CTA hover, gradient stops |
| `--grain` | rgba(255,255,255,0.035) | Film grain overlay |

**Rules**
- Lime appears **once** per section maximum. It is the signal, not the paint.
- No pure black (`#000`) and no pure white (`#FFF`) anywhere.
- Gradients are radial, soft, and always navy-to-transparent, positioned off-center.
- Film grain (SVG turbulence, animated at 8fps) sits above everything at 3.5% opacity.
- Thin 1px borders at `rgba(255,255,255,0.08)` define cards; no drop shadows on UI.

**Imagery**
- Three generated cinematic clips (Section 5–6).
- schoolM product UI rendered as CSS/HTML mock dashboards, not screenshots, so they animate.
- No stock photography of any kind.

---

## 5. Higgsfield Seedance 2.0 asset generation (executed via Gemini / Veo)

> **Engine note.** The user has asked that all video and audio be generated with **Gemini**. The prompt specs below are written in Seedance 2.0 style (subject / camera / lighting / motion / mood) and are passed verbatim to Google's Veo through the Gemini API (`veo-3.1-generate-preview`, 1080p, 8 s, 16:9), with the identity reference image attached for character consistency. If a clip needs 10–12 s, generate an 8 s clip and use Veo's extend, or loop the clip's last second with a cross-dissolve in post.

**Global generation settings**
- Resolution: **1920×1080**, 16:9
- Duration: **8 s** per clip (extend to 10–12 s where noted)
- Frame rate: 24 fps
- Identity reference: `Media/rishi-reference.png` attached to **every** generation as the character reference
- Negative prompt (all clips): `text, captions, watermark, logo, subtitles, extra people in focus, distorted face, cartoon, oversaturated, motivational-poster style, lens flare overload, jitter, fast cuts`
- Audio: generate **muted**; ambient audio is generated separately (Section 5.2) so the site can autoplay
- Output naming: `assets/video/scene-01-hero.mp4`, `scene-02-builder.mp4`, `scene-03-campus.mp4`
- Post-processing (ffmpeg): H.264 `-crf 23 -preset slow -movflags +faststart`, plus a WebM VP9 fallback, plus a poster frame JPG from frame 12 of each clip, plus a 480p mobile variant

**Identity lock line (prepend to every prompt)**
> "The subject is the man in the reference image: same face, short textured dark hair swept up, trimmed full beard, warm brown skin, medium build. Keep his identity consistent. He wears a slim black suit, white shirt, dark textured tie, and a black leather-strap watch — exactly as in the reference. He is calm, present, and never performs for the camera."

### 5.1 Generation script

Store the key in an environment variable — never in the repo:

```bash
export GEMINI_API_KEY="…"        # do not commit
node tools/generate-videos.mjs   # reads scenes.json, writes to assets/video/
```

`tools/generate-videos.mjs` will:
1. Read `Media/rishi-reference.png` as base64
2. For each scene in `tools/scenes.json`, call `models/veo-3.1-generate-preview:predictLongRunning` with the prompt, negative prompt, reference image, `aspectRatio: "16:9"`, `resolution: "1080p"`, `durationSeconds: 8`
3. Poll the operation until done, download the MP4
4. Run ffmpeg to produce `.mp4`, `.webm`, `-mobile.mp4`, and `-poster.jpg`

### 5.2 Ambient audio (optional, muted by default, toggle in nav)

Generate with Gemini's audio model or with Veo's native audio and strip the visuals:
- `assets/audio/ambient.mp3` — 60 s loop, "low warm synth drone, distant school corridor room tone, soft paper and footsteps at -30 dB, no melody, no percussion"
- Site starts muted; a small "Sound" toggle in the nav fades it in over 1.5 s.

---

## 6. Three cinematic scenes

### Scene 01 — HERO ORBIT · *"Before the school wakes"*
**Use**: Hero background, scroll-scrubbed 0–100vh.
**Prompt**
> [Identity lock] · A man stands still in the center of a vast black-void studio. A single navy-blue rim light traces his shoulder and jaw from behind-left; a faint lime-green fill from low front-right catches his cheekbone. Volumetric haze at 10%. The camera performs one slow, perfectly smooth 360° orbit around him at chest height, 8 seconds for the full rotation. He looks slightly off-camera, thoughtful, then meets the lens at the 6-second mark with the smallest confident nod. Ultra-shallow depth of field, 50mm anamorphic look, subtle horizontal flare, 24fps, film grain. Cinematic, premium, quiet authority. No gestures. No smiling for the camera.

**Mood keywords**: Denis Villeneuve, Apple keynote portrait, still water.
**Loop**: Orbit returns to start; loop seamlessly.

### Scene 02 — THE BUILDER · *"3 a.m., one more fix"*
**Use**: Story section background + Product section, scroll-scrubbed push-in.
**Prompt**
> [Identity lock] · The same man sits at a dark matte desk in a dim room lit only by his screens. Around him float six translucent holographic panels in navy blue: a student attendance grid filling with green ticks, a fee-collection ledger with rising bars, a weekly school timetable rearranging itself, a parent-message inbox, an events calendar, and a live map with pins on schools across India and the world. The panels drift slowly. One lime-green notification pulses on the nearest panel. The camera pushes in slowly and steadily from wide to medium close-up over 8 seconds, ending on his focused face lit by blue with a lime-green edge. He types, pauses, and reaches to tap the lime notification. 35mm, deep blacks, soft bloom on the holograms, film grain. Feels like a builder working through the night for people he'll never meet.

**Mood keywords**: Blade Runner 2049 interior, Minority Report UI but calmer, night-shift dedication.

### Scene 03 — THE CAMPUS · *"Every school, everywhere"*
**Use**: Final CTA background, plays on enter, scrubbed on scroll.
**Prompt**
> [Identity lock] · Dawn. The same man walks toward the camera down a long, empty school corridor. Rows of classroom doors on both sides; the far end glows with warm rising sunlight. As he walks, faint navy-blue data overlays bloom on the glass of each door he passes — attendance marks, fee receipts, a timetable, a report card — and fade behind him. Dust motes in the light. The camera pulls back slowly at his walking pace, low and steady, then holds as he stops 3 meters from the lens, hands relaxed, and looks past the camera to the horizon. 40mm, warm-cool color contrast (golden sun, navy shadows), gentle haze, film grain. The feeling is "the day is about to begin, and it will run smoothly." Hopeful, grounded, not corporate.

**Mood keywords**: Interstellar corridor, first day of school, "welcome."

---

## 7. Website structure

```
<nav>              fixed, minimal, appears after hero
01 HERO            scene-01 scroll-scrubbed, kinetic headline
02 STATS STRIP     animated counters on horizontal ticker band
03 MISSION         giant type, word-by-word reveal
04 THREE PILLARS   three full-height panels, pinned + stacked
05 STORY           scene-02 background, timeline text
06 PRODUCT         schoolM live mock dashboard, feature list
07 FEATURED WORK   horizontal scroll gallery
08 FINAL CTA       scene-03, one button
<footer>           marquee, links, credit
```

Total scroll height: ~1100vh on desktop, ~900vh on mobile.

---

## 8. Hero section

**Layout**: Full viewport. Video fills the background at 100vw × 100vh, `object-fit: cover`, darkened by a bottom-to-top gradient (`--ink` 90% → 0%).

**Copy**
- Eyebrow (mono, small, `--paper-dim`): `RISHI RAJ SINGH — FOUNDER, SCHOOLM`
- Headline (display, ~clamp(3.5rem, 12vw, 13rem)):
  `Schools shouldn't` / `run on` / **`spreadsheets.`** — "spreadsheets." in `--lime`, with a strike-through line that draws itself in 0.6 s after the word appears
- Sub (body-large, max 38ch): `I build the software that runs attendance, finance, and everyday operations for schools — so educators can get back to teaching.`
- Primary CTA: `Book a schoolM demo →` (lime, pill)
- Secondary: `Read my story ↓` (ghost, scrolls to Story)
- Bottom-left: scroll indicator — thin vertical line that scrubs with progress
- Bottom-right: `Scene 01 / Before the school wakes` (mono, 10px)

**Motion**
1. Page load: grain fades in, video first frame visible, headline words slide up from `y: 110%` with `clip-path` mask, stagger 0.08 s, `power4.out`, 1.2 s.
2. Scroll 0–100vh: video `currentTime` scrubbed 0→8 s (orbit follows scroll). Headline scales 1→0.92 and drifts up 12vh, opacity 1→0.
3. Scroll 80–100vh: nav fades in.

---

## 9. Animated stats strip

A full-width band at `--ink-2`, top and bottom 1px borders. Four counters, each `clamp(3rem, 8vw, 7rem)` in display type, labels in mono below.

| Number | Label | Note |
|---|---|---|
| **3+** | years building for schools | confirmed |
| **50+** | schools onboarded | **placeholder — confirm** |
| **25,000+** | students managed daily | **placeholder — confirm** |
| **99.9%** | platform uptime | **placeholder — confirm** |

Alternate / additional if preferred: `1M+ attendance records`, `₹10Cr+ fees processed`, `40% less admin time`, `4 countries`.

**Motion**: On enter (once), counters count from 0 to target over 1.6 s with `expo.out`, digits rolling like a split-flap board. Behind the strip a slow horizontal marquee of outlined words at 6% opacity: `ATTENDANCE · FEES · TIMETABLE · EVENTS · PARENTS · REPORTS ·` moving at 40px/s, speed scaling with scroll velocity.

---

## 10. Mission section

**Layout**: 150vh pinned. Text centered, max-width 18ch, display type at `clamp(2.5rem, 7vw, 8rem)`.

**Copy**
> Every school deserves software that just works — **simple enough** for a two-room school, **powerful enough** for a campus of five thousand, and **affordable** for both.

**Motion**: Pinned for 100vh of scroll. Each word begins at `opacity 0.15`, `--paper-dim`. As scroll progresses, words light up left-to-right to full `--paper` (kinetic "reading" effect). The three bold phrases turn `--navy-bright` when lit; the final word "both." turns `--lime`. A soft radial navy glow follows the currently-lighting word. On exit, whole block scales to 0.9 and fades.

Small mono caption below: `THE MISSION — MAKE SCHOOL MANAGEMENT SIMPLE AND AFFORDABLE FOR EVERY SCHOOL WORLDWIDE.`

---

## 11. Three pillars section

Three panels, each 100vh, pinned and stacked (card-stack effect: as the next panel scrolls in, the previous one scales to 0.94 and darkens).

| # | Pillar | Headline | Body | Visual |
|---|---|---|---|---|
| 01 | **Attendance & Academics** | *Know who's in the room.* | Student and faculty attendance in one tap, timetables that build themselves, and reports that reach parents before the bell. | Animated attendance grid: 30×6 cells filling with blue ticks in a wave |
| 02 | **Finance & Fees** | *Every rupee, accounted for.* | Fee collection, receipts, dues reminders, payroll, and expenses — the whole ledger of a school, without the ledger. | Bar chart growing + a receipt that "prints" downward |
| 03 | **Events & Operations** | *The whole calendar, in sync.* | Events, exams, holidays, notices, and parent communication — planned once, seen by everyone who needs to. | Calendar grid with lime event pill sliding across weeks |

**Layout per panel**: left 45% — number (mono, huge outline `01`), pillar name, headline (display), body (max 42ch); right 55% — CSS-built visual in an `--ink-3` bordered card with slight 3D tilt following the mouse (±4°).

**Motion**: Headline words rise with clip-mask on enter. Visual animation plays on enter. Number `01` counts up as an odometer when the stack transitions.

---

## 12. Story section

**Background**: Scene 02 (THE BUILDER), scroll-scrubbed across the section, darkened 60%, with a left-side gradient to keep text legible.

**Eyebrow**: `THE STORY`
**Headline**: *I didn't start with a product. I started with a staff room.*

**Body (three beats, each revealed on scroll)**

> **Three years in tech, most of it in schools.** I sat in principals' offices while they reconciled fees by hand. I watched teachers mark attendance in three different registers. I saw the same problems in every school I visited — and the same expensive, complicated software failing to solve them.

> **So I started building.** Not from a spec, but from the problems on the desk in front of me. Attendance first. Then fees. Then everything a school does between the first bell and the last.

> **That became schoolM.** A system a school can learn in a day and afford for years. I still spend most of my week talking to the people who use it — because the next feature is always sitting in someone's staff room.

**Signature line** (handwritten-style SVG stroke animation, lime): `— Rishi`

**Side rail**: A vertical timeline on the left (mono): `2023 · First school` → `2024 · schoolM v1` → `2025 · Finance module` → `2026 · Going global` — **years placeholder, confirm**. Dots light up in `--navy-bright` as beats reveal.

---

## 13. Product / Service section — schoolM

**Eyebrow**: `THE PRODUCT`
**Headline**: *One system. The whole school.*
**Sub**: *schoolM runs the daily operations of a school — attendance, finance, events, communication — in one place, on any device.*

**Logo**: the real schoolM wordmark (`assets/img/schoolm-logo.png`) sits above the headline; the shield mark (`logo-mark.png`) is used as the dashboard favicon and as a watermark in the pillar cards.

**Centerpiece**: A CSS/HTML mock of the schoolM dashboard in a browser frame (`--ink-2`, 1px border, 16px radius). Perspective-tilted at rest (`rotateX(8deg)`), flattens to 0° as it scrolls into center. Panels inside animate live:
- Today's attendance ring filling to 96%
- Fee collection this month bar
- Upcoming events list with an lime pill
- Notifications ticking in

**Feature grid** (2×3, mono labels, one line each):
Student & Faculty Attendance · Fee Collection & Receipts · Payroll & Expenses · Timetable & Exams · Events & Notices · Parent Communication

**CTA**: `See schoolM in action →` (lime) + `Visit schoolm website` (ghost) — both to the schoolM URL.

---

## 14. Featured work / content section

**Eyebrow**: `SELECTED WORK`
**Headline**: *Things I've built. Rooms I've sat in.*

Horizontal scroll gallery (pinned section, horizontal translate driven by vertical scroll). Six cards, 70vw × 60vh on desktop:

1. **schoolM Attendance Engine** — "One tap for a class of 60. Synced to parents in seconds." (Product)
2. **schoolM Finance Suite** — "Fees, receipts, payroll, expenses. The whole ledger, automated." (Product)
3. **Timetable Builder** — "Constraint-based scheduling that builds a week in minutes." (Product)
4. **Multi-tenant Platform** — "One codebase, every school isolated, scaled across regions." (Engineering)
5. **From the field** — "What 50 principals taught me about software." (Writing — placeholder)
6. **Talks & Notes** — "On building affordable software for emerging-market schools." (Speaking — placeholder)

Each card: gradient background (navy radial), large index number, title, one-liner, mono category tag, arrow that rotates 45° on hover. Cards parallax at slightly different speeds.

---

## 15. Final CTA section

**Background**: Scene 03 (THE CAMPUS), plays forward on scroll into view (scrubbed 0→8 s across 150vh), then holds on the last frame.

**Copy** (centered, display, `clamp(3rem, 10vw, 11rem)`):
> Let's run your school **better.**

("better." in lime.)

**Sub**: *Book a 20-minute demo of schoolM. I'll show you the product and you'll tell me what's broken in your school — I'll probably have seen it before.*

**CTA**: One large lime pill — `Book a schoolM demo →` — magnetic hover (button follows cursor within 24px), fill sweeps from left on hover.
**Micro-line below**: `No sales team. You'll be talking to me.`

---

## 16. Footer

- Top: full-width marquee, outlined display type: `RISHI RAJ SINGH — FOUNDER, SCHOOLM — BUILT INSIDE SCHOOLS. FOR EVERY SCHOOL. —` scrolling at 60px/s, reverses direction with scroll direction.
- Middle, 3 columns (mono):
  - **Connect**: LinkedIn · X/Twitter · GitHub · Email (placeholders — confirm handles)
  - **schoolM**: Website · Book a demo · Features
  - **Site**: Story · Product · Work · Top ↑
- Bottom: `© 2026 Rishi Raj Singh` · `Made in India, for schools everywhere.` · local time clock (JS) · `Sound: off/on` toggle
- Very bottom: subtle lime 1px line.

---

## 17. Complete visual style guide

**Spacing scale**: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 px (`--s1 … --s11`). Section padding `clamp(96px, 14vh, 192px)` vertical, `clamp(20px, 5vw, 96px)` horizontal.

**Grid**: 12 columns, `gap: 24px`, max-width 1600px, but display headlines may break the container.

**Radius**: buttons 999px (pill); cards 16px; dashboard frame 20px.

**Borders**: `1px solid rgba(255,255,255,0.08)`; hover `0.16`.

**Buttons**
- Primary: `--lime` bg, `--ink` text, 18px/56px, pill, mono-uppercase label at 13px, letter-spacing 0.08em. Hover: `--lime-deep` sweep + arrow moves 4px right.
- Ghost: transparent, 1px border `--paper` 20%, `--paper` text. Hover: border 100%.

**Cursor**: Custom 12px dot (`--paper`) with 40px ring; ring scales 2× and turns `--lime` over links; shows "SCRUB" label over videos; native cursor on touch.

**Grain**: fixed full-screen `<div class="grain">` with SVG `feTurbulence` baseFrequency 0.8, opacity 0.035, `mix-blend-mode: overlay`, background-position stepped every 125 ms.

**Glow**: `.glow { background: radial-gradient(closest-side, rgba(25,78,130,0.35), transparent) }` blurred 80px, placed off-center per section, moves ±30px on scroll.

---

## 18. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | **Instrument Serif** (Google Fonts) | 400, italic for emphasis words | Editorial, premium, unexpected for tech — sets the founder apart |
| Body / UI | **Inter Tight** (Google Fonts) | 400, 500 | Tight, modern, highly legible |
| Mono / labels | **JetBrains Mono** (Google Fonts) | 400 | Eyebrows, stats labels, captions, nav |

**Scale (fluid)**
- Display XL: `clamp(3.5rem, 12vw, 13rem)`, line-height 0.9, letter-spacing -0.03em
- Display L: `clamp(2.5rem, 7vw, 8rem)`, lh 0.95, ls -0.02em
- Display M: `clamp(2rem, 4.5vw, 4.5rem)`, lh 1.0
- Body L: `clamp(1.125rem, 1.4vw, 1.5rem)`, lh 1.5
- Body: `1rem`, lh 1.6
- Mono: `0.75rem`, uppercase, ls 0.12em

**Kinetic rules**
- All display text is split into words (and hero into characters) via a lightweight custom splitter (no SplitText license needed).
- Reveal = translateY 110% → 0 inside an `overflow: hidden` mask, with `clip-path: inset(0 0 100% 0)` → `inset(0)`.
- One italic word per headline for rhythm (e.g. *spreadsheets*, *better*).

---

## 19. Animation direction

**Principles**
1. **Scroll is the timeline.** Nothing important plays unless the user scrolls it into being.
2. **Slow is premium.** Default duration 1.2 s, easing `power3.out` / `expo.out`. Nothing under 0.4 s except hovers.
3. **One thing moves at a time.** Stagger; never explode.
4. **Motion has physics.** Lenis lerp 0.08, magnetic buttons, mouse-tilt cards.
5. **Respect `prefers-reduced-motion`.** All scrubbing becomes static posters; reveals become opacity-only.

**Library stack (CDN)**
- GSAP 3.12+ core
- ScrollTrigger
- Lenis 1.x (smooth scroll), synced with `gsap.ticker`

**Signature moves**
- Video scrub: `ScrollTrigger` with `scrub: 0.6` driving `video.currentTime` via a GSAP tween on a proxy object (smooth, not frame-jumpy).
- Word-light mission text.
- Card-stack pillars.
- Horizontal work gallery.
- Odometer counters.
- Marquee with scroll-velocity coupling.

---

## 20. Interaction design

- **Nav**: hidden on hero; slides in at 80vh. Left: `RRS` monogram. Center: `Story · Product · Work`. Right: `Book a demo` (small lime pill) + sound toggle. Background blur `backdrop-filter: blur(12px)` at `--ink` 60%.
- **Links**: underline draws left→right on hover (`background-size` trick), 0.4 s.
- **Buttons**: magnetic (translate toward cursor up to 24px, spring back).
- **Cards**: 3D tilt ±4°, highlight gradient follows cursor.
- **Video hover**: cursor label "SCRUB"; a thin progress bar appears at the bottom of the video.
- **Sound toggle**: 4-bar mini equalizer icon; bars animate when on.
- **Keyboard**: all interactive elements focusable with a visible lime 2px outline offset 4px.

---

## 21. Scroll behavior

- Lenis smooth scroll, `lerp: 0.08`, `wheelMultiplier: 0.9`, `smoothTouch: false` (native on touch for performance).
- `ScrollTrigger.scrollerProxy` wired to Lenis; `lenis.on('scroll', ScrollTrigger.update)`.
- Pinned sections: Mission (100vh pin), Pillars (300vh pin), Work gallery (horizontal, `end: "+=" + scrollWidth`).
- Video sections: `scrub: 0.6`; videos are `preload="auto"`, `muted`, `playsinline`; scrubbing waits for `canplaythrough`.
- Scroll progress bar: 2px lime line at the very top of the viewport.
- Anchor links use `lenis.scrollTo(target, { offset: -80, duration: 1.6 })`.

---

## 22. Mobile behavior

- Videos: serve `-mobile.mp4` (480p) via `<source media="(max-width: 768px)">`. On iOS, scrubbing `currentTime` is unreliable → fallback to **autoplay loop** for hero and CTA, and a **poster image with parallax** for the Story section.
- Pillars: unstacked, vertical, visuals below text.
- Work gallery: native horizontal `scroll-snap` instead of pinned translate.
- Display type floors: hero min 3.5rem; all headlines wrap gracefully with `text-wrap: balance`.
- Nav: monogram + hamburger → full-screen menu with staggered links.
- Custom cursor and magnetic effects disabled on `(pointer: coarse)`.
- Grain opacity reduced to 0.025; blur filters removed on mobile for GPU savings.
- Side gutter 16px minimum; no horizontal page scroll ever.

---

## 23. Technical implementation

### File structure
```
rishiraj-portfolio/
├── index.html
├── style.css
├── script.js
├── BUILD-PLAN.md
├── Media/
│   └── rishi-reference.jpg        ← identity reference (user provides)
├── tools/
│   ├── scenes.json                ← the three prompts
│   └── generate-videos.mjs        ← Gemini/Veo generation + ffmpeg post
└── assets/
    ├── video/
    │   ├── scene-01-hero.mp4 / .webm / -mobile.mp4 / -poster.jpg
    │   ├── scene-02-builder.mp4 / .webm / -mobile.mp4 / -poster.jpg
    │   └── scene-03-campus.mp4 / .webm / -mobile.mp4 / -poster.jpg
    ├── audio/
    │   └── ambient.mp3
    ├── img/
    │   ├── schoolm-logo.png       ← brand wordmark (from schoolM repo)
    │   ├── logo-mark.png / LogoOnly.png / LogoCircle1.png
    │   ├── og.jpg                 ← 1200×630 social card
    │   └── favicon.svg            ← "RRS" monogram
    └── fonts/                     ← (optional self-hosted fallback)
```

### CDN links
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### index.html — requirements
- Semantic sections with `id`s: `hero, stats, mission, pillars, story, product, work, cta`.
- `<video>` elements with `muted playsinline preload="auto" poster="…"` and both mp4 + webm sources, mobile source first.
- Text pre-split into `<span class="word">` at build time by JS, not hardcoded.
- Meta: title `Rishi Raj Singh — Founder, schoolM`, description, OG image, theme-color `#06090F`.
- A `<div class="grain">`, `<div class="cursor">`, `<div class="progress">` at body end.
- `<noscript>` shows all content statically.

### style.css — requirements
- All tokens on `:root`. Fluid type via `clamp`. `scroll-behavior` left to Lenis.
- `html.lenis { height: auto }`, `.lenis.lenis-smooth { scroll-behavior: auto }`.
- Reduced-motion media query neutralizes transforms.
- Every section has an explicit background; no reliance on body bleed.
- Mobile-first breakpoints: 768, 1024, 1440.

### script.js — modules (single file, IIFE sections)
1. `initLenis()` — create Lenis, sync to GSAP ticker, wire ScrollTrigger proxy.
2. `splitText()` — wrap words/chars in spans with masks.
3. `initHero()` — intro timeline + video scrub + parallax.
4. `initStats()` — odometer counters + velocity marquee.
5. `initMission()` — word-light pinned timeline.
6. `initPillars()` — card stack + per-panel visual animations.
7. `initStory()` — video scrub + beat reveals + timeline dots + signature stroke.
8. `initProduct()` — dashboard tilt-flatten + live panel animations.
9. `initWork()` — horizontal gallery + card parallax (desktop) / scroll-snap (mobile).
10. `initCTA()` — video scrub + magnetic button.
11. `initNav()` — show/hide, anchor scrolling, mobile menu, sound toggle.
12. `initCursor()` — custom cursor (pointer: fine only).
13. `initGrain()` — stepped background-position.
14. `videoScrub(video, trigger)` — shared helper: waits for metadata, tweens a proxy `{t}` and sets `currentTime`, with `requestVideoFrameCallback` guard.

### Performance
- Videos ≤ 6 MB each at 1080p (CRF 23), ≤ 1.5 MB mobile.
- `IntersectionObserver` pauses/plays off-screen videos and unloads sources beyond 2 viewports.
- Fonts `display=swap`; critical CSS inline for hero only.
- `will-change` applied only during active tweens, removed on complete.
- Lighthouse targets: Performance ≥ 85 (desktop), Accessibility ≥ 95, Best Practices 100.
- All images lazy-loaded; posters `decoding="async"`.

### Accessibility
- Color contrast ≥ 4.5:1 for body text (`--paper` on `--ink` = 17:1; `--paper-dim` = 7.2:1).
- Skip link. Focus outlines. `aria-label`s on icon buttons. Videos `aria-hidden="true"` (decorative).
- `prefers-reduced-motion` respected throughout.

### Placeholders to confirm before launch
- [ ] schoolM demo URL
- [ ] Stats: schools, students, uptime
- [ ] Timeline years
- [ ] Social handles + email
- [ ] Rotate the Gemini key that was pasted into chat; export the new one as `GEMINI_API_KEY`

---

*End of Master Build Plan.*
