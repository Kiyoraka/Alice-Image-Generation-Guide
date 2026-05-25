/* ============================================================
   Alice Image Generation — The Guided Tour
   Deck engine: render, navigate (buttons / arrow keys / swipe),
   build the cumulative "prompt so far" panel, progress dots.
   Slide content lives in slides.js (window.SLIDES) — this file
   is pure mechanism, no teaching content.
   ============================================================ */
(function () {
  'use strict';

  var SLIDES = window.SLIDES || [];
  var TOTAL = SLIDES.length;
  var idx = 0;

  var stage   = document.getElementById('stage');
  var dotsEl  = document.getElementById('dots');
  var counter = document.getElementById('counter');
  var prevBtn = document.getElementById('prev');
  var nextBtn = document.getElementById('next');

  // ---- prompt panel: collect fragment lines for a track up to index i ----
  // Returns { lines: [...all lines...], newCount: <lines added by slide i> }
  function promptUpTo(track, i) {
    var lines = [], newCount = 0;
    for (var s = 0; s <= i; s++) {
      var sl = SLIDES[s];
      if (!sl || sl.track !== track) continue;
      var frag = sl.fragment;
      if (frag && frag.lines && frag.lines.length) {
        if (s === i) newCount = frag.lines.length;
        for (var k = 0; k < frag.lines.length; k++) lines.push(frag.lines[k]);
      } else if (s === i) {
        newCount = 0;
      }
    }
    return { lines: lines, newCount: newCount };
  }

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderPanel(slide) {
    var pr = promptUpTo(slide.track, idx);
    var html = '<div class="promptpanel-label"><span class="dot"></span>prompt so far</div>';
    html += '<div class="promptpanel-body">';
    if (!pr.lines.length) {
      html += '<span class="pp-empty">empty — watch it fill as we walk the pipeline ↓</span>';
    } else {
      var firstNew = pr.lines.length - pr.newCount;
      for (var i = 0; i < pr.lines.length; i++) {
        var cls = (i >= firstNew && pr.newCount > 0) ? ' is-new' : '';
        html += '<span class="pp-line' + cls + '">' + esc(pr.lines[i]) + '</span>';
      }
    }
    html += '</div>';
    if (slide.promptDone) html += '<div class="pp-final">✓ prompt complete — ' + pr.lines.length + ' parts assembled</div>';
    return html;
  }

  function renderMeta(slide) {
    var rows = slide.meta || [];
    var html = '<div class="meta-card">';
    for (var i = 0; i < rows.length; i++) {
      var okCls = rows[i][2] === 'ok' ? ' ok' : '';
      html += '<div class="row"><span class="k">' + esc(rows[i][0]) + '</span>' +
              '<span class="v' + okCls + '">' + esc(rows[i][1]) + '</span></div>';
    }
    html += '</div>';
    return html;
  }

  function render() {
    var slide = SLIDES[idx];
    if (!slide) return;
    var layout = slide.layout || 'split';
    var kind = slide.kind || 'step';

    var html = '<article class="slide slide--' + layout + '">';
    html += '<div class="slide-head">';
    if (slide.badge) html += '<span class="badge badge--' + kind + '">' + esc(slide.badge) + '</span>';
    if (slide.title) html += '<h2 class="slide-title">' + slide.title + '</h2>';
    if (slide.lead)  html += '<p class="slide-lead">' + slide.lead + '</p>';
    html += '</div>';

    html += '<div class="slide-cols">';
    if (layout === 'result') {
      html += '<div><img class="result-img" src="' + slide.image + '" alt="' + esc(slide.caption || 'rendered image') + '">';
      if (slide.caption) html += '<div class="result-cap">' + slide.caption + '</div>';
      html += '</div>';
      html += '<div>' + renderMeta(slide) + '</div>';
    } else {
      html += '<div class="slide-teach">' + (slide.body || '') + '</div>';
      if (layout !== 'full') {
        html += '<aside class="promptpanel">' + renderPanel(slide) + '</aside>';
      }
    }
    html += '</div></article>';

    stage.innerHTML = html;
    updateNav();
    if (location.hash !== '#' + idx) {
      history.replaceState(null, '', '#' + idx);
    }
    stage.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function updateNav() {
    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === TOTAL - 1);
    counter.textContent = (idx + 1) + ' / ' + TOTAL;
    // dots
    var d = '';
    for (var i = 0; i < TOTAL; i++) {
      var tr = SLIDES[i].track;
      var trCls = tr === 'raya' ? ' track-raya' : (tr === 'naruto' ? ' track-naruto' : '');
      d += '<span class="dot' + trCls + (i === idx ? ' on' : '') + '" data-i="' + i + '" title="' +
           esc((SLIDES[i].badge || '') + ' — ' + (SLIDES[i].titlePlain || '')) + '"></span>';
    }
    dotsEl.innerHTML = d;
  }

  function go(n) {
    if (n < 0) n = 0;
    if (n > TOTAL - 1) n = TOTAL - 1;
    if (n === idx) return;
    idx = n;
    render();
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  // ---- events ----
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  dotsEl.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.classList.contains('dot')) go(parseInt(t.getAttribute('data-i'), 10));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(TOTAL - 1); }
  });

  // touch swipe
  var tx = 0, ty = 0;
  document.addEventListener('touchstart', function (e) {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    var n = parseInt(location.hash.replace('#', ''), 10);
    if (!isNaN(n) && n !== idx) go(n);
  });

  // ---- boot ----
  var start = parseInt(location.hash.replace('#', ''), 10);
  if (!isNaN(start) && start >= 0 && start < TOTAL) idx = start;
  if (TOTAL === 0) {
    stage.innerHTML = '<article class="slide"><p>No slides loaded.</p></article>';
  } else {
    render();
  }
})();
