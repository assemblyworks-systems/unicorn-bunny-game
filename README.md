# Playbox 🦄🦕

A free, offline-capable web app for young children — arcade games plus letter/number learning games. Built as plain HTML/CSS/JS (no build step), hosted on GitHub Pages, installable as an app (PWA).

Access is gated by a **profile name**: the app asks "Who's playing today?" and only opens for an approved name (it then titles itself "*\<Name\>'s Playbox*"). A **Change Profile** button on each home screen switches players. Note this is a friendly soft gate on a public site, not a security feature.

**Play:** https://assemblyworks-systems.github.io/unicorn-bunny-game/
**Learning games:** https://assemblyworks-systems.github.io/unicorn-bunny-game/learn.html

## What's inside

- **`index.html`** — arcade games (home page): Match It, Pop Balloons, Feed Bunny, Catch Stars, Dino Eggs, Dino Dig.
- **`learn.html`** — learning games: Find It, A is for…, Trace It, Count It, Memory, Dot to Dot, Sort It, Shapes, Count Dinos. Covers A–Z (upper & lower) and numbers 1–20, with spoken prompts, a sticker reward board (resets each session), and a friendly mascot.
- **`playbox.css` + `img/`** — the **PlayBox** design system: shared color/type/shape tokens, the rounded "toy-block" look, and the mascots (Boxy, Rex, Hop, Pip) + spot illustrations.
- **`ASSETS.md`** — wishlist of additional illustrations to add (e.g. a full dinosaur herd), with the brand style spec.
- **`voice/`** — ~289 pre-recorded voice clips (natural neural voice) that the games play for spoken prompts.
- **`generate_voice.py`** — script that generates the voice clips.
- **`sw.js`, `manifest.webmanifest`, `icon*.png`** — PWA support (installable, fullscreen, offline).

## Install on a device (iPad / phone / tablet)

- **iPad/iPhone:** open the link in **Safari** → Share button → **Add to Home Screen**.
- **Android:** open in Chrome → menu → **Install app / Add to Home Screen**.

It then runs as its own fullscreen app and auto-updates when the site changes.

## Editing & deploying

Edit `index.html` / `learn.html` directly (single files, no build). Commit and push to `main`; GitHub Pages redeploys automatically in ~1 minute.

## Changing the spoken voice

The voice is **pre-recorded audio clips** (not live text-to-speech, which is unreliable on iPad). If you change any spoken phrase, regenerate the clips:

```
pip install edge-tts
cd C:\Repo\unicorn-bunny-game
python generate_voice.py        # default voice: en-US-JennyNeural (child voice: en-US-AnaNeural)
```

It only creates new/missing clips. Commit the resulting `voice/*.mp3` files.

## For maintainers / AI assistants

See **`CLAUDE.md`** for full architecture notes, iPad-specific gotchas, the voice-clip system, and how to make common changes. Read it before editing.
