# Avalynn’s Playbox

A personal playroom for Avalynn: **24 activities**, gentle stories, early learning, drawing and a little world of friendly characters. Designed for iPad, with responsive phone and desktop layouts. No accounts, payments, tracking or offline-download feature.

## Play locally

Requires Node.js 20 or newer. No build step or runtime dependencies.

```sh
npm start
```

Open http://127.0.0.1:4173. The app opens directly into Avalynn’s playroom. An existing saved profile is respected; Change Profile lets the family edit the displayed name. This personalisation is not an access-control system.

## iPad app layout

The home screen is a fixed, full-screen toy shelf, with eight tiles per landscape page or nine per portrait page on iPad. Swipe sideways or use the large arrows. A fixed Play / Learn dock stays within thumb reach. There are no landing-page banners, promotional descriptions or scrolling site footer. Name editing is in the grown-up area.

## What changed in version 2

- Illustrated Play and Learn libraries, category filters, favourite activities, responsive cards and a featured story.
- **Hello, Neighbour!** — a new original house-visiting adventure: knock and meet Hop, Pip and Rex; count carrots, match window shapes and share apples; collect three friendship stamps and finish at a picnic.
- Shared settings, HTML5 narration and activity lifetime management. Leaving a game cancels its delayed actions and voice callbacks.
- Single-pointer drag handling, cancellation cleanup and tap-to-add in Pull the Radish.
- A grown-up space with sound, gentler motion and an optional break reminder. Settings and favourites stay on this device; rewards remain session-only.
- Drawing undo, labelled tools, visible Find It instructions, keyboard activation for legacy buttons and zoom support.
- Local system fonts: no third-party font requests. The original small service worker is retained for existing home-screen installations, with validated cache responses; there is no offline pack or offline-readiness promise.

## Project map

| File | Responsibility |
| --- | --- |
| `index.html` | Thirteen arcade, creative and story activities; legacy game engines |
| `learn.html` | Eleven learning activities; session-only sticker rewards |
| `app-core.js` | Preferences, profile validation, cancellable game timers, shared narration |
| `catalog.js` | Activity names, categories, descriptions and artwork |
| `app-shell.js` / `app-shell.css` | Personal playroom, discovery, favourites, parent controls, responsive layout |
| `houses.js` | Original Hello, Neighbour! story state and interactions |
| `playbox.css` / `img/` | Existing design tokens and artwork; new neighbourhood SVG |
| `voice/` / `voice-lines.json` | Recorded prompts and the new-line narration allowlist |
| `generate_voice.py` | Voice generation; existing clips are preserved; new files are written atomically |
| `tests/` | Automated logic and browser regression checks |
| `DESIGN-REVIEW.md` | Design/build audit, delivered changes and remaining device checks |

## Validation

```sh
npm test
npm install
npx playwright install chromium webkit
# In a separate terminal: npm start
npm run test:browser
```

For WebKit, set `BROWSER_ENGINE=webkit`. For installed Edge, set `BROWSER_CHANNEL=msedge`. Browser checks exercise all 24 game launches, the complete new story, favourites, parent settings, navigation cancellation and three viewport sizes. Screenshots are written to ignored `artifacts/`.

WebKit automation is a useful Safari-engine check; it does not replace checking sound, touch and rotation on Avalynn’s actual iPad.

## Narration

```sh
pip install edge-tts
python generate_voice.py --new-lines-only
```

`--new-lines-only` sends only text from `voice-lines.json` to the configured voice service. This allowlist contains generic game text and fictional hosts’ names, with no children’s names. Existing personalised recordings are reused. The full generator also contains the original personalised phrase catalogue; do not generate missing personalised lines without permission to send that text to the service.

Keep every spoken line paired with a real recording: speech synthesis is unreliable on the target iPad. Keep the existing HTML5 audio pool, first-pointer handling and inexpensive pointermove code.

## Sharing changes

The existing GitHub remote is https://github.com/assemblyworks-systems/unicorn-bunny-game. GitHub Pages is configured by the existing repository workflow to serve main. Local edits do not change the live app until committed and pushed. This upgrade does not add a backend or change hosting.

Hello, Neighbour! takes the broad idea of welcoming friends into different homes as inspiration from *Come Over to My House*. Its story text, game sequence and new house illustration are original; it does not reproduce the book’s text, characters or illustrations.
