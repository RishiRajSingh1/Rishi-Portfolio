# Video generation prompts — Rishi Raj Singh site

**Reference image (upload with every generation):** `~/Desktop/rishi-reference.png`
(also at `Media/rishi-reference.png`)

**Settings for every clip**
- Mode: image-to-video / character reference (attach the reference image as the identity or first frame)
- Aspect ratio: 16:9 · Resolution: 1080p · Duration: 8 s (10–12 s if allowed) · 24 fps
- No audio needed (site plays muted) · No text, captions, logos or watermarks

**Negative prompt (paste where supported)**
text, captions, watermark, logo, subtitles, extra people in focus, distorted face, cartoon, oversaturated, motivational-poster style, lens flare overload, jitter, fast cuts, morphing face, extra fingers

---

## Scene 01 — HERO ORBIT · file name `scene-01-hero.mp4`

The man from the reference image — same face, short textured dark hair swept up, trimmed full beard, warm brown skin, slim black suit, white shirt, dark tie, black watch — stands perfectly still in the center of a vast black-void studio. A single deep navy-blue rim light traces his shoulder and jaw from behind-left; a faint lime-green fill from low front-right catches his cheekbone. Light volumetric haze. The camera performs one slow, perfectly smooth 360° orbit around him at chest height, taking the full 8 seconds. He looks slightly off-camera, thoughtful, then meets the lens near the end with the smallest confident nod. Ultra-shallow depth of field, 50mm anamorphic look, subtle horizontal flare, 24fps, fine film grain. Cinematic, premium, quiet authority. No gestures, no smiling for the camera, no text.

---

## Scene 02 — THE BUILDER · file name `scene-02-builder.mp4`

The same man from the reference image — same face, beard, hair, slim black suit, white shirt, dark tie — sits at a dark matte desk in a dim room lit only by his screens. Around him float six translucent holographic panels in navy blue: a student attendance grid filling with green ticks, a fee-collection ledger with rising bars, a weekly school timetable rearranging itself, a parent-message inbox, an events calendar, and a live map with glowing pins on schools across India and the world. The panels drift slowly. One lime-green notification pulses on the nearest panel. The camera pushes in slowly and steadily from wide to medium close-up over 8 seconds, ending on his focused face lit blue with a lime-green edge. He types, pauses, and reaches to tap the lime notification. 35mm lens, deep blacks, soft bloom on the holograms, fine film grain. Feels like a builder working through the night for people he will never meet. No readable text.

---

## Scene 03 — THE CAMPUS · file name `scene-03-campus.mp4`

Dawn. The same man from the reference image — same face, beard, hair, slim black suit, white shirt, dark tie — walks toward the camera down a long, empty school corridor. Rows of classroom doors on both sides; the far end glows with warm rising sunlight. As he walks, faint navy-blue data overlays bloom on the glass of each door he passes — attendance marks, fee receipts, a timetable, a report card — and fade behind him. Dust motes in the light. The camera pulls back slowly at his walking pace, low and steady, then holds as he stops three meters from the lens, hands relaxed, and looks past the camera to the horizon. 40mm lens, warm-cool color contrast (golden sun, navy shadows), gentle haze, fine film grain. The feeling: the day is about to begin, and it will run smoothly. Hopeful, grounded, not corporate. No readable text.

---

## When you have the clips

1. Save them as `assets/video/scene-01-hero.mp4`, `scene-02-builder.mp4`, `scene-03-campus.mp4` (H.264 MP4, 1080p).
2. Optional — make the web variants (poster, WebM, mobile) with:
   `node tools/generate-videos.mjs --skip-gen`
   (uses ffmpeg; the site works with just the `.mp4` files.)
3. Reload the site. Each section detects its video and fades it in behind the existing visuals automatically — nothing else to change.
