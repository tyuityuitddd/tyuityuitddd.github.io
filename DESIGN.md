---
name: TDDD Circular Exhibition
description: Original artwork in a dark circular gallery of upright frames.
colors:
  ink: "#090e14"
  paper: "#e9eff2"
  accent: "#a9cedb"
  line: "#2c3841"
  muted-text: "#a4b3bf"
  frame-surface: "#0c141d"
  frame-mat: "#101923"
  frame-border: "#506171"
  frame-current: "#94b6c6"
  frame-hover: "#daecf5"
  control-border: "#364956"
  control-hover: "#1c303f"
  control-hover-border: "#92b2c2"
  open-surface: "#b6d1de"
  open-ink: "#0b1620"
  open-hover: "#d3e9f3"
  open-border: "#789cac"
  viewer-surface: "#090f16"
  viewer-border: "#3c5261"
  dialog-surface: "#111b25"
  dialog-border: "#425767"
  dialog-copy: "#b5c2cd"
  active-filter: "#eaf7fd"
  nav-text: "#b6c2ca"
  language-active: "#22323e"
  language-text: "#edf7ff"
  language-border: "#425866"
  language-hover: "#1b2832"
  motion-surface: "#172530"
  motion-text: "#b7cbd7"
  journal-text: "#d3dfe7"
  journal-muted: "#b4c2cc"
  journal-tag-border: "#3a4e5d"
  media-surface: "#121e28"
  related-surface: "#111c26"
typography:
  wordmark:
    fontFamily: "GalleryDisplay, sans-serif"
    fontSize: "36px"
    fontWeight: 400
    letterSpacing: "1px"
  headline:
    fontFamily: "Arial, 'Microsoft JhengHei', 'Yu Gothic', sans-serif"
    fontSize: "clamp(25px, 2.8vw, 40px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
  dialog-title:
    fontFamily: "Arial, 'Microsoft JhengHei', 'Yu Gothic', sans-serif"
    fontSize: "24px"
    lineHeight: 1.5
  body:
    fontFamily: "Arial, 'Microsoft JhengHei', 'Yu Gothic', sans-serif"
    fontSize: "14px"
    lineHeight: 1.9
  journal-body:
    fontFamily: "Arial, 'Microsoft JhengHei', 'Yu Gothic', sans-serif"
    fontSize: "18px"
    lineHeight: 2
  label:
    fontFamily: "Arial, 'Microsoft JhengHei', 'Yu Gothic', sans-serif"
    fontSize: "13px"
  artwork-index:
    fontFamily: "monospace"
    fontSize: "10px"
    letterSpacing: "0.15em"
  counter:
    fontFamily: "monospace"
    fontSize: "13px"
    letterSpacing: "0.1em"
rounded:
  square: "0"
  frame: "1px"
  control: "2px"
  dialog: "3px"
  circle: "50%"
  pill: "30px"
spacing:
  compact: "12px"
  control: "16px"
  section: "24px"
  dialog-columns: "38px"
components:
  open-artwork:
    backgroundColor: "{colors.open-surface}"
    textColor: "{colors.open-ink}"
    rounded: "{rounded.control}"
    padding: "13px 18px"
  open-artwork-hover:
    backgroundColor: "{colors.open-hover}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  icon-button-hover:
    backgroundColor: "{colors.control-hover}"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted-text}"
    rounded: "{rounded.square}"
    padding: "14px 0"
  filter-active:
    textColor: "{colors.active-filter}"
  artwork-frame:
    backgroundColor: "{colors.frame-surface}"
    rounded: "{rounded.frame}"
    padding: "9px"
    width: "clamp(205px, 23vw, 325px)"
    height: "clamp(250px, 49svh, 510px)"
  viewer:
    backgroundColor: "{colors.viewer-surface}"
    textColor: "{colors.paper}"
    rounded: "{rounded.dialog}"
    padding: "17px 24px"
  motion-toggle:
    backgroundColor: "{colors.motion-surface}"
    textColor: "{colors.motion-text}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  journal-tag:
    textColor: "{colors.journal-muted}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: TDDD Circular Exhibition

## Overview

**Creative North Star: "Dark circular exhibition"**

Upright artwork frames occupy a dark exhibition space. The current work faces the visitor; neighboring frames turn away around a perspective ring. Ink surfaces, cool blue-gray edges, and pale controls support the creator's original images.

The user explicitly replaced the lavender waterfall direction on 2026-09-21. This record describes the implemented ring and its desktop/mobile review captures; no approved raster comp applies to this replacement direction. Dragging, arrows, selection, and click-to-view form the interaction model. Motion remains optional.

**Key Characteristics:**
- Upright frames on a perspective ring, with the selected work centered.
- Original artwork contained within a dark mat; no universal artwork crop.
- A condensed TDDD identity, compact multilingual text, and monospace counters.
- Dark gallery, detail, journal, and dialog surfaces with cool blue-gray controls.
- Responsive controls and persistent optional motion.

## Colors

The palette combines near-black blue surfaces with pale blue-gray interaction cues. Frontmatter carries the exact implemented primitives.

### Primary

- **Accent:** focus outlines, heading punctuation, selected category underline, and viewer/contact links.
- **Open surface / open ink:** the filled artwork action; open-hover lightens its surface.

### Neutral

- **Ink / paper:** the page canvas and primary text. Detail and journal pages share the ink canvas.
- **Muted text / nav text:** supporting labels and navigation; navigation and filters brighten to white on hover.
- **Frame surface / frame mat:** the frame surround and uncropped image bed; frame-current and frame-hover clarify state.
- **Viewer / dialog surfaces:** dark tonal layers separated by their fine border colors.
- **Journal text / journal muted:** long-form copy and metadata; media-surface and related-surface provide secondary panels.

**The Artwork First Rule.** Keep the artwork as the visual detail; use the dark mat and restrained blue-gray frame to hold it.

## Typography

**Display Font:** GalleryDisplay, the self-hosted BebasNeue-Regular.ttf, with sans-serif fallback.
**Body Font:** Arial, Microsoft JhengHei, Yu Gothic, sans-serif, in that order.
**Counter Font:** monospace.

The condensed Latin wordmark identifies TDDD. Multilingual interface and reading copy inherit the existing system stack. The observed system-font page heading is recorded for accuracy, not promoted as a branded display treatment.

### Hierarchy

- **Wordmark:** frontmatter wordmark role; decreases to 28px at the mobile breakpoint.
- **Gallery headline:** frontmatter headline role; 27px on mobile and 28px for short desktop viewports.
- **About dialog title / body:** frontmatter dialog-title and body roles; title becomes 22px on mobile.
- **Viewer title:** 14px, weight 400, line-height 1.6.
- **Navigation / filters:** frontmatter label role; both become 12px on mobile.
- **Journal reading:** frontmatter journal-body role; 17px on mobile in a 780px maximum reading column.
- **Indices / counter:** monospace roles; the mobile counter becomes 12px with .02em spacing.

**The Identity Lettering Rule.** Use the self-hosted GalleryDisplay face for the TDDD wordmark. Other text follows the existing multilingual system stack; it is not a new branded display-face commitment.

## Layout

The homepage is a flex column at 100svh with a 650px minimum height. Its 78px header precedes the heading/filter row, flexible stage, navigation console, and journal footer. Horizontal page margins are 4vw. The console uses three columns (1fr auto 1fr): guidance, selection, and the open action.

The stage uses 1150px perspective. Frames sit at left 50% and top 46%; their maximum height is 86% of the stage. Ring radius is clamped to 235–740px from 52% of stage width. Adjacent slots are 42 degrees apart; Y rotation is -0.68 times that angle, with depth scaled by .85. At most seven frames render around the current selection; distances two and three use .55 and .26 opacity. Frame images use object-fit: contain.

At widths of 1000px and below, gaps compress, the current work label disappears, and the latest journal title shortens. At 760px and below, the header is 96px high with navigation on its second row; margins become 5vw, the heading and filters stack, and the shell minimum is 640px. Perspective becomes 850px. Frames use width clamp(195px,48vw,270px), height 41svh, max-height 81%, top 43%, and 6px padding. The console becomes two columns; the centered drag guide occupies its own last row. Selector arrow buttons become 40px circles. The footer hides copyright and the latest title, retaining the journal link with space for the fixed motion toggle.

At 1700px and above, perspective increases to 1400px and frames are 350px wide. At desktop widths above 760px with height at most 700px, shell minimum height becomes 570px and frames use 42svh with a 77% maximum height.

## Elevation & Depth

Perspective geometry establishes the exhibition. Shadows separate the upright frames; narrow luminous lines above/below them and two faint elliptical floor rings anchor the scene. A muted radial stage light and 18 tiny drifting particles add atmosphere. This glow is part of the chosen ring implementation, not a prohibited device.

### Shadow Vocabulary

- **Frame:** 0 20px 45px #0007, inset 0 0 0 3px #18222b.
- **Current frame:** 0 25px 65px #0009, 0 0 40px #759aaa0d, inset 0 0 0 3px #263641.
- **Motion toggle:** 0 5px 25px #0005.

**The Upright Ring Rule.** Keep the frames upright while position, Y rotation, opacity, and shadow establish their place on the ring.

## Shapes

Artwork frames are nearly square-cornered; the filled open control and language states have small corner rounding. Dialogs use the dialog radius, while selector, close, and viewer navigation buttons are circular. Journal tags and the persistent motion toggle retain pill silhouettes. Artwork is contained within rectangular mats; only the about portrait uses object-fit: cover.

## Components

### Navigation and language

The translucent header uses a 12px backdrop blur and a faint bottom rule. Text navigation sits beside the wordmark and language controls. The selected language uses language-active, language-text, and language-border; hover uses language-hover and white text. Mobile navigation occupies a centered second row.

### Category filters

Transparent text buttons pair each category with a small monospace count. A one-pixel accent underline and active-filter text show the pressed state. Hover brightens the text without introducing a filled chip. Changing category resets selection to the first work.

### Circular gallery and controls

Dragging horizontally rotates the ring; a side-frame click centers that work and a center-frame click opens it. Left/right arrows, the native select, and a separate filled open action provide alternatives. The stage accepts Left/Right and Enter. Only the current frame is in the tab order; synthetic keyboard clicks remain usable after a drag. Focus uses a 2px accent outline with 5px offset; the stage uses an inset -6px offset. Disabled buttons fade to .35, except the inherited motion toggle's .65 disabled state.

Frames transition transform over .72s with cubic-bezier(.22,.7,.18,1), opacity over .6s, and border color over .25s. Dragging disables the frame transition. Fine-pointer movement adds subtle stage tilt with .4s ease-out; particles alternate over 7s. Explicit motion-off, or the reduced-motion default without explicit opt-in, disables stage tilt, frame transitions, and particle animation. The ring geometry and navigation remain available. Saved explicit preference takes precedence over the OS default.

### Artwork viewer

A dark modal contains the uncropped image, title/accessible category label, close circle, image counter, previous/next circles, and conditional project-detail link. Width is calc(100vw - 48px), maximum 1500px; height is calc(100svh - 48px). The overlay is #02070eee with 12px blur. Arrow keys switch images. The underlying dialog primitive manages modal semantics and dismissal. On mobile, the viewer fills 100vw by 100svh, has no corner radius, and uses 12px padding; bottom controls can wrap. Commissioned illustrations use category labels rather than visible filenames or project titles, and omit the project-detail link.

### About/contact dialog

The desktop dialog is 760px wide with 180px and flexible columns, 38px gap, and 55px 40px padding. Its maximum dimensions leave 40px viewport clearance; overflow scrolls. The portrait is 180 by 230px. On mobile, columns stack, padding becomes 45px 25px 30px, gap becomes 24px, and portrait becomes 92 by 112px. Services are compact text between fine rules, followed by an accent email link.

### Journal tags and motion choice

Journal tags are static pill metadata with fine blue-gray outlines. The motion toggle is a fixed pill with a 44px minimum height, lower-right safe-area placement, and accent focus ring. It is hidden while a dialog is open. The home ring hides the inherited global decorative motion layer.

## Do's and Don'ts

### Do:
- **Do** preserve original artwork provenance and the optimized-image pipeline.
- **Do** contain the complete artwork within its frame and viewer.
- **Do** keep commissioned illustrations free of visible filenames and project titles.
- **Do** preserve arrow, select, keyboard, and explicit open controls alongside dragging.
- **Do** keep pointer response, transitions, and particles optional through the motion preference.
- **Do** consult the final imported stylesheet cascade before extending the system.

### Don't:
- **Don't** restore the user-rejected lavender palette or waterfall homepage.
- **Don't** treat the superseded lavender comp as approval for the current design.
- **Don't** replace supplied artwork with a generated proposal or fabricate project claims.
- **Don't** make animation completion a prerequisite for navigation or viewing.

Not canonized or repaired: the system-font gallery heading remains an observed inherited treatment, not a new display-font rule. Obsolete framebook styles are not imported and are not visual authority. The review found no material visual issue in the supplied desktop/mobile ring captures; no raster-comp approval is claimed.
