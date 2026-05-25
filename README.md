# Alice Image Generation — The Guided Tour

A self-contained HTML slide deck that walks the Alice image-generation pipeline **step by step**, "show don't tell" — the viewer watches a text prompt assemble piece-by-piece from real data and ends on the rendered image.

It is the **companion** to the [Alice Image Generation Architecture](https://kiyoraka.github.io/Alice-Image-Generation-Architecture/) diagram: that one is the *map*, this one is the *guided tour*.

## What it covers

Two worked examples — the **same character (Naruto) in two registers**, to show that only the variables change:

1. **Hari Raya cover** — Naruto in modern baju melayu, a calm festive portrait. Walks the full magazine-cover pipeline with a cumulative "prompt so far" panel that grows one phrase at a time, ending on the render-gate + helper.
2. **Battle cover** — Naruto mid Wind Style: Rasenshuriken. Same 5-paragraph skeleton, jutsu-casting variables, then the moderation/calibration internals in full: IP-framing, the wardrobe-vocabulary cookbook, the Japanese-framing shield, and retry-before-rewrite.

The takeaway: **data → phrase → picture**. The fixed block carries the aesthetic; the variables carry the look; the opening anchor carries it past moderation; the helper renders it.

## Running it

It is plain HTML/CSS/JS — no build step, no framework, no dependencies.

- **Locally:** open `index.html` in any browser.
- **Hosted:** GitHub Pages at `https://kiyoraka.github.io/Alice-Image-Generation-Guide/`.

Navigate with the **← →** arrow keys, the **Prev / Next** buttons, swipe on touch devices, or click a progress dot. The URL hash tracks the current slide (`#12`) so you can deep-link.

## Structure

```
index.html        thin shell — brandbar, slide stage, nav
css/style.css      purple theme (matched to the architecture doc) + responsive layout
js/slides.js       all slide content as data (4 tracks: intro / alice / naruto / outro)
js/deck.js         engine — render, nav, swipe, cumulative prompt panel, progress
assets/            the rendered example images
```

To edit or reorder slides, touch only `js/slides.js`. Each slide is a data object; a `fragment` field is the new prompt line(s) that slide contributes to the growing panel.

## Source of truth

Every prompt fragment and data value in the deck is grounded in the real pipeline files (the magazine-cover template, the moderation-calibration doc, and the render helper) — nothing is invented for the slides.

---

💜 Built with Alice. The skill decides, the helper renders.
