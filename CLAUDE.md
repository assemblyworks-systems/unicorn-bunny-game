# CLAUDE.md — Avalynn's Unicorn & Bunny Games

Project context and maintenance guide for Claude Code. Read this fully before editing.

## What this is

A free, kid-friendly web app ("**Playbox**") for young children — two parts. Access is gated by a **profile name** (see "Profile gate" below); once entered, the app titles itself "**<Name>'s Playbox**" and the arcade speaks that child's name.

- **`index.html`** — arcade mini-games (home page, `/`): Match It, Pop Balloons, Feed Bunny, Catch Stars, **Dino Eggs**, **Dino Dig**.
- **`learn.html`** — learning games: Find It, A is for…, Trace It, Count It, Memory, Dot to Dot, Sort It, Shapes, **Count Dinos**. Dot to Dot also includes a **dinosaur** shape.

The two pages cross-link (buttons on each home screen). Everything is **plain HTML/CSS/JS in single files** (no build step, no framework, no bundler). It's hosted on **GitHub Pages** and installed on devices as a **PWA** (Add to Home Screen).

### Profile gate (added 2026-06)

A full-screen gate (`#gate` in both files) blocks the app until a name is entered that **starts with** an allowed first name (case-insensitive). Allowed names live in `const ALLOWED=['Avalynn','Raynice']` in **both** HTML files.

- Match rule: trim → lowercase → accept if `indexOf(name)===0` (prefix). So "avalynn loo" ✓, "jacky avalynn" ✗. Rejection shows **"Profile not authorised."**
- On success it stores `{full, first}` in `localStorage` key **`playbox_profile_v1`** (shared by both pages, so crossing the cross-links doesn't re-prompt). `full` = title-cased entered name (on-screen title); `first` = the canonical allowed name (drives which voice clip plays).
- **"👤 Change Profile"** button on each home screen clears the key, resets stars, reshows the gate.
- ⚠️ **This is a *soft* gate, not real security.** It's a static public site — anyone can view source / fetch the HTML directly and bypass it. Fine for keeping casual passers-by out; do **not** put genuinely sensitive personal info behind it without a real backend/auth.
- **Adding another allowed child:** add the first name to `ALLOWED` in *both* HTML files **and** to `NAMES` in `generate_voice.py`, then regenerate voice (so the arcade name lines exist for them).

- **Live:** https://assemblyworks-systems.github.io/unicorn-bunny-game/
- **Learning app:** https://assemblyworks-systems.github.io/unicorn-bunny-game/learn.html
- **Repo:** https://github.com/assemblyworks-systems/unicorn-bunny-game (cloned locally at `C:\Repo\unicorn-bunny-game`)

## Visual design — PlayBox design system (rebranded 2026-06)

The app uses the **PlayBox** design system (from the `playbox-design` skill). Look = "soft toys
made of light": flat **cream** canvas (`--surface-app`, no gradients), big pillowy radii,
rounded display font **Baloo 2** (titles/buttons) + **Nunito** (body), and the signature
**"toy lip"** press — a solid `-deep` colored bottom edge (`box-shadow:0 var(--chunk-depth) 0
…`) that collapses to `--chunk-depth-press` on `:active`.

- **Tokens** live in `playbox.css` (linked in both `<head>`s). **Never hardcode hex** — use
  `--color-*` / semantic aliases (`--surface-app`, `--text-body`, etc.). Fonts load via a
  Google Fonts `<link>` (system fallback offline).
- **Tones.** Add a `t-<tone>` class (coral/sky/grass/grape/sunshine/tangerine/teal/bubblegum)
  to set `--tone`/`--tone-deep`/`--tone-on` for any toy-lip element. `--tone-on` is the label
  color (white for saturated tones, **ink for sunshine** — yellow needs dark text).
- **Art.** Mascots & spots are SVG in `img/`. Heroes/buddy use Boxy + Rex; Feed Bunny pet is
  Hop; Pop Balloons uses the derived `balloon-<color>.svg`; Catch Stars uses `spot-star`.
- **Dinosaurs.** `const DINOS` in `index.html` (filenames *with extension*, e.g.
  `'dino-triceratops.png'`, `'rex-dino.svg'`) drives Dino Eggs (hatch) + Dino Dig (reveal;
  dig also mixes in `FOSSILS`). **Drop a new file in `img/` and add its filename to `DINOS`**
  → it auto-appears. Match It `FRIENDS`, Count It `OBJ`, `DINO_OBJ` are likewise filename
  arrays rendered via the `imgOf()` helper; "A is for…" maps letters via `abcFile()`.
  Spec for any new art is in `ASSETS.md`.
- Scene backgrounds (`SCENES`) are flat `--color-*-soft` washes, not gradients.
- ⚠️ Keep the iPad audio/touch rules below — the rebrand changed *looks only*, not the audio,
  voice, or pointer handling.

## Primary target device: iPad

The main device is an **iPad** (Avalynn's). Most hard-won lessons below are iPad/Safari quirks. **Always reason about iPad Safari first.** Desktop "works" is not sufficient proof.

## File map

| File | Purpose |
|---|---|
| `index.html` | Arcade games (home page). HTML/CSS/JS; links `playbox.css`. |
| `learn.html` | Learning games. HTML/CSS/JS; links `playbox.css`. |
| `playbox.css` | **Shared design tokens** (PlayBox colors/type/spacing/effects) + tone helpers. Linked by both pages. |
| `img/*` | **Brand art** — mascot/spot **SVGs** (Boxy, Rex, Hop, Pip, derived `balloon-<color>`) + the generated **PNG** set (dino herd, fossils, eggs, friends, carrot/rock/bomb, count-*, abc-*). |
| `ASSETS.md` | **Art wishlist** — additional illustrations to add (dino herd, etc.) with style spec. |
| `manifest.webmanifest` | PWA manifest (name, icons, `display:fullscreen`, `start_url:"./"`). |
| `sw.js` | Service worker — **network-first** (always fetch latest, cache as offline fallback). |
| `icon.png` (512), `icon-192.png` | App icons (drawn rainbow+star). |
| `voice/*.mp3` | **Pre-recorded spoken clips** (~289). Generated by `generate_voice.py`. |
| `generate_voice.py` | Dev tool that generates the `voice/` clips via `edge-tts`. Not served. |
| `README.md` | Human-facing readme. |

## Deploy workflow

GitHub Pages serves the `main` branch automatically. After any push to `main`, the live site rebuilds in ~1 minute and the service worker picks up changes on next load.

- The owner (Jon) commits via **GitHub Desktop**. Claude Code can use `git` directly (`git add … && git commit && git push`), but keep commits atomic and never commit secrets/large files.
- To test a change, hard-refresh the live URL (mobile Safari caches hard — pull-to-refresh, or close/reopen the installed app). Appending a `?v=N` query string bypasses browser cache when testing.

## ⚠️ CRITICAL lessons (do not relearn these the hard way)

### 1. Audio MUST be HTML5 `<audio>`, never Web Audio API
The iPad's hardware mute/silent setting **silences the Web Audio API entirely** (and `speechSynthesis`), while HTML5 `<audio>`/media plays fine (same channel as YouTube). The whole app therefore uses HTML5 `<audio>`:
- **Sound effects** are short WAV tones generated at runtime as base64 data-URIs (`makeWav()` → `SND` object → `playSnd()`).
- **Voice** is pre-recorded `.mp3` files played via `<audio>`.
- **Do NOT reintroduce `AudioContext`/oscillators for anything audible.** `initAudio()` is intentionally a no-op stub.

### 2. The spoken voice is pre-recorded clips, NOT live text-to-speech
`speechSynthesis` is **broken at the OS level on the target iPad** (it accepts a `speak()` call but silently never plays — `speaking` stays false, no events). So:
- `speak(text)` (learn.html) / `say(text)` (index.html) compute `slugify(text)` and play `voice/<slug>.mp3`. If the clip 404s, they **fall back** to `ttsSpeak`/`ttsSay` (real speech) — which works on desktop but is silent on the broken iPad. So **every spoken phrase must have a matching clip**.
- **`slugify()` in JS and `slug()` in `generate_voice.py` MUST stay identical**: lowercase → replace runs of non-`[a-z0-9]` with `_` → trim leading/trailing `_`. If you change one, change the other.
- **Arcade name lines are per-profile.** `index.html` says the active child's first name (e.g. `say('Pop the balloons, '+NAME+'!')`). `generate_voice.py` loops `NAMES=['Avalynn','Raynice']` to make a clip per name. Any new name-bearing arcade line, or any new allowed profile, needs clips for every name (add to `NAMES`, regenerate). `learn.html` never speaks the name.

### 3. If you add or change ANY spoken phrase → regenerate clips
1. Add the exact phrase string to the appropriate section in `generate_voice.py` (it mirrors every `speak()`/`say()` call).
2. Run it (see "Regenerating voice" below). It skips existing clips and makes only new ones.
3. Commit the new `voice/*.mp3` files.
   Forgetting this = that phrase is silent on the iPad (falls back to broken TTS).

### 4. Touch / palm handling
- Tracing locks onto the **first** pointer (`traceActive`) and ignores additional touches, so a resting palm doesn't scramble input.
- **Do NOT reject touches by contact size** (`event.width/height`). An earlier version did, and it rejected a child's normal fingertip on the iPad (reported large contact area), making the whole app unresponsive. Buttons use a plain `onTap` (pointerdown + preventDefault), no size filtering.

### 5. Reuse audio elements (prevents lag)
Creating `new Audio()` for every sound/word accumulates and makes the app laggy over a session (iPad especially). SFX use a small reused **pool** (`_sfxPool`, 6 elements cycled); voice uses a **single reused element** (`_voiceEl`). Keep this pattern — don't go back to `new Audio()` per call.

### 6. Caching
`index.html`/`learn.html` have `Cache-Control: no-store` meta tags, and `sw.js` is network-first. This was added after repeated "stale version" pain on iPad (clearing *history* ≠ clearing *cache*; the home-screen icon also kept its own copy). When testing, assume the device may still hold an old copy — hard-refresh / re-add the icon.

### 7. Mobile audio unlock
On first `pointerdown`, `ensureAudio()` plays a tiny click and primes things, satisfying the browser's "audio needs a user gesture" rule so later sounds work.

### 8. Never do expensive work on every `pointermove` (the lag trap)
`pointermove` fires 60–120×/sec on iPad. Anything heavy there = lag. Concretely, in the
games:
- **No sound per move.** A `playSnd()`/`blip()` on each move floods the audio pool and
  stutters. Trace/Dig throttle any move-sound to ~9/sec (or drop it — tracing has no
  move-beep now). Sound belongs on discrete taps/answers.
- **No `getBoundingClientRect()` per move.** It forces a layout read after style writes
  (reflow). Cache the rect once at `pointerdown` (trace, dig, Sort It all do this).
- **No full-canvas `getImageData()` per move.** Reading a ~3MB canvas back from the GPU
  stalls the pipeline. Trace/Dig completion checks `drawImage` the canvas down to a tiny
  buffer (GRID×GRID / 40×40) and read *that* (~2–6KB). Keep this pattern.
- **Don't `transition` a property you rewrite every frame.** `.critter` dropped its
  `transition:transform` because the drift/fall loops set `transform` each frame, which
  restarted the transition every frame (constant style recalc).

## Key mechanics by feature

- **Answer/round pacing:** `speak(text, onDone)` (learn.html) calls `onDone` when the clip finishes (with a 7s safety). Correct-answer handlers advance to the next round via that callback so the praise clip is never cut off.
- **Trace completion:** measured by **painted pixel coverage** of the glyph (`evalPixels()` reads the canvas, samples glyph-mask cell centers, completes at ~60% inked). Don't revert to counting fingertip cells (it under-counted; kids had to over-colour).
- **Stickers / stars (learn.html):** **session-only — NOT persisted.** `store={count:0,board:[]}` lives in memory; it resets on reload and on profile change (and the old `avalynn_stickers_v1` localStorage key is proactively removed). This was a deliberate requirement (stars shouldn't carry across sessions or between profiles). Don't reintroduce `localStorage` persistence here.
- **Scores (arcade)** floor at 0 and are in-memory per game (reset on `openMode`). Catch Stars deducts for tapping rocks or letting a star fall.
- **Dino games:** *Dino Eggs* (index.html) reuses the floating-critter tap-to-pop pattern (egg → baby dino). *Dino Dig* (index.html) is a scratch-to-reveal canvas — single-pointer (palm-proof like trace), erases dirt with `destination-out`, completes at ~50% cleared. *Count Dinos* (learn.html) is `countRound(DINO_OBJ)` — same engine as Count It with a dino emoji pool. *Dino dot-to-dot* is just an extra entry in `DOTSHAPES`. Eggs/Dig **speak the species name** (`dinoName()` derives it from the filename, `DINO_NAMES` overrides the odd ones) — ⚠️ a new dino file needs its name added to `DINO_SPOKEN` in `generate_voice.py` + clips regenerated, or that line is silent on iPad.

### Learning scaffolds (added 2026-07 — tuned for age 3, don't remove)

- **Adaptive difficulty (Count It / Count Dinos):** `countMax` starts at 5 (counts 1–5), +2 after every 3 correct in a row (max 20), −2 after a round with 2+ wrong answers (min 5). Session-only, shared by both count games. Answer distractors stay within `1..max(5,countMax)`.
- **Tap-to-count:** each Count It object is tappable once — it gets a numbered badge (`.cnum`) and speaks the running count (clips `1`–`20` exist). One-to-one correspondence practice; doesn't answer the round.
- **Hint pulse:** in Find It / A is for / Count It / Shapes, after **2 wrong taps** the correct choice gets `.hint` (pulsing sunshine glow) so a child is never stuck.
- **Teaching wrong-answers (Find It):** a wrong tap speaks `'That is the '+nameOf(o)` (clips exist for all 26 letters + numbers 1–20) instead of a bare "try again".
- **Idle re-prompt (learn.html):** `armIdle(sayIt)` per round repeats the instruction after 15s of no taps, max 2 nudges; any `pointerdown` resets the timer; `stopIdle()` runs on `openMode`/`goHome`.
- **Balloon color challenge (index.html):** after every 5 free pops, `setBalloonChallenge()` picks a color **currently on screen**, shows a `match-banner` + speaks `'Can you pop the <color> balloon?'`; the right color earns +2 and clears it; wrong colors still pop normally (no punishment). `spawnBalloon()` force-spawns the challenge color if it leaves the screen.
- **Feed Bunny counting:** the first 10 carrots speak the running count (`say(String(score))`), then revert to yum lines.

## Regenerating voice clips

Requires a machine with normal internet (the clip service is not reachable from sandboxes).

```
pip install edge-tts
cd C:\Repo\unicorn-bunny-game        # run from the repo (short path) to avoid Windows MAX_PATH errors
python generate_voice.py
```

- Voice is set by `VOICE` at the top of `generate_voice.py` (default `en-US-JennyNeural`; `en-US-AnaNeural` is a child voice).
- It skips clips that already exist, so re-run freely; it rate-limit-retries and paces itself.
- **Windows MAX_PATH gotcha:** generate from a short path (the repo root is fine). Generating inside a deep folder caused the longest filename (`connect_the_dots_to_make_a_triangle_…`) to fail with "No such file or directory".

## How to make common changes

- **Add a new spoken line:** write the `speak()/say()` call, add the identical string to `generate_voice.py`, regenerate, commit the new mp3(s).
- **Add a new learning game:** add a menu button in `learn.html`'s `#menu`, a `case`/branch in `openMode()`, and a `startX()`/round function following the existing pattern (use `onTap`, `win()`, `speak()`, `boop()`; respect `roundLock`; clear timers via `trackT`/`clearPending`).
- **Change a voice:** edit `VOICE` in `generate_voice.py`, delete `voice/` (or change clips), regenerate, commit.

## Testing checklist (before pushing)

1. JS sanity: extract the `<script>` and `node --check` it (no build system, so this is the only lint).
2. On the **live site after push**, open DevTools console — should be error-free.
3. Smoke-test on iPad specifically: sounds play, voice plays, tracing completes, no lag after a few minutes, app installs/updates.

## Things that DON'T work (don't retry)

- Web Audio API for audible sound on iPad (muted by silent switch).
- `speechSynthesis` for the voice on the target iPad (OS-level broken).
- Rejecting touches by contact size (rejects real child taps).
- Assuming a normal refresh clears the iPad's cached version (it often doesn't).
- A native rebuild "to fix the voice" — a native app uses the same broken Apple speech engine; pre-recorded clips are the fix regardless of platform.
