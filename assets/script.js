/* ============================================================
   TETHER — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- Site nav: glass is always-on (CSS only). No scroll/tint JS needed. ---- */

  /* ---- Reveal on scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function show(el) { el.classList.add('in'); }
  function inView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.92 && r.bottom > 0;
  }
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
    // Immediately reveal anything already on screen (covers IO first-pass misses
    // caused by late-reflowing custom elements like <image-slot>).
    function sweep() { reveals.forEach(function (el) { if (!el.classList.contains('in') && inView(el)) { show(el); ro.unobserve(el); } }); }
    requestAnimationFrame(sweep);
    window.addEventListener('load', sweep);
    setTimeout(sweep, 400);
    // Absolute safety net: never let content stay hidden.
    setTimeout(function () { reveals.forEach(show); }, 2500);
  } else {
    reveals.forEach(show);
  }

  /* ---- Accordion ---- */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.acc');
      var isOpen = item.classList.contains('open');
      // single-open behaviour within the same list
      var list = item.closest('.faq__list') || document;
      list.querySelectorAll('.acc.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- Counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      var shown = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
      el.textContent = prefix + shown + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = (el.dataset.prefix||'') + el.dataset.count + (el.dataset.suffix||''); });
  }

  /* ---- Chat typing loop ---- */
  var chat = document.querySelector('[data-chat]');
  if (chat) {
    var bubbles = Array.prototype.slice.call(chat.querySelectorAll('.bubble'));
    var typingEl = chat.querySelector('[data-typing]');
    var i = 0, started = false;

    function reset() { bubbles.forEach(function (b) { b.classList.remove('show'); }); if (typingEl) typingEl.classList.remove('show'); i = 0; }
    function next() {
      if (i >= bubbles.length) {
        setTimeout(function () { reset(); setTimeout(run, 900); }, 3200);
        return;
      }
      var b = bubbles[i];
      var isOut = b.classList.contains('bubble--out');
      // show typing indicator before an incoming reply
      if (!isOut && typingEl && i > 0) {
        typingEl.classList.add('show');
        setTimeout(function () { typingEl.classList.remove('show'); b.classList.add('show'); i++; setTimeout(next, 1300); }, 1100);
      } else {
        b.classList.add('show'); i++; setTimeout(next, isOut ? 1100 : 1300);
      }
    }
    function run() { next(); }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; setTimeout(run, 500); }
        });
      }, { threshold: 0.4 });
      io.observe(chat);
    } else { run(); }
  }

  /* ---- Hero lead: word-by-word rise, then paragraph follows ---- */
  (function () {
    var lead = document.querySelector('[data-words]');
    if (!lead) return;
    var para = document.querySelector('[data-after]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var step = 0.04; // stagger per word (s)
    var words = lead.textContent.trim().split(/\s+/);
    lead.textContent = '';
    lead.classList.add('words-anim');
    words.forEach(function (word, idx) {
      var w = document.createElement('span'); w.className = 'w';
      var i = document.createElement('i'); i.textContent = word;
      i.style.transitionDelay = (idx * step).toFixed(3) + 's';
      w.appendChild(i);
      lead.appendChild(w);
      lead.appendChild(document.createTextNode(' '));
    });

    var doneAt = words.length * step + 0.6; // when last word has landed (s)
    var buttons = document.querySelector('[data-seq-buttons]');
    var cards = document.querySelector('[data-seq-cards]');
    var played = false;

    function heroDone() { document.dispatchEvent(new CustomEvent('hero:done')); }

    function play() {
      if (played) return; played = true;
      lead.classList.add('in');
      var tPara = doneAt * 1000 + 100;            // paragraph after words land
      var tButtons = tPara;                        // buttons with the paragraph
      var tCards = tButtons + 550;                 // cards after buttons
      if (para)    setTimeout(function () { para.classList.add('in'); }, tPara);
      if (buttons) setTimeout(function () { buttons.classList.add('in'); }, tButtons);
      if (cards)   setTimeout(function () { cards.classList.add('in'); }, tCards);
      // once the last hero element has landed, signal that the hero has loaded
      setTimeout(heroDone, tButtons + 250);
    }

    if (reduce) {
      lead.classList.add('in');
      if (para) para.classList.add('in');
      if (buttons) buttons.classList.add('in');
      if (cards) cards.classList.add('in');
      heroDone();
      return;
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { setTimeout(play, 1000); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(lead);
    } else { setTimeout(play, 1000); }
    // safety: never leave it hidden
    setTimeout(function () { if (!lead.classList.contains('in')) play(); }, 2500);
  })();

  /* ---- Duplicate marquee/ticker tracks for seamless loop ---- */
  document.querySelectorAll('[data-loop]').forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---- Button label roll (Tether-style hover) ---- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    if (btn.querySelector('.btn__roll')) return;
    // Only wrap plain-text buttons; skip if it has element children (e.g. icons).
    if (btn.children.length) return;
    var label = btn.textContent.trim();
    if (!label) return;
    btn.textContent = '';
    var roll = document.createElement('span'); roll.className = 'btn__roll';
    var txt = document.createElement('span'); txt.className = 'btn__txt';
    txt.textContent = label;
    txt.setAttribute('data-text', label);
    roll.appendChild(txt);
    btn.appendChild(roll);
  });

  /* ---- Scroll-driven feature stack ----
     Cards slide up and stack with a peek; once assembled, the whole
     stage scrolls away as one block so the gaps stay intact on exit. */
  // Toggle for the scroll-driven stacking effect. Set to false to show the
  // feature cards as a simple vertical list (page-load flow layout). All the
  // stacking machinery below is preserved — flip this back to true to restore.
  var ENABLE_FEATURE_STACK = false;
  function initFeatureStack() {
    var section = document.querySelector('.features');
    if (!section) return;
    var track = section.querySelector('.features__track');
    var stage = section.querySelector('.features__stage');
    var cardsWrap = section.querySelector('.features__cards');
    var cards = Array.prototype.slice.call(section.querySelectorAll('.feature'));
    var N = cards.length;
    if (!track || !cardsWrap || N === 0) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobile = window.matchMedia('(max-width: 760px)').matches;

    // Reset to flow layout for measuring / fallback.
    section.classList.remove('is-ready');
    track.style.height = '';
    cardsWrap.style.height = '';
    cards.forEach(function (c) { c.style.transform = ''; });
    initFeatureStack._update = null;
    var showcaseEl = document.querySelector('.showcase');
    if (showcaseEl) showcaseEl.style.marginTop = '';

    if (!ENABLE_FEATURE_STACK || mobile || reduce) return; // disabled / mobile / reduced-motion → simple flowing cards

    var peek = parseFloat(getComputedStyle(section).getPropertyValue('--peek')) || 30;
    var H = cards[0].offsetHeight;           // measured in flow state
    var vh = window.innerHeight;
    cardsWrap.style.height = (H + (N - 1) * peek) + 'px';

    var headFrac = 0.10, enterPerCard = 0.62, restFrac = 0.03;
    var extraVh = headFrac + (N - 1) * enterPerCard + restFrac;
    var trackH = Math.round(vh * (1 + extraVh));
    track.style.height = trackH + 'px';
    section.classList.add('is-ready');

    // The showcase used to be pulled up with a negative margin to swallow the
    // empty band below the cards. That made the connector line slide UP under
    // the still-pinned stage (a "moving up toward the card" illusion). The
    // stack is now biased lower in the stage instead, so no pull is needed —
    // the showcase line only appears once the stage releases and then scrolls
    // in lockstep with the cards. Keep margin at 0.
    if (showcaseEl) showcaseEl.style.marginTop = '0px';

    var pinDur = trackH - vh;
    var headPortion = headFrac / extraVh;   // initial reading hold — first card stays alone & readable
    var restPortion = restFrac / extraVh;   // final hold — assembled stack rests before scrolling away
    var stackSpan = 1 - headPortion - restPortion;
    var enterDist = vh * 0.94;
    // Start the stacking animation EARLIER — while the section is still ~50% of
    // a viewport below the top — so the cards begin freezing/stacking right as
    // the nav pill reaches the top of the screen.
    var startLead = vh * 0.5;

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function update() {
      var trackTopDoc = track.getBoundingClientRect().top + window.scrollY;
      var P = (window.scrollY - (trackTopDoc - startLead)) / (pinDur + startLead);
      P = Math.max(0, Math.min(1, P));
      var pStack = Math.max(0, Math.min((P - headPortion) / stackSpan, 1));
      // Hold the first card alone — fully visible & its button clickable — for
      // a short beat after the stack phase begins, before any covering card
      // starts to rise.
      var coverStart = 0.46;
      var span = 1 - coverStart;
      // Overlapping entrance windows: each covering card starts only `stagger`
      // after the previous (smaller than its `dur`), so the 2nd and 3rd cards
      // stack close together instead of one waiting for the other to finish.
      var stagger = 0.34;
      var dur = span - (N - 2) * stagger;     // last card still settles at pStack = 1
      for (var i = 1; i < N; i++) {
        var s = coverStart + (i - 1) * stagger, e = s + dur;
        var t = Math.max(0, Math.min(1, (pStack - s) / (e - s)));
        var off = (1 - ease(t)) * enterDist;
        cards[i].style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      }
      cards[0].style.transform = 'translate3d(0,0,0)';
    }
    initFeatureStack._update = update;
    // Snap the stack to its initial (page-load) state — first card alone,
    // covering cards parked off-screen below. Used while smooth-scrolling
    // upward so the stack doesn't replay in reverse.
    initFeatureStack._reset = function () {
      for (var i = 1; i < N; i++) cards[i].style.transform = 'translate3d(0,' + enterDist.toFixed(1) + 'px,0)';
      cards[0].style.transform = 'translate3d(0,0,0)';
    };
    update();
  }

  function onFeatureScroll() {
    if (!initFeatureStack._frozen && initFeatureStack._update) initFeatureStack._update();
  }
  window.addEventListener('scroll', onFeatureScroll, { passive: true });
  var fsResizeT;
  window.addEventListener('resize', function () { clearTimeout(fsResizeT); fsResizeT = setTimeout(initFeatureStack, 160); });
  initFeatureStack();
  window.addEventListener('load', initFeatureStack);
  setTimeout(initFeatureStack, 800); // re-measure after fonts/images settle

  /* ---- Project Highlights connector + label + feature cards ----
     LINE: grows down on load, after the hero content finishes (kept as-is).
     LABEL + CARDS: reveal on scroll — only after a real scroll AND the label
     is in view (so the heading never animates on page load). ---- */
  (function () {
    var hl = document.querySelector('.hl-head');
    var title = hl && hl.querySelector('.hl-head__title');
    var features = document.querySelector('.features');
    if (!hl && !features) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealCards() { if (features) features.classList.add('cards-in'); }
    function drawLine() { if (hl) hl.classList.add('line-in'); }
    var labelDone = false;
    function revealLabel() {
      if (labelDone) return; labelDone = true;
      cleanup();
      if (hl) hl.classList.add('label-in');
      setTimeout(revealCards, 700);   // cards follow once the label has faded in
    }

    if (reduce) { drawLine(); revealLabel(); return; }

    // line — load-sequenced (after the hero)
    document.addEventListener('hero:done', function () { setTimeout(drawLine, 700); }, { once: true });
    setTimeout(drawLine, 4500);       // fallback if the hero signal is missed

    // label + cards — scroll-gated
    var scrolled = false, inView = !title;
    var io = null;
    function cleanup() { window.removeEventListener('scroll', onScroll); if (io) io.disconnect(); }
    function maybe() { if (scrolled && inView) revealLabel(); }
    function onScroll() { if (window.scrollY > 4) { scrolled = true; maybe(); } }
    if (title && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { inView = true; maybe(); } });
      }, { threshold: 0.6 });
      io.observe(title);
    } else { inView = true; }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---- Mobile menu (simple dropdown) ---- */
  var burger = document.querySelector('.sitebar__burger');
  var sitebar = document.querySelector('.sitebar');
  if (burger && sitebar) {
    burger.addEventListener('click', function () {
      var open = sitebar.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close after tapping a link
    sitebar.querySelectorAll('.sitebar__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        sitebar.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- In-page nav: custom-paced smooth scroll, cover effect OFF ----
     Driven by rAF so we control the SPEED. For ANY menu-initiated scroll the
     feature "cover/stacking" effect is disabled: the stack is frozen + flat
     (page-load state) for the whole glide, then re-synced at the end. Normal
     user scrolling is untouched (nothing is frozen), so the cover effect
     still plays when you scroll by hand. */
  (function () {
    var bar = document.querySelector('.sitebar');
    if (!bar) return;
    var root = document.documentElement;
    var rafId = null, fallbackT = null;

    function easeOut(p) { return 1 - Math.pow(1 - p, 3); }   // gentle, soft landing

    function animateScroll(targetY, onDone) {
      if (rafId) cancelAnimationFrame(rafId);
      if (fallbackT) clearTimeout(fallbackT);
      var maxY = Math.max(0, (root.scrollHeight || document.body.scrollHeight) - window.innerHeight);
      targetY = Math.max(0, Math.min(targetY, maxY));
      var startY = window.scrollY;
      var dist = targetY - startY;
      if (Math.abs(dist) < 2) { onDone && onDone(); return; }
      // Pace: ~0.6px→ms, min 420ms, up to 1200ms for long jumps.
      var dur = Math.min(1200, Math.max(420, Math.abs(dist) * 0.6));
      var prevBehav = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';            // stop CSS smooth layering on
      var done = false;
      function finish() {
        if (done) return; done = true;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (fallbackT) { clearTimeout(fallbackT); fallbackT = null; }
        root.style.scrollBehavior = prevBehav;
        window.scrollTo(0, targetY);
        onDone && onDone();
      }
      var t0 = null;
      function frame(ts) {
        if (done) return;
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        window.scrollTo(0, Math.round(startY + dist * easeOut(p)));
        if (p < 1) { rafId = requestAnimationFrame(frame); }
        else { finish(); }
      }
      rafId = requestAnimationFrame(frame);
      // Safety: if rAF is throttled/paused (e.g. tab hidden), guarantee we
      // still land and run onDone so nothing stays frozen.
      fallbackT = setTimeout(finish, dur + 700);
    }

    bar.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = id === 'top' ? document.body : document.getElementById(id);
        if (!target) return;                 // dead anchor → leave default
        e.preventDefault();
        var features = document.querySelector('.features');
        var fcards = features ? [].slice.call(features.querySelectorAll('.feature')) : [];
        var vh = window.innerHeight;
        var startY = window.scrollY;
        function topFor() {
          return id === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80);
        }
        var naturalTop = topFor();           // target's true resting position (natural layout)

        // No feature stack → plain scroll.
        if (!features || !initFeatureStack._reset) { animateScroll(naturalTop); return; }

        var fTopDoc = features.getBoundingClientRect().top + window.scrollY;
        var fBotDoc = fTopDoc + features.offsetHeight;
        var goingDown = naturalTop > startY;
        // Destination viewport shows the cards (≈ "Case Studies") → fade them in.
        var landsOnFeatures = (naturalTop < fBotDoc - vh * 0.25) && (naturalTop + vh > fTopDoc + 60);
        // Scroll path crosses the section but doesn't land on it → "passing".
        var passesFeatures = !landsOnFeatures &&
          (Math.min(startY, naturalTop) < fBotDoc) && (Math.max(startY, naturalTop) > fTopDoc);

        function freezeFlat() {
          initFeatureStack._frozen = true;
          fcards.forEach(function (c) { c.style.transition = 'none'; });
          initFeatureStack._reset();
          void document.body.offsetHeight;
        }
        function unfreeze() {
          fcards.forEach(function (c) { c.style.transition = ''; });
          initFeatureStack._frozen = false;
          if (initFeatureStack._update) initFeatureStack._update();
        }

        if (landsOnFeatures) {
          // Glide to the cards with the cover effect OFF (cards are always
          // visible — no fade).
          freezeFlat();
          animateScroll(naturalTop, unfreeze);
        } else if (passesFeatures && !goingDown) {
          // Passing UPWARD: freeze flat so the stack doesn't reverse-animate.
          freezeFlat();
          animateScroll(naturalTop, unfreeze);
        } else {
          // Passing DOWNWARD (or no crossing): let the stack play naturally so
          // there's continuous motion — no "stop" on the pinned section.
          animateScroll(naturalTop);
        }
      });
    });
  })();
})();
