/* ============================================================
   CASE STUDY — shared layout, structure & scrollytelling
   ------------------------------------------------------------
   This file is the TEMPLATE for every case-study page. It owns
   structure, spacing, responsive behaviour and the scroll
   animation styling — NOT content. Edit here to change the look
   of ALL case studies at once. Individual page content lives in
   each case study's own .html file (e.g. Moneytree.html,
   accutech-design.html). Pair this with assets/case-study.js.

   Built on top of the site design system in styles.css (uses its
   CSS variables, .eyebrow, .h-lg, .display, .wrap, .section, etc).
   ============================================================ */

.cs-back { display: inline-flex; align-items: center; gap: 8px; font-size: .95rem; font-weight: 500; color: var(--text-muted); transition: color .2s, gap .2s; }
.cs-back:hover { color: var(--text); gap: 12px; }

/* Hero */
.cs-hero { position: relative; isolation: isolate; padding-top: calc(var(--nav-h) + clamp(56px, 8vw, 120px)); padding-bottom: clamp(32px, 4vw, 56px); }
/* Same masked dot-grid texture as the homepage hero */
.cs-hero::before {
  content: "";
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background-image: radial-gradient(rgba(22,21,20,.20) 1px, transparent 1.4px);
  background-size: 11px 11px;
  background-position: top left;
  background-attachment: fixed;
  opacity: .95;
  /* A top band that follows the diagonal accent line (iso-lines tilt up to the
     right), intersected with a left→right fade so the dots run along the line
     and dissolve toward the right. */
  -webkit-mask-image:
    linear-gradient(170deg, #000 0%, #000 12%, rgba(0,0,0,.5) 27%, transparent 44%),
    linear-gradient(to right, #000 0%, #000 48%, rgba(0,0,0,.5) 80%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(170deg, #000 0%, #000 12%, rgba(0,0,0,.5) 27%, transparent 44%),
    linear-gradient(to right, #000 0%, #000 48%, rgba(0,0,0,.5) 80%, transparent 100%);
  mask-composite: intersect;
}
@media (max-width: 760px) { .cs-hero::before { background-size: 10px 10px; opacity: .6; background-attachment: scroll; } }
.cs-hero__title { max-width: 16ch; margin-top: 18px; color: var(--text); }
.cs-meta { display: flex; flex-wrap: wrap; gap: clamp(28px, 6vw, 88px); margin-top: clamp(28px, 4vw, 48px); }
.cs-meta__item { display: flex; flex-direction: column; gap: 6px; }
.cs-meta__item .v { font-size: 1.15rem; font-weight: 600; color: var(--text); }

/* Image placeholders */
.cs-figure { border-radius: var(--r-card); overflow: hidden; box-shadow: var(--shadow-soft), inset 0 0 0 1px var(--line-soft); background: var(--paper); }
.cs-figure image-slot { display: block; width: 100%; }
.cs-figcaption { margin-top: 14px; font-size: .92rem; color: var(--text-muted); text-align: center; }

/* Section header */
.cs-head { max-width: 60ch; }
.cs-head .eyebrow { display: block; margin-bottom: 14px; }
.cs-prose { max-width: 64ch; }
.cs-prose p + p { margin-top: 1.1em; }
.cs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 40px); align-items: start; }

/* Before / after */
.cs-ba__label { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px; font-size: .8rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); }
.cs-ba__label::before { content: ""; width: 22px; height: 2px; border-radius: 2px; background: var(--line); }
.cs-ba__label--new::before { background: var(--accent); }

/* Galleries */
.cs-gallery { display: grid; gap: clamp(16px, 2vw, 26px); }
.cs-gallery--screens { grid-template-columns: repeat(2, 1fr); }
.cs-gallery--lowfi { grid-template-columns: repeat(3, 1fr); }

/* Discovery tools tabs */
.cs-tabs { margin-top: clamp(28px, 3vw, 44px); }
.cs-tabs__list { display: flex; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid var(--line); padding-bottom: 0; }
.cs-tab { appearance: none; border: 0; background: transparent; cursor: pointer; font: inherit; font-weight: 500; color: var(--text-muted); padding: 12px 18px; border-radius: var(--r-pill) var(--r-pill) 0 0; position: relative; transition: color .2s, background .2s; }
.cs-tab:hover { color: var(--text); background: rgba(22,21,20,.04); }
.cs-tab[aria-selected="true"] { color: var(--text); }
.cs-tab[aria-selected="true"]::after { content: ""; position: absolute; left: 14px; right: 14px; bottom: -1px; height: 2px; background: var(--accent); border-radius: 2px; }
.cs-panel { display: none; padding-top: clamp(28px, 3vw, 44px); }
.cs-panel[data-active] { display: grid; grid-template-columns: 1fr 1.25fr; gap: clamp(24px, 4vw, 56px); align-items: start; }
.cs-panel__copy { display: flex; flex-direction: column; gap: 22px; }
.cs-panel__block .eyebrow { display: block; margin-bottom: 8px; }
@media (prefers-reduced-motion: no-preference) {
  .cs-panel[data-active] { animation: csFade .4s ease both; }
}
@keyframes csFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* Pull quote / testimonials band */
.cs-quotes { background: var(--ink); color: var(--cream-2); }
.cs-quotes .eyebrow { color: rgba(255,255,255,.6); }
.cs-quotes__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); margin-top: clamp(32px, 4vw, 56px); }
.cs-quote { display: flex; flex-direction: column; gap: 22px; }
.cs-quote blockquote { font-size: clamp(1.4rem, 2vw, 1.9rem); line-height: 1.28; letter-spacing: -.02em; color: #fff; font-family: var(--font-head, inherit); }
.cs-quote .stars { color: var(--accent); letter-spacing: 3px; font-size: 1rem; }
.cs-quote__who { margin-top: auto; }
.cs-quote__who .n { font-weight: 600; color: #fff; }
.cs-quote__who .r { color: rgba(255,255,255,.6); font-size: .92rem; margin-top: 2px; }

/* Single manifesto / pull-quote band (one centred statement, no attribution).
   Reuses the dark .cs-quotes surface — add both classes to the <section>. */
.cs-manifesto__quote {
  max-width: 22ch;
  margin-top: clamp(20px, 3vw, 34px);
  font-family: var(--font-head, inherit);
  font-size: clamp(1.7rem, 3.4vw, 2.9rem);
  line-height: 1.18; letter-spacing: -.02em; color: #fff;
}
.cs-manifesto__quote em { color: var(--accent); font-style: normal; }

/* Stat callouts (e.g. results scene). Reusable across case studies. */
.cs-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(18px, 3vw, 40px); margin-top: clamp(26px, 3vw, 40px); }
.cs-stat { display: flex; flex-direction: column; gap: 6px; }
.cs-stat__n { font-family: var(--font-head, inherit); font-size: clamp(2rem, 3.6vw, 3rem); line-height: 1; letter-spacing: -.02em; color: var(--text); }
.cs-stat__l { font-size: .92rem; color: var(--text-muted); max-width: 22ch; }
@media (max-width: 620px) { .cs-stats { grid-template-columns: 1fr 1fr; } }

/* Emphasised lead line inside prose */
.cs-leadline { font-family: var(--font-head, inherit); font-size: clamp(1.25rem, 1.9vw, 1.6rem); line-height: 1.34; letter-spacing: -.01em; color: var(--text); }

@media (max-width: 820px) {
  .cs-grid-2, .cs-panel[data-active], .cs-quotes__grid { grid-template-columns: 1fr; }
  .cs-gallery--lowfi { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .cs-gallery--screens, .cs-gallery--lowfi { grid-template-columns: 1fr; }
}

/* ============================================================
   SCROLLYTELLING — sticky left column, scrolling right column.
   Text block: headings cross-fade in place as paragraphs scroll.
   Media blocks: heading + prose pin while images scroll past.
   A thin amber line in the left column fills as you move through.
   ============================================================ */
.cs-scrolly { padding-block: clamp(60px, 8vw, 124px); }
.cs-scrolly__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(36px, 6vw, 104px);
}
.cs-scrolly__left { position: relative; padding-left: clamp(0px, 6vw, 112px); }

/* Heading column: sits in normal flow, then STICKS (pinned, vertically
   centred via JS `top`) while the right column scrolls. The scene headings
   cross-fade as the right column passes each scene. */
.cs-sticky {
  position: sticky;
  top: 0;                         /* JS overrides with the centred offset */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.cs-headstack { display: grid; width: 100%; }
.cs-headstack__item {
  grid-area: 1 / 1;
  align-self: start;
  display: flex; flex-direction: column; align-items: flex-start; gap: 16px;
  opacity: 0;
  transition: opacity .55s ease;
  pointer-events: none;
}
.cs-headstack__item.is-active { opacity: 1; pointer-events: auto; }
.cs-headstack__item .eyebrow { display: block; }
.cs-headstack__item .h-lg { color: var(--text); max-width: 16ch; }
.cs-headstack__item .cs-prose { margin-top: 4px; max-width: 38ch; }

/* Sticky top scroll-progress bar */
.cs-rail { position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: var(--line-soft); z-index: 60; opacity: 0; transition: opacity .4s ease; pointer-events: none; }
.cs-rail.is-on { opacity: 1; }
.cs-rail__fill { position: absolute; left: 0; top: 0; height: 100%; width: 100%; background: var(--accent); transform: scaleX(var(--p, 0)); transform-origin: left center; transition: transform .1s linear; }

/* Right column — continuous scenes that scroll past the pinned heading. */
.cs-scrolly__right { display: flex; flex-direction: column; }
.cs-scene { min-height: 82vh; transition: opacity .5s ease; }
.cs-scene:last-child { min-height: 0; padding-bottom: clamp(4vh, 9vh, 13vh); }
.cs-scene--text .cs-prose { max-width: 42ch; padding-right: clamp(16px, 5vw, 96px); }
.cs-scene--text.is-dim { opacity: .2; }
.cs-scene__head { display: none; }

/* Image stacks inside media scenes — single column */
.cs-stack { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 44px); }
.cs-ba__label { margin-top: 0; }

/* Normal static two-column row (last row — no pinning, normal scrolling) */
.cs-static {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(36px, 6vw, 104px);
  align-items: start;
}
.cs-static__head { padding-left: clamp(0px, 6vw, 112px); }
.cs-static__head .eyebrow { display: block; }
.cs-static__head .h-lg { color: var(--text); max-width: 16ch; margin-top: 14px; }
.cs-static__head .cs-prose { margin-top: 14px; max-width: 38ch; }
@media (max-width: 920px) {
  .cs-static { grid-template-columns: 1fr; gap: clamp(22px, 4vw, 34px); }
  .cs-static__head { padding-left: 0; }
}

@media (max-width: 920px) {
  .cs-scrolly__grid { grid-template-columns: 1fr; gap: clamp(22px, 4vw, 34px); }
  .cs-sticky { position: static; }
  .cs-scrolly__left { display: none; }       /* headings show inline per scene */
  .cs-rail { display: none; }
  .cs-scene { min-height: 0; margin-bottom: clamp(44px, 9vw, 80px); }
  .cs-scene--text.is-dim { opacity: 1; }
  .cs-scene__head { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .cs-headstack__item { transition: none; }
  .cs-scene--text.is-dim { opacity: 1; }
  .cs-rail__fill { transition: none; }
}
