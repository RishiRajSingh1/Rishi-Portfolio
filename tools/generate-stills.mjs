#!/usr/bin/env node
/**
 * Generate cinematic stills of the three scenes (plus extras) with Gemini image
 * models, using Media/rishi-reference.png as the identity reference.
 *
 *   export GEMINI_API_KEY="..."
 *   node tools/generate-stills.mjs [--only <id>] [--model gemini-2.5-flash-image]
 *
 * Output: assets/img/scenes/<id>.png
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'img', 'scenes');
const REF = path.join(ROOT, 'Media', 'rishi-reference.png');
const API = 'https://generativelanguage.googleapis.com/v1beta';
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const ONLY = flag('--only');
const MODELS = (flag('--model') || 'gemini-2.5-flash-image,gemini-3.1-flash-image,gemini-3-pro-image').split(',');
const KEY = process.env.GEMINI_API_KEY;
const log = (...m) => console.log(new Date().toISOString().slice(11, 19), ...m);

async function gen(scene, cfg, ref) {
  const prompt = `${cfg.identityLock} ${scene.prompt}\n\nRender this as a single ultra-high-quality cinematic film still, 16:9 widescreen, photorealistic, 35mm film look with subtle grain. Avoid: ${cfg.negativePrompt}.`;
  let lastErr;
  for (const model of MODELS) {
    const body = {
      contents: [{ parts: [
        { inlineData: { mimeType: 'image/png', data: ref } },
        { text: prompt },
      ] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
    };
    const res = await fetch(`${API}/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify(body),
    });
    const txt = await res.text();
    if (!res.ok) { lastErr = `${model} ${res.status}: ${txt.slice(0, 300)}`; log(`  ✗ ${lastErr}`); continue; }
    const json = JSON.parse(txt);
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) { lastErr = `${model}: no image in response ${txt.slice(0, 300)}`; log(`  ✗ ${lastErr}`); continue; }
    const ext = part.inlineData.mimeType.includes('jpeg') ? 'jpg' : 'png';
    const file = path.join(OUT, `${scene.id}.${ext}`);
    await fs.writeFile(file, Buffer.from(part.inlineData.data, 'base64'));
    log(`  ✓ ${model} → ${path.relative(ROOT, file)}`);
    return file;
  }
  throw new Error(lastErr);
}

(async () => {
  if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }
  const cfg = JSON.parse(await fs.readFile(path.join(ROOT, 'tools', 'scenes.json'), 'utf8'));
  const extras = JSON.parse(await fs.readFile(path.join(ROOT, 'tools', 'stills-extra.json'), 'utf8').catch(() => '[]'));
  const scenes = [...cfg.scenes, ...extras].filter((s) => !ONLY || s.id === ONLY);
  await fs.mkdir(OUT, { recursive: true });
  const ref = (await fs.readFile(REF)).toString('base64');
  const failed = [];
  for (const s of scenes) {
    log(`▶ ${s.id}`);
    try { await gen(s, cfg, ref); } catch (e) { failed.push(s.id); console.error(`✗ ${s.id}: ${e.message}`); }
  }
  log(failed.length ? `failed: ${failed.join(', ')}` : 'all stills complete');
  process.exit(failed.length ? 2 : 0);
})();
