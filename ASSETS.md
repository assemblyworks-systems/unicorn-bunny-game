# Playbox — Art Asset Wishlist

> **Status (2026-06):** Tiers 1–4 below have been generated and **integrated** — 56 PNGs
> are in `img/` and wired into Dino Eggs/Dig, Match It, Feed Bunny, Catch Stars, Count It,
> Count Dinos, and "A is for…". This file remains the style spec for any future additions
> (drop a new file in `img/` and add it to the relevant array — e.g. `DINOS` in index.html).


This is the running list of illustration assets to add to the app, in the **PlayBox**
brand style. The app already ships the design-system originals (`img/rex-dino.svg`,
`mascot-boxy.svg`, `hop-bunny.svg`, `pip-pig.svg`, `spot-star/cloud/rainbow/balloon`,
plus 7 derived `balloon-<color>.svg`). Everything below is *additional* art.

## Format & style (read first)

The existing art is **hand-authored flat SVG** — geometric, thick rounded outlines, dot
eyes, cheek-blush dots, smiling, no gradients/grain. New assets should match that look.

**Two ways to produce these — pick one:**
- **SVG (recommended).** Authored in the same flat-vector style as the existing files.
  Tiny, infinitely scalable, transparent by nature, pixel-crisp on any iPad. This is what
  the skill itself uses. Claude can author these directly in-repo (no image-gen round-trip).
- **PNG (if generated via the claude.ai image tool).** Request **1024×1024, transparent
  background**. Works (the app renders everything via `<img>`), but won't be as crisp or
  perfectly on-style as SVG. Heavier to cache for the PWA.

**Style spec to paste into any generator / give to the SVG author:**
> Children's storybook illustration, cute friendly cartoon for ages 3–5. Geometric, soft
> rounded shapes, thick smooth outlines, flat cel-shading (no gradients, no grain). Big
> dot eyes, small cheek-blush dots, gentle smile — adorable, never scary. Single subject,
> centered, full body, slight 3/4 angle, fills ~80% of a square frame. Fully transparent
> background. Match the PlayBox palette below.

**Palette (PlayBox play colors):** sunshine `#FFC93C`, coral `#FF6B6B`, grass `#5FC97B`,
sky `#45ADE8`, grape `#9B5DE5`, tangerine `#FF924C`, teal `#2FC2B2`, bubblegum `#FF8FB1`.
Outlines/eyes use ink-brown `#43352F`; cheeks use bubblegum at ~60% opacity.

**Wiring:** drop files in `img/`. For dinosaurs, just add the filename (no extension) to the
`DINOS` array in `index.html` — Dino Dig, Dino Eggs, and (future) art automatically pick
from the full set, ending the repetition. Other sets get wired per-game on request.

---

## Tier 1 — Dinosaur herd  ⭐ highest priority (fixes the repetitive Dino Dig/Eggs)

A variety of cute dinos so the dig/hatch never repeats. Rex (teal) already exists.

| Filename | Subject | Suggested color |
|---|---|---|
| `img/dino-triceratops.svg` | baby Triceratops, 3 rounded horns + neck frill | sky blue |
| `img/dino-stegosaurus.svg` | baby Stegosaurus, row of back plates, short spiky tail | grape |
| `img/dino-brontosaurus.svg` | baby long-neck, small head, gentle smile | sunshine |
| `img/dino-pterodactyl.svg` | baby Pteranodon, open wings, head crest | tangerine |
| `img/dino-velociraptor.svg` | small perky raptor, big eyes, little claws (friendly) | grass |
| `img/dino-ankylosaurus.svg` | armored body, bumpy plates, round club tail | teal |
| `img/dino-parasaurolophus.svg` | long curved head crest | bubblegum |
| `img/dino-spinosaurus.svg` | rounded back sail, long friendly snout | coral |
| `img/dino-hatchling.svg` | tiny newborn, oversized eyes, bit of eggshell on head | pastel grass |

**Eggs (Dino Eggs):**
| Filename | Subject |
|---|---|
| `img/egg-spotted.svg` | cream egg, pastel sky-blue spots, glossy |
| `img/egg-cracking.svg` | cream egg, jagged crack on top, soft glow peeking out (no dino visible) |

**Optional fossils (lovely for the Dino Dig "discovery"):** full-body **skeletons**, sandy
bone-beige — `img/fossil-trex.svg`, `fossil-triceratops.svg`, `fossil-stegosaurus.svg`.
(Note: whole skeletons, *not* a single bone.)

---

## Tier 2 — Arcade & Feed Bunny props

| Filename | Subject | Used in |
|---|---|---|
| `img/carrot.svg` | cute carrot with leafy top | Feed Bunny (the food) |
| `img/rock.svg` | smiling grey boulder | Catch Stars ("don't tap") |
| `img/bomb.svg` | round cartoon bomb, friendly (not menacing) | Catch Stars ("don't tap") |
| `img/friend-cat.svg` | cute cat face/body | Match It |
| `img/friend-dog.svg` | cute puppy | Match It |
| `img/friend-butterfly.svg` | butterfly | Match It |
| `img/friend-flower.svg` | smiling flower | Match It |
| `img/friend-chick.svg` | baby chick | Match It |
| `img/friend-turtle.svg` | turtle | Match It |
| `img/friend-fox.svg` | fox | Match It |

(Match It can also reuse the mascots Rex/Hop/Pip + spot-star as "friends".)

---

## Tier 3 — Count It / Sort It objects (learning)

Cute countables for Count It (currently emoji). ~6 is plenty; the game picks one per round.

`img/count-strawberry.svg`, `count-apple.svg`, `count-fish.svg`, `count-flower.svg`,
`count-cherry.svg`, `count-ladybug.svg`. (Balloon + star already available.)

---

## Tier 4 — "A is for…" picture set (26)  — biggest, do last / optional

One object per letter for the "A is for…" game (currently emoji). High learning value but
26 images. Pig→reuse Pip, Rainbow→reuse spot-rainbow, Fish→reuse count-fish if made.

apple, banana, cat, dog, elephant, fish, grapes, hat, ice-cream, juice, kite, lion, moon,
nose, orange, pig, queen, rainbow, sun, turtle, umbrella, violin, watermelon, (fox for X),
yo-yo, zebra → `img/abc-apple.svg` … `abc-zebra.svg`.

---

## Tier 5 — App icon  ✅ DONE (2026-07)

`icon.png` (512) + `icon-192.png` are now Boxy centered on a solid **grape** `#9B5DE5` tile
(grape chosen because Boxy's own sunshine ear / sky ear / coral body would blend into those
background colors). Rendered from `img/mascot-boxy.svg` via `resvg-py` + Pillow quantize —
same filenames as before, so `manifest.webmanifest` and the `apple-touch-icon` links needed
no changes. ⚠️ iPads that already have the app installed keep the old icon until the child's
icon is removed and re-added to the home screen.

## Not needed as art (stay as-is)
- Letters & numbers (Find It, Trace It, Memory) — must remain real text glyphs.
- Shapes & Colors game — simple geometric shapes / color swatches read clearer than illustrations.
- Dot-to-Dot — shapes are drawn from point arrays (including the dinosaur).
- Reward stickers — can reuse the mascots + spots + any Tier-2/3 creatures.
