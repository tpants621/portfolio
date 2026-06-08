/* ============================================================
   TETHER — UX Work showcase
   Scroll-driven perspective collage. The board starts as a small,
   rounded, tilted contact-sheet on the right; as the section pins
   it rotates flat and grows to a full-width gallery.
   ============================================================ */
(function () {
  'use strict';

  var section = document.querySelector('.showcase');
  if (!section) return;

  var track  = section.querySelector('.showcase__track');
  var stage  = section.querySelector('.showcase__stage');
  var lead   = section.querySelector('.sc-lead');
  var board  = section.querySelector('.showcase__board');
  var more   = section.querySelector('.showcase__more');
  var cols   = [].slice.call(section.querySelectorAll('.showcase__col'));
  var menu      = section.querySelector('.sc-menu');
  var emptyLabel = section.querySelector('.showcase__empty-label');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var update = null;
  var fullViewY = 0;   // page-Y where the board has just become full-screen (top-aligned)

  // board design width matches CSS (.showcase__board { width: 1600px })
  var BOARD_W = 1600;
  // floating-nav height (keep in sync with --nav-h) and per-column parallax amp
  var NAV_H = 76;
  var ampVisual = 26;
  var ampFull = 22;   // subtle per-column drift once the board is full-size

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }   // fast start → gentle settle

  function setup() {
    section.classList.remove('is-ready');
    track.style.height = '';
    board.style.transform = '';
    cols.forEach(function (c) { c.style.transform = ''; });
    if (more) { more.style.opacity = ''; more.style.transform = ''; }
    update = null;

    var mobile = window.matchMedia('(max-width: 820px)').matches;
    // Mobile: show each phone screen FULLY (contain) inside a slightly taller
    // frame so the screenshot's bottom nav clears the rounded corner and gets
    // breathing room. Desktop keeps the tight cover crop for the collage.
    [].slice.call(section.querySelectorAll('.shot--phone image-slot')).forEach(function (s) {
      s.setAttribute('fit', mobile ? 'contain' : 'cover');
      if (mobile) { s.setAttribute('position', '50% 0%'); } else { s.removeAttribute('position'); }
    });
    if (mobile || reduce) return;   // static flat masonry via CSS fallback

    var vh = window.innerHeight;

    // Switch to the pinned (is-ready) layout BEFORE measuring, so board
    // height reflects the real 1600px-wide collage — not the wrapped
    // fallback masonry. Measuring while not-ready under-reports the height
    // and makes the pan decision/scrub wrong for tall galleries.
    section.classList.add('is-ready');

    // Decide whether the full-width board will be taller than the visible
    // window — i.e. whether a vertical PAN is needed to reveal lower rows.
    var navClear0 = NAV_H - 16, botMargin0 = 34;
    var sEnd0 = (stage.clientWidth - 40) / BOARD_W;
    var bhFull0 = (board.offsetHeight || 1) * sEnd0;
    var avail0 = stage.clientHeight - navClear0 - botMargin0;
    var needsPan = bhFull0 > avail0 + 1;

    // No pan → shorter scrub, grow fills the whole scrub (no idle scrolling).
    var overflow0 = Math.max(0, bhFull0 - avail0);   // px the full board exceeds the window
    var growScrub = vh * 0.4;
    var panScrub  = needsPan ? overflow0 : 0;
    var holdScrub = needsPan ? vh * 0.04 : 0;
    var scrub = growScrub + panScrub + holdScrub;      // pinned-scroll length
    track.style.height = (vh + scrub) + 'px';
    var pinDur = scrub;
    // The grow BEGINS startLead before the stage pins — while the heading is
    // still scrolling toward the top — and the whole sequence ends exactly at
    // unpin (P=1), so there's no dead tail. We anchor startLead to the lead
    // heading's height so the grow kicks off relative to the heading on any
    // viewport (roughly: as the heading approaches the top of the window).
    var secAbs   = section.getBoundingClientRect().top + window.pageYOffset;
    var trackAbs0 = track.getBoundingClientRect().top + window.pageYOffset;
    // Scroll position where the grow completes and the board sits full-screen,
    // top-aligned (P == growEnd). Derivation: P=growEnd ⇒ pageY = trackAbs + growScrub.
    fullViewY = trackAbs0 + growScrub;
    var leadH    = Math.max(0, trackAbs0 - secAbs);
    var startLead = leadH + vh * 0.45;
    var total = scrub + startLead;                     // full A→unpin scroll range
    var growStart = 0;                                 // grow starts as soon as P>0
    var growEnd   = clamp((startLead + growScrub) / total, 0, 1);
    var panEnd    = needsPan ? clamp((startLead + growScrub + panScrub) / total, 0, 1) : 1;

    update = function () {
      var srect = section.getBoundingClientRect();
      // Anchor progress to the PINNED TRACK (not the section, whose tall lead
      // heading sits above the track) so P=1 lands exactly when the sticky
      // stage releases — no dead scrolling between the bottom reveal and the
      // hand-off to the next section.
      var trackAbs = track.getBoundingClientRect().top + window.pageYOffset;
      var P = clamp((window.pageYOffset - (trackAbs - startLead)) / (pinDur + startLead), 0, 1);
      var e = easeInOut(P);

      var stageW = stage.clientWidth;
      var stageH = stage.clientHeight;
      var boardH = board.offsetHeight || 1; // design height of the columns

      // Reserve clearance for the floating nav pill at the top, plus a small
      // bottom margin. (Per-column drift fades to zero by the time the board
      // is full-size, so it needs no extra vertical reserve.)
      var navClear = NAV_H - 16;            // nav height + breathing room
      var botMargin = 34;

      // Two phases across the scrub:
      //   grow  (P 0 → growEnd): the collage grows from a small tilted panel
      //         to a flat, FULL-WIDTH board, parked TOP-aligned (top rows show).
      //   pan   (growEnd → 1):  the full-width board (taller than the viewport)
      //         slides UP so the lower rows scroll into view.
      //   (growEnd is 1 when no pan is needed — grow uses the whole scrub.)
      var growT = clamp((P - growStart) / Math.max(growEnd - growStart, 1e-4), 0, 1);
      var panT  = (panEnd > growEnd) ? clamp((P - growEnd) / (panEnd - growEnd), 0, 1) : 0;
      // P in [panEnd, 1] is the HOLD: panT stays 1, so the board is parked
      // bottom-aligned (last row fully visible) until the section releases.
      var eg = easeInOut(growT);
      var ep = easeInOut(panT);

      // Reveal the floating category menu once the board is essentially
      // full-screen, and hide it again at the hand-off to the next section.
      section.classList.toggle('sc-menu-on', growT >= 0.9 && P < 0.999);

      // start: a LARGE tilted panel that fills more of the row (two wide
      // columns read bigger on load).  end: FILL the width (20px side margins)
      // — height is intentionally allowed to exceed the viewport; the pan
      // reveals what doesn't fit.
      // Mobile (phones) loads FLAT + full-size — no grow/tilt entrance; only the
      // per-column drift + pan happen on scroll. Desktop/website keep the
      // tilted grow entrance.
      var isMob = section.classList.contains('sc-cat-mobile');
      var sStart = (stageW * 0.82) / BOARD_W;
      var sEnd = (stageW - 40) / BOARD_W;
      var s = isMob ? sEnd : lerp(sStart, sEnd, eg);

      // ---- Vertical placement. Keep the board TOP-aligned (top row just below
      // the nav) the whole time it grows, so the collage hugs the top of the
      // stage — close to the heading above — instead of starting low/centered.
      var bhNow  = boardH * s;                          // current visual height
      var bhFull = boardH * sEnd;                       // full-size visual height
      var avail = stageH - navClear - botMargin;        // visible window height
      var tyTopNow  = navClear - stageH / 2 + bhNow / 2;  // current board, top-aligned
      var tyTopFull = navClear - stageH / 2 + bhFull / 2; // full board, top-aligned
      // bottom-aligned target (only used when the full board overflows → pan)
      var tyBotFull = (bhFull > avail)
        ? stageH / 2 - botMargin - bhFull / 2
        : tyTopFull;                                    // fits → no pan
      // On load, push the board toward the RIGHT (its right edge runs a bit
      // off-screen for a dynamic angled entrance); eases back to centered as
      // it grows to full width.
      var tx = isMob ? 0 : lerp(stageW * 0.12, 0, eg);
      // grow: hold top-aligned;  pan: slide from top-aligned → bottom-aligned
      var ty = tyTopNow + (tyBotFull - tyTopFull) * ep;

      // Initial pose: fairly FLAT, tipped down and turned so it angles toward
      // the RIGHT (right edge nearer the viewer), easing to square as it
      // settles into place. Mobile skips the tilt entirely (loads flat).
      var rx = isMob ? 0 : lerp(10, 0, eg);  // gentle downward tilt
      var ry = isMob ? 0 : lerp(-13, 0, eg); // turn → right edge forward
      var rz = isMob ? 0 : lerp(-13, 0, eg); // right side up → upright

      board.style.transform =
        'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)' +
        ' rotateX(' + rx.toFixed(2) + 'deg)' +
        ' rotateY(' + ry.toFixed(2) + 'deg)' +
        ' rotateZ(' + rz.toFixed(2) + 'deg)' +
        ' scale(' + s.toFixed(4) + ')';

      // ---- Per-column parallax --------------------------------------------
      //  (a) while small / growing: gentle scroll drift that fades out by full
      //      size so the grow reads as one clean unit.
      //  (b) once FULL SIZE (during the pan): a subtle divergence — adjacent
      //      columns ease apart in alternating directions as you scroll, then
      //      resettle. Fades to zero by the end of the pan so the
      //      bottom-aligned reveal stays perfectly clean.
      var Q = clamp((vh - srect.top) / (vh + srect.height), 0, 1);
      var growDrift = 1 - eg;
      var fullDrift = eg * Math.sin(clamp(panT, 0, 1) * Math.PI);
      // Phone screens get a more pronounced column drift than desktop/website.
      var catAmp = section.classList.contains('sc-cat-mobile') ? 1.45 : 1;
      cols.forEach(function (c) {
        var dir = parseFloat(c.getAttribute('data-dir')) || 0;
        var vGrow = dir * (Q - 0.5) * 2 * ampVisual * catAmp * growDrift;   // screen px
        var vFull = dir * ampFull * catAmp * fullDrift;                     // screen px
        var visual = vGrow + vFull;
        c.style.transform = 'translate3d(0,' + (visual / s).toFixed(1) + 'px,0)';
      });
    };
    update();
  }

  function onScroll() { if (update) update(); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Floating category menu ------------------------------------------
     Switches the visible content (Websites / Desktop Apps / Mobile) and
     snaps the user back to the spot where the collage becomes full-screen
     so each category opens from its top. Desktop Apps & Mobile are empty
     placeholders for now (handled by the .sc-cat-* CSS). */
  function selectCategory(cat) {
    section.classList.remove('sc-cat-websites', 'sc-cat-desktop', 'sc-cat-mobile');
    section.classList.add('sc-cat-' + cat);
    if (board) board.scrollLeft = 0;   // reset the mobile swipe carousel back to the start
    if (menu) {
      [].slice.call(menu.querySelectorAll('.sc-menu__item')).forEach(function (b) {
        var on = b.getAttribute('data-sc-cat') === cat;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    if (emptyLabel) {
      emptyLabel.textContent =
        cat === 'desktop' ? 'Desktop Apps' : cat === 'mobile' ? 'Mobile' : 'Websites';
    }
    // Re-measure for the now-visible category's columns (board height differs),
    // then snap to the full-screen-top spot so the new category opens from top.
    fitAllTiles();
    setup();
    if (update && fullViewY) {
      window.scrollTo({ top: Math.round(fullViewY), behavior: 'smooth' });
    }
  }
  if (menu) {
    menu.addEventListener('click', function (e) {
      var btn = e.target.closest('.sc-menu__item');
      if (!btn) return;
      selectCategory(btn.getAttribute('data-sc-cat'));
    });
  }
  section.classList.add('sc-cat-mobile');

  /* ---- Native-ratio masonry --------------------------------------------
     Each tile sizes to the screenshot dropped into it, so tall / square /
     wide captures are all shown whole. We read the slot's (open) shadow
     <img> natural dimensions once it loads, clamp the ratio so one extreme
     capture can't make a column absurdly tall (or wide), and write an
     inline aspect-ratio that overrides the placeholder class default.
     Empty slots fall back to their class ratio. After any change we
     re-measure the board via setup(). */
  var MIN_AR = 0.42;   // tallest allowed (≈ portrait phone, fully shown)
  var MAX_AR = 2.40;   // widest allowed (very wide desktop strip)
  var arRT;
  function scheduleSetup() { clearTimeout(arRT); arRT = setTimeout(setup, 120); }

  function fitTile(slot) {
    // The screenshot fills .shot__view; the chrome bar sits above it. We set
    // the native ratio on the VIEW so the tile = bar + image (image never
    // squished by the bar's height).
    var view = slot.closest && slot.closest('.shot__view');
    if (!view) return;
    var img = slot.shadowRoot && slot.shadowRoot.querySelector('.frame img');
    var apply = function () {
      var filled = slot.hasAttribute('data-filled');
      if (filled && img && img.naturalWidth && img.naturalHeight) {
        var ar = clamp(img.naturalWidth / img.naturalHeight, MIN_AR, MAX_AR);
        view.style.aspectRatio = ar.toFixed(4);
      } else {
        view.style.aspectRatio = '';   // back to placeholder class default
      }
      scheduleSetup();
    };
    if (img && !img.__arHooked) { img.__arHooked = true; img.addEventListener('load', apply); }
    apply();
  }

  function fitAllTiles() {
    [].slice.call(section.querySelectorAll('.shot image-slot')).forEach(fitTile);
  }

  // data-filled flips on drop and on clear → re-fit that tile.
  [].slice.call(section.querySelectorAll('.shot image-slot')).forEach(function (slot) {
    new MutationObserver(function () { fitTile(slot); })
      .observe(slot, { attributes: true, attributeFilter: ['data-filled'] });
  });
  fitAllTiles();
  window.addEventListener('load', fitAllTiles);
  setTimeout(fitAllTiles, 600);

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setup, 160); });

  setup();
  window.addEventListener('load', setup);
  setTimeout(setup, 600);   // re-measure after fonts / slots settle

  /* ---- Lead-in: draw the connector line, then fade up the title +
     description, once the lead block scrolls into view. ---- */
  (function () {
    if (!lead) return;
    if (reduce || !('IntersectionObserver' in window)) { lead.classList.add('lead-in'); return; }
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { lead.classList.add('lead-in'); lio.disconnect(); }
      });
    }, { threshold: 0.2 });
    lio.observe(lead);
  })();

  /* ---- Mobile swipe hint: a dark toast over the carousel that appears when
     the section scrolls into view, holds ~2s, then fades. Dismisses early on
     first swipe/scroll. Mobile only. ---- */
  (function () {
    var hint = section.querySelector('.sc-swipehint');
    if (!hint) return;
    if (!window.matchMedia('(max-width: 820px)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    var board = section.querySelector('.showcase__board');
    var hideT;
    function dismiss() { clearTimeout(hideT); hint.classList.remove('is-on'); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        hint.classList.add('is-on');
        hideT = setTimeout(function () { hint.classList.remove('is-on'); }, 2000);
        if (board) {
          board.addEventListener('touchstart', dismiss, { passive: true, once: true });
          board.addEventListener('scroll', dismiss, { passive: true, once: true });
        }
      });
    }, { threshold: 0.35 });
    io.observe(track || section);
  })();
})();
