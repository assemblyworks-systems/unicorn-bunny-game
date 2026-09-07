# Design and build review — 7 September 2026

## Aim

A more polished personal app for Avalynn. “Commercial quality” describes the care, clarity and finish, not a plan to sell the product. Offline packs, billing, public onboarding, cloud accounts and product analytics are outside the brief.

## Findings and changes

| Area | Gap in the original app | Upgrade |
| --- | --- | --- |
| Discovery | A long, equally weighted grid with no grouping; hard to rediscover a favourite | Illustrated activity library, filters, favourites, clear Play / Learn navigation and a featured story |
| Visual hierarchy | Very large saturated buttons, several overlapping styles, desktop-centric fixed sizing | A consistent warm paper palette, quieter frame, stronger headings, matching cards and responsive phone/tablet layouts |
| Personal experience | Name gate interrupted entry into a private family app | Opens directly into Avalynn’s saved playroom; name remains editable |
| Story play | No house-visiting activity | Original three-home story: greeting, counting, matching, sharing, stamps and a clear ending |
| Audio | Duplicate voice implementations; mute did not consistently stop the current clip | Shared, reused HTML5 voice element; settings apply across both pages; safe cancellation and completion handling |
| Navigation | Untracked praise timers could overwrite a newly opened game | Activity lifetime owns every timeout/interval; clears on exit; stale voice callbacks are ignored; visual debris removed |
| Touch | Shared drag accepted another finger’s release; no cancellation recovery | Locks pointer ID; cleans up on pointercancel or navigation; restores hidden source |
| Radish usability | Tap-to-add was documented but not accepted | A short tap adds a helper as well as a drag |
| Drawing | Accidental clear was irreversible; tools had no accessible names | Four-step undo including clear; labelled crayons, stamps and controls |
| Accessibility | Zoom disabled, pointer-only controls, instructions sometimes only spoken | Zoom restored, focus rings, keyboard bridge, labelled controls, visible Find It prompt; new story supports touch and keyboard |
| Motion | Constant decorative motion with no family preference | System reduced-motion support plus a parent-controlled gentler-motion setting; confetti respects it |
| Parent controls | No shared sound preference or pause reminder | Small grown-up area with local settings and optional stretch reminder |
| Assets | Remote font request; no checks for new voice/art completeness | Local system-font fallbacks; regression checks for all catalog art and new narration |
| Existing cache | HTTP errors could replace good responses; activation removed unrelated caches | Validate responses, scope cache cleanup, serve audio byte ranges correctly; no new offline feature |
| Maintenance | Shared concerns duplicated in two large files; no automated regression suite | Shared core / shell / catalog / new-game modules and repeatable logic + browser checks |

## New game design

**Hello, Neighbour!** is an original activity inspired by the broad themes of different homes and friendship. Source for that thematic description: https://www.penguinrandomhouse.com/books/42977/come-over-to-my-house-by-dr-seuss-illustrated-by-katie-kath/

1. Visit Hop’s garden cottage. Knock to greet the host, then pick three carrots for lunch.
2. Visit Pip’s tall town house. Match a circle, square and triangle for a window. Wrong choices offer a hint without a penalty.
3. Visit Rex’s riverside home. Give one apple to each of three friends, practising one-to-one sharing.
4. Complete a friendship passport and celebrate at a shared picnic. Replay or return home explicitly; no pressure or countdown.

Each activity uses large controls, printed prompts and prerecorded narration. The houses are friendly fictional settings rather than claims about how particular countries or cultures live. The new artwork is a hand-authored SVG and CSS scene system, extending the existing vector art approach.

## Validation results

- Eight automated logic/asset tests pass.
- Full browser regression suite passes in Microsoft Edge (Chromium) and WebKit 26.5 on Windows. All 24 activity launches/exits, the complete three-home story, wrong-shape hints, saved favourites, parent preferences and three viewport sizes are covered.
- All 28 entries in the new narration allowlist decode successfully as audio; 27 recordings were newly generated. Durations range from 1.73 to 6.46 seconds.
- Drawing, clearing and undoing restore the exact painted pixels in the browser.
- Visual snapshots reviewed at phone, tablet and desktop sizes.

## Validation boundaries and future craft

- Automated tests cover shared logic, stale callbacks, drag cancellation, narration assets, cache errors and ranges. Browser checks cover every game launch/exit, the full new story, wrong shape choices, favourites, parent preferences and responsive layouts.
- Physical iPad testing is still needed for the hardware mute switch, palm contact, home-screen launch, orientation changes and a longer real play session. WebKit on Windows is not physical iPad Safari.
- Existing canvas games still use specialised touch mechanics. Full nonvisual screen-reader play and complete keyboard equivalents for drawing/tracing are not claimed.
- Four drawing snapshots are retained in memory only. They are taken at stroke start, never during pointermove. No artwork is uploaded or persisted.
- The inherited game engines and their inline CSS remain in the two HTML pages. Extracting every engine at once would create unnecessary regression risk; future changes can migrate one activity at a time into independent modules.
- The original book/story activities remain. The new home-visiting activity uses original writing and artwork, not a page-by-page adaptation.
- No child progress assessments, long-term scores, external messages, monetisation or cloud storage were introduced.

## Follow-up priorities

Play the upgraded app with Avalynn: watch whether she recognises the new card artwork, can find favourite games, hears every prompt, and understands the three house tasks without adult explanation. Use those observations to tune pacing and challenge. Her enjoyment and independence are the acceptance criteria.

## iPad-first correction

Replaced the website-like discovery screen with a viewport-filling app shell: paginated toy tiles, swipe navigation, short icon-led categories, persistent bottom dock, safe-area padding and larger touch controls. The landscape and portrait home screens fit without vertical scrolling. Removed the hero, featured banner, card descriptions and footer. Existing games and the new story remain full-screen activities.
