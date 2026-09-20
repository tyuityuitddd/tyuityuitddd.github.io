---
name: TDDD Framebook
description: An interactive frame book for the creator's original artwork and development notes.
colors:
  aubergine: "#292334"
  lavender-paper: "#dcd8f2"
  violet: "#473279"
  muted-ink: "#5b526c"
  reading-ink: "#51465f"
  lavender-panel: "#cbc3e4"
  divider: "#afa4c7"
  focus: "#7051a0"
  journal-accent: "#dfc8ff"
  journal-muted: "#d0c6dc"
  journal-divider: "#62546f"
  journal-tag-border: "#81718c"
  viewer-bg: "#211c2a"
  viewer-text: "#f0eafa"
typography:
  display:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "clamp(112px, 19vw, 320px)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "-0.03em"
  wordmark:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Microsoft JhengHei', 'Yu Gothic', Arial, sans-serif"
    fontSize: "clamp(34px, 5.1vw, 76px)"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Microsoft JhengHei', 'Yu Gothic', Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "'Microsoft JhengHei', 'Yu Gothic', Arial, sans-serif"
    fontSize: "17px"
    lineHeight: 1.95
  journal-body:
    fontFamily: "'Microsoft JhengHei', 'Yu Gothic', Arial, sans-serif"
    fontSize: "18px"
    lineHeight: 2
  label:
    fontFamily: "'Microsoft JhengHei', 'Yu Gothic', Arial, sans-serif"
    fontSize: "14px"
  artwork-index:
    fontFamily: "Arial, sans-serif"
    fontSize: "12px"
rounded:
  square: "0"
  viewer: "4px"
spacing:
  tag-gap: "8px"
  filter-gap: "12px"
  compact-gap: "20px"
  heading-gap: "32px"
  heading-after: "40px"
  gallery-row: "88px"
  section-block: "100px"
components:
  outline-link:
    backgroundColor: "transparent"
    textColor: "{colors.aubergine}"
    rounded: "{rounded.square}"
    padding: "13px 21px"
  outline-link-hover:
    backgroundColor: "{colors.aubergine}"
    textColor: "{colors.lavender-paper}"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.square}"
    padding: "10px 16px"
  filter-selected:
    textColor: "{colors.aubergine}"
    backgroundColor: "transparent"
  journal-tag:
    textColor: "{colors.journal-muted}"
    rounded: "{rounded.square}"
    padding: "4px 12px"
  motion-toggle:
    backgroundColor: "{colors.aubergine}"
    textColor: "{colors.lavender-paper}"
    rounded: "{rounded.square}"
    padding: "10px 16px"
  lightbox:
    backgroundColor: "{colors.viewer-bg}"
    textColor: "{colors.viewer-text}"
    rounded: "{rounded.viewer}"
    padding: "20px 28px"
---

# Design System: TDDD Framebook

## Overview

**Creative North Star: "The Interactive Frame Book"**

Cool lavender paper, condensed aubergine lettering, and rectangular artwork panes turn the portfolio into a sequence of frames. The creator's images carry the visual detail; the interface supplies scale, spacing, borders, and movement. The large TDDD mark is the typographic signature.

Pointer movement and native scrolling open the frames. Motion is an optional layer over readable, navigable content: it never intercepts scrolling or clicks. The dark development-note band interrupts the light gallery rhythm, while work detail pages and standalone journal pages retain the light reading surface.

This record describes the implemented cascade: `app/layout.tsx` imports `globals.css`, then `motion.css`, then `framebook.css`. The last file establishes the final palette and geometry; earlier files still supply component structure. The generated proposal is a composition reference only. Shipping artwork uses preexisting user-supplied originals and their optimized WebP variants. Bebas Neue is self-hosted in `public/fonts/BebasNeue-Regular.ttf`, with `OFL-BebasNeue.txt`, sourced from the official Google Fonts repository.

**Key Characteristics:**
- Monumental condensed identity lettering beside offset portrait panes.
- Light lavender gallery and detail surfaces with one dark journal preview band.
- Square controls, fine rules, and artwork shown at its natural ratio in the gallery.
- Pointer parallax, gentle card tilt, and differentiated scroll entrances.
- A persistent motion choice, reduced-motion defaults, and keyboard-safe geometry.

Evidence: source plus manual screenshots in `.impeccable/review/` (`desktop.png`, `desktop-scroll.png`, `mobile.png`, `works-581.png`, `journal.png`). This document does not certify a numeric comp fidelity score or a completed build gate; build state remains separately tracked in `.impeccable/build/state.json`.

## Colors

The palette is cool lavender paper with dark aubergine ink and restrained violet interaction accents.

Sidecar tonal ramps are synthesized OKLCH preview metadata, not additional production palette tokens.

### Primary
- **Violet:** Links, active details, progress rail, and state accents.
- **Focus violet:** Visible keyboard outlines on the light field.

### Neutral
- **Lavender paper:** Main canvas, header, light button text on dark controls.
- **Aubergine:** Primary ink, dark journal preview, motion control, and viewer affordances.
- **Muted ink / reading ink:** Secondary labels and quieter explanatory copy on light surfaces.
- **Lavender panel:** About section, next-work panel, and image backing surfaces.
- **Divider:** Fine rules on light surfaces.
- **Journal accent / muted / divider / tag border:** Context-specific inverse values for the dark home-page journal preview.
- **Viewer background / text:** Dark lightbox and video surfaces, separate from page reading surfaces.

**The Local Inversion Rule.** Invert the home journal preview as a section, using its light text and violet accent overrides; standalone journal pages remain light in the current implementation.

## Typography

**Display Font:** Bebas Neue, with sans-serif fallback.

**Body Font:** Microsoft JhengHei, Yu Gothic, Arial, sans-serif, supporting the Chinese, Japanese, and English interface.

**Character:** The authored condensed Latin wordmark contrasts with readable multilingual text. Body copy uses generous leading; dates, counts, and indices remain compact. The `headline` token records the present CJK fallback implementation, not an additional branded display face.

### Hierarchy
- **Display:** The TDDD hero identity; mobile uses `clamp(98px, 24vw, 175px)` with a tighter line height (`.8`).
- **Wordmark:** Header identity, reduced to `38px` at the mobile breakpoint. Footer identity is `70px`, reduced to `56px`.
- **Headline:** Section titles; common mobile section headings use `36px`. Detail titles use `clamp(35px, 5vw, 76px)` and line height `1.18`; the journal masthead uses `clamp(38px, 6vw, 88px)`.
- **Title:** Work captions use the frontmatter title role; journal preview titles use `clamp(24px, 2.6vw, 38px)` with line height `1.4`.
- **Body:** Biography text; journal articles use the separate journal-body role inside a `780px` reading column and reduce to `17px` on mobile.
- **Label:** Navigation, dates, and secondary controls. Artwork indices use tabular numerals; metadata may inherit existing monospace treatments.

**The Identity Lettering Rule.** Use the self-hosted condensed face for TDDD identity marks; preserve multilingual reading clarity around it.

## Layout

The desktop header is `84px` high with `4vw` side padding. Regular sections use the section-block spacing and `6vw` side padding. At widths above `1600px`, side padding grows to hold an approximately `1480px` content span. At `760px` and below, regular sections use `65px 6vw`, navigation wraps into a second header row, and the header becomes `106px` high. Smaller inherited adjustments exist at `380px`; intermediate adjustments occur at `1000px`.

The desktop gallery uses a twelve-column grid, alternating five- and seven-column image spans, `5vw` column gaps, and the gallery-row spacing. Even cards offset by `90px`. On mobile it becomes two columns with `20px` column gaps and `50px` row gaps; even portrait cards offset by `55px`, while landscape cards span both columns. Gallery images retain intrinsic proportions instead of being cropped to a universal card shape.

The hero is a native-scroll scene (`185svh`) with a sticky viewport stage and `680px` minimum stage height. Its title occupies the left third; portrait panes begin at `38%` and `73%`. At mobile widths the title precedes the images, the scene is `170svh`, and the stage minimum is `730px`. Coarse pointers use a shorter `155svh` scene. Scroll computes a clamped `--progress` from zero to one; the rail visualizes actual scene progress and the two portraits separate to reveal an invitation. Disabling motion removes the sticky travel and preserves the starting composition.

The home journal preview uses a date column (`160px`) and content column separated by `45px`, becoming one column on mobile. Standalone journal index and article containers are limited to `1400px` and `1080px`; article body copy to `780px`. Detail galleries cap at `1800px`, with illustration galleries capped at `1150px`.

## Elevation & Depth

The resting interface is flat: color fields, fine rules, and image scale establish hierarchy. Depth appears during direct interaction through perspective, tilt, and diffuse hover shadows. The pointer indicator is a small outlined diamond and rectangular viewing hint; the older radial glow is disabled by the final cascade.

### Shadow Vocabulary
- **Portrait hover:** `0 18px 35px #29233430`.
- **Artwork tilt hover:** `0 20px 38px #29233425`, used when motion is enabled.

**The Responsive Depth Rule.** Keep resting artwork flat; use perspective and soft shadow to acknowledge pointer interaction without obscuring the image.

## Shapes

The dominant forms are crisp rectangles: portrait panes, outline links, filters, tags, the progress rail, viewing hints, and the motion toggle. Controls use thin borders or a selected underline rather than pill silhouettes. The desktop lightbox retains a small viewer radius and becomes square and full-screen on mobile. Existing zoom-image labels retain a rounded local treatment; do not treat that leftover exception as the recurring frame-book shape.

## Components

### Buttons and links

Outline links have a one-pixel current-color border, square corners, and minimum height `48px`; mobile hero links use `44px`. Hover exchanges ink and paper. The load-more control uses `15px 27px` padding and a minimum height of `50px`. The dark journal link reverses the same treatment. Light-surface focus uses a two-pixel focus outline with `5px` offset. Icons are inline SVG through Lucide components.

### Filters and tags

Filters are wrapping text controls with category counts and an `aria-pressed` state. Selection is a two-pixel underline, while hover adds a pale lavender fill. Result count uses tabular numerals and is hidden on mobile. Journal tags are static rectangular outlined labels; they are not filter buttons.

### Artwork cards

Cards are image-led links with no surrounding panel. Index numbers sit above the image; multiple-image counts and a viewing arrow sit at the bottom. Captions are conditional: commissioned illustration work omits visible filenames and titles. Hover and keyboard focus expose the arrow affordance; mobile keeps it visible. Fine-pointer tilt is bounded to approximately `±2.5deg` on X and `±3.5deg` on Y.

### Navigation

The header combines the condensed wordmark, three navigation destinations, and a Chinese/English/Japanese switch. Links receive an animated underline; the current language receives an underline and darker ink. A focusable skip link precedes the header. Detail pages use a normal-flow header and back link. Language is restored from the URL or optional local storage.

### Journal rows

The home preview is a dark text-led list with covers hidden, dates aligned at left, rectangular tags, and rule-separated entries. Standalone journal lists can display covers and remain on the light canvas. Body copy and source notes maintain a narrow, generous-leading reading column.

### Motion system

The persistent bottom-right toggle has a minimum height of `44px`, an explicit pressed state, translated labels, and optional storage under `tddd-motion`. System reduced-motion preference supplies the default; an explicit saved on/off choice takes precedence. The toggle is hidden during dialogs. Turning motion off cancels entrance animations, suppresses pointer layers and transitions, resets card and portrait transforms, and removes sticky hero travel.

Fine mouse pointers move portrait planes by small opposing offsets and produce bounded magnetic movement on the hero explore link and contact email. Decorative layers are pointer-transparent. Native scroll remains intact; no wheel or touch event is intercepted. Entrance motion starts only after intersection: artwork uses a `950ms` clip reveal and vertical travel; text uses a `650ms` fade/translation, with up to `90ms` stagger and `cubic-bezier(.16,1,.3,1)` easing. Content is visible before JavaScript or animation registration. Keyboard interaction clears pointer effects; focus cancels an entrance affecting the target, restores hero starting geometry, and hides the behind-frame reveal.

### Image viewer

Images open into a dark dialog with an accessible title, close button, previous/next controls, arrow-key navigation, and an image fitted within the available space. Control boundaries disable previous/next at the ends. The mobile dialog fills the viewport. Videos start from an explicit play control.

## Do's and Don'ts

### Do:
- **Do** preserve original artwork provenance and use the responsive optimized-image pipeline.
- **Do** keep commissioned illustration cards and pages free of visible filenames and titles.
- **Do** retain the light reading canvas and the local dark journal preview inversion.
- **Do** keep pointer and scroll effects optional, with readable content before JavaScript and safe keyboard focus.
- **Do** consult the final stylesheet cascade before extending a component.

### Don't:
- **Don't** publish the generated proposal as creator artwork.
- **Don't** convert the native-scroll scene into scroll hijacking or gate content behind animation.
- **Don't** carry the obsolete neon-green palette, radial glow, or floating photo-card composition into new surfaces.
- **Don't** apply a universal crop to gallery images that currently preserve their intrinsic proportions.

Not canonized or repaired by this documentation pass: superseded rules in `globals.css` and `motion.css`, legacy rounded zoom labels, the footer's text arrow, and system-font CJK display fallback. These remain implementation drift or fallback details, not new signature rules. Documentation records the current cascade and does not change UI or claim completion of pending visual/build review gates.
