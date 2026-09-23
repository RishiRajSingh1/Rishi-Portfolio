#!/usr/bin/env node
/**
 * Generate the three cinematic scenes with Gemini (Veo 3.1) using the identity
 * reference image, then post-process with ffmpeg into web-ready variants.
 *
 *   export GEMINI_API_KEY="..."      # never committed
 *   node tools/generate-videos.mjs [--only scene-01-hero] [--skip-gen] [--model veo-3.1-generate-preview]
 *
 * Outputs (assets/video/):
 *   <id>.mp4  <id>.webm  <id>-mobile.mp4  <id>-poster.jpg  <id>-raw.mp4
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'video');
const REF = path.join(ROOT, 'Media', 'rishi-reference.png');
const API = 'https://generativelanguage.googleapis.com/v1beta';

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const ONLY = flag('--only');
const MODEL = flag('--model') || 'veo-3.1-generate-preview';
const SKIP_GEN = args.includes('--skip-gen');
const KEY = process.env.GEMINI_API_KEY;

const log = (...m) => console.log(new Date().toISOString().slice(11, 19), ...m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ffmpegBin() {
  for (const bin of [process.env.FFMPEG_BIN, 'ffmpeg']) {
    if (!bin) continue;
    if (spawnSync(bin, ['-version'], { stdio: 'ignore' }).status === 0) return bin;
  }
  // imageio-ffmpeg (pip) ships a static binary
  const r = spawnSync('python3', ['-c', 'import imageio_ffmpeg,sys;sys.stdout.write(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  return null;
}

async function generate(scene, cfg) {
  const ref = await fs.readFile(REF);
  const body = {
    instances: [{
      prompt: `${cfg.identityLock} ${scene.prompt}`,
      referenceImages: [{ image: { bytesBase64Encoded: ref.toString('base64'), mimeType: 'image/png' }, referenceType: 'asset' }],
    }],
    parameters: {
      aspectRatio: '16:9',
      resolution: '1080p',
      durationSeconds: 8,
      negativePrompt: cfg.negativePrompt,
      personGeneration: 'allow_adult',
    },
  };
  const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': KEY };

  log(`▶ ${scene.id}: submitting to ${MODEL}`);
  let res = await fetch(`${API}/models/${MODEL}:predictLongRunning`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`submit ${res.status}: ${await res.text()}`);
  const op = await res.json();

  // Poll
  let done = op.done, result = op;
  while (!done) {
    await sleep(10000);
    res = await fetch(`${API}/${op.name}`, { headers });
    if (!res.ok) throw new Error(`poll ${res.status}: ${await res.text()}`);
    result = await res.json();
    done = result.done;
    log(`  … ${scene.id} ${done ? 'done' : 'rendering'}`);
  }
  if (result.error) throw new Error(`generation failed: ${JSON.stringify(result.error)}`);

  const sample = result.response?.generateVideoResponse?.generatedSamples?.[0]
    ?? result.response?.generatedVideos?.[0];
  const uri = sample?.video?.uri;
  if (!uri) throw new Error(`no video uri in response: ${JSON.stringify(result).slice(0, 600)}`);

  const raw = path.join(OUT, `${scene.id}-raw.mp4`);
  const dl = await fetch(uri, { headers: { 'x-goog-api-key': KEY } });
  if (!dl.ok) throw new Error(`download ${dl.status}`);
  await fs.writeFile(raw, Buffer.from(await dl.arrayBuffer()));
  log(`  ✓ saved ${path.relative(ROOT, raw)}`);
  return raw;
}

function post(ff, id, raw) {
  const run = (a) => { const r = spawnSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', ...a], { stdio: 'inherit' }); if (r.status !== 0) throw new Error(`ffmpeg failed: ${a.join(' ')}`); };
  const o = (s) => path.join(OUT, `${id}${s}`);
  log(`  ⚙ post-processing ${id}`);
  run(['-i', raw, '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-g', '12', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2', o('.mp4')]);
  run(['-i', raw, '-c:v', 'libvpx-vp9', '-crf', '33', '-b:v', '0', '-g', '12', '-an', '-row-mt', '1', '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2', o('.webm')]);
  run(['-i', raw, '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-g', '12', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', '-vf', 'scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2', o('-mobile.mp4')]);
  run(['-i', raw, '-vf', 'select=eq(n\\,12),scale=1920:1080:force_original_aspect_ratio=decrease', '-frames:v', '1', '-q:v', '3', o('-poster.jpg')]);
  log(`  ✓ ${id}.mp4 / .webm / -mobile.mp4 / -poster.jpg`);
}

(async () => {
  const cfg = JSON.parse(await fs.readFile(path.join(ROOT, 'tools', 'scenes.json'), 'utf8'));
  await fs.mkdir(OUT, { recursive: true });
  const ff = ffmpegBin();
  if (!ff) log('⚠ ffmpeg not found — raw clips will be copied as .mp4 without webm/mobile variants (pip install imageio-ffmpeg to fix)');

  if (!SKIP_GEN && !KEY) { console.error('GEMINI_API_KEY is not set. export GEMINI_API_KEY="..." and re-run.'); process.exit(1); }
  await fs.access(REF).catch(() => { console.error(`Reference image missing: ${REF}`); process.exit(1); });

  const scenes = cfg.scenes.filter((s) => !ONLY || s.id === ONLY);
  const failures = [];
  for (const scene of scenes) {
    const raw = path.join(OUT, `${scene.id}-raw.mp4`);
    try {
      if (!SKIP_GEN) await generate(scene, cfg);
      await fs.access(raw);
      if (ff) post(ff, scene.id, raw);
      else await fs.copyFile(raw, path.join(OUT, `${scene.id}.mp4`));
    } catch (e) {
      failures.push(scene.id);
      console.error(`✗ ${scene.id}: ${e.message}`);
    }
  }
  log(failures.length ? `finished with failures: ${failures.join(', ')}` : 'all scenes complete');
  process.exit(failures.length ? 2 : 0);
})();
