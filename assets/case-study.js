/* ============================================================
   CASE STUDY — shared scrollytelling engine
   ------------------------------------------------------------
   Drives EVERY case-study page. Generic: it binds to structural
   hooks, not content — one pinned heading column on the left,
   continuous scenes on the right, headings cross-fade scene to
   scene, a top progress bar fills with scroll, and the final
   pinned heading hands off to the closing static row.

   Required structure on each page (see Moneytree.html /
   accutech-design.html for the canonical markup):
     <section class="cs-scrolly" data-scrolly> …
       .cs-scrolly__left  > .cs-sticky > .cs-headstack >
                            .cs-headstack__item[data-head]
       .cs-scrolly__right > .cs-scene[data-scene]
     <section id="cs-closing"> .cs-static__head        (optional)

   Edit here to change scroll behaviour for ALL case studies.
   Pair with assets/case-study.css.
   ============================================================ */
(function () {
  var block = document.querySelector('[data-scrolly]');
  if (!block) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rail = document.querySelector('.cs-rail');
  var railFill = rail && rail.querySelector('.cs-rail__fill');
  var sticky = block.querySelector('.cs-sticky');
  var heads = Array.prototype.slice.call(block.querySelectorAll('.cs-headstack__item'));
  var scenes = Array.prototype.slice.call(block.querySelectorAll('.cs-scene'));
  /* The closing static row the pinned heading hands off to. Supports the
     legacy #cs-lowfi id and the generic #cs-closing id. */
  var closing = document.getElementById('cs-closing') || document.getElementById('cs-lowfi');
  var closingHead = closing && closing.querySelector('.cs-static__head');

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  function update() {
    var vh = window.innerHeight;
    var mobile = window.matchMedia('(max-width: 920px)').matches;

    if (mobile) {
      sticky.style.top = '';
      heads.forEach(function (h) { h.classList.add('is-active'); });
      scenes.forEach(function (s) { s.classList.remove('is-dim'); });
    } else {
      /* Pin the heading column near the top (below the nav), not centred,
         so there's less empty space above it and more room for content. */
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
      sticky.style.top = Math.round(Math.max(navH + 122, vh * 0.23)) + 'px';

      /* Active scene → cross-fade to that scene's heading. */
      var focus = vh * 0.42;
      var ai = 0, best = Infinity, contained = false;
      scenes.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= focus && r.bottom >= focus) { ai = i; contained = true; }
        else if (!contained) {
          var d = Math.min(Math.abs(r.top - focus), Math.abs(r.bottom - focus));
          if (d < best) { best = d; ai = i; }
        }
      });
      heads.forEach(function (h, i) { h.classList.toggle('is-active', i === ai); });
      scenes.forEach(function (s, i) {
        s.classList.toggle('is-dim', !reduce && s.classList.contains('cs-scene--text') && i !== ai);
      });
    }

    /* Hand-off to the final static row: the pinned last heading slides DOWN to
       meet the incoming closing heading and cross-fades with it in place; then
       the page scrolls normally. */
    if (closingHead) {
      if (mobile) {
        sticky.style.opacity = '';
        sticky.style.transform = '';
        closingHead.style.opacity = '';
      } else {
        var lhT = closingHead.getBoundingClientRect().top;
        /* progress as the closing heading rises from ~0.70vh to ~0.36vh */
        var t = clamp((vh * 0.70 - lhT) / (vh * 0.34));
        if (t > 0) {
          var slideP = clamp(t / 0.82);
          var fade = clamp((t - 0.82) / 0.18);
          sticky.style.transform = '';
          var base = sticky.getBoundingClientRect().top;
          sticky.style.transform = 'translateY(' + (slideP * (lhT - base)).toFixed(1) + 'px)';
          sticky.style.opacity = (1 - fade).toFixed(3);
          closingHead.style.opacity = fade.toFixed(3);
        } else {
          sticky.style.transform = '';
          sticky.style.opacity = '1';
          closingHead.style.opacity = '0';
        }
      }
    }

    /* Top bar — fills with overall scroll progress, starting immediately. */
    if (rail && railFill) {
      var endEl = closing || block;
      var lb = endEl.getBoundingClientRect();
      var bottom = lb.bottom + window.scrollY;     /* document Y of region end */
      var p = clamp(window.scrollY / Math.max(1, bottom - vh));
      railFill.style.setProperty('--p', p.toFixed(3));
      rail.classList.toggle('is-on', window.scrollY > 8 && !mobile);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
  setTimeout(update, 600);

  /* Footer year — every case study has it. */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
