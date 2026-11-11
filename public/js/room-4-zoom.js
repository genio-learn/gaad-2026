/*
 * Room 4, embed mode only: a simulated browser zoom for the report.
 *
 * Why: Room 4 is about reflow. On the full site, zooming in narrows the page in CSS pixels until the
 * report drops below its 960px breakpoint and its three columns stack, un-clipping the hidden button.
 * An embed is already narrower than that, so the report would start stacked and there'd be nothing to find.
 *
 * What it does: wraps the report in a simulated 1280px-wide "screen" with Zoom out / Zoom in / Reset.
 * At each zoom level the report is laid out at the width it would have on that screen (screen width / zoom,
 * capped by the room's 1060px content width, minus page padding), then scaled with CSS `zoom` to fit the
 * embed. `is-reflowed` is set when the simulated screen is 960px or narrower, which is when the full site's
 * media queries would stack the columns (see the embed rules at the end of css/room-4.css).
 *
 * Keyboard zoom shortcuts (Ctrl/Cmd and +) aren't used: inside an iframe the browser handles them
 * and zooms the whole host page. If someone does zoom the host page, that still counts here: it is
 * folded in through devicePixelRatio.
 */
(function () {
  if (!document.documentElement.classList.contains('embed')) return;

  var SCREEN_WIDTH = 1280;   // simulated laptop screen, in CSS px at 100% zoom
  var MAIN_MAX_WIDTH = 1060; // room-4.css: main { max-width }
  var REFLOW_AT = 960;       // room-4.css: @media (max-width: 960px)
  var NARROW_AT = 560;       // room-4.css: @media (max-width: 560px), where main padding shrinks
  var STEPS = [100, 125, 150, 175, 200, 250, 300, 400];

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.querySelector('.report-banner');
    var grid = document.querySelector('.report-grid');
    if (!banner || !grid) return;

    var step = 0;
    var baseDpr = window.devicePixelRatio || 1;

    var sim = document.createElement('div');
    sim.className = 'zoom-sim';
    sim.setAttribute('role', 'group');
    sim.setAttribute('aria-labelledby', 'zoom-sim-label');
    sim.innerHTML =
      '<div class="zoom-bar">' +
        '<span class="zoom-bar-label" id="zoom-sim-label">Simulated browser zoom</span>' +
        '<div class="zoom-controls">' +
          '<button type="button" class="zoom-btn" data-zoom="out"><span aria-hidden="true">−</span> Zoom out</button>' +
          '<output class="zoom-level" aria-live="polite">100%</output>' +
          '<button type="button" class="zoom-btn" data-zoom="in"><span aria-hidden="true">+</span> Zoom in</button>' +
          '<button type="button" class="zoom-btn zoom-reset" data-zoom="reset">Reset</button>' +
        '</div>' +
      '</div>' +
      '<div class="zoom-viewport"><div class="zoom-canvas"></div></div>';

    banner.parentNode.insertBefore(sim, banner);
    var viewport = sim.querySelector('.zoom-viewport');
    var canvas = sim.querySelector('.zoom-canvas');
    canvas.append(banner, grid);

    var level = sim.querySelector('.zoom-level');
    var outBtn = sim.querySelector('[data-zoom="out"]');
    var inBtn = sim.querySelector('[data-zoom="in"]');

    function layout() {
      var realZoom = (window.devicePixelRatio || 1) / baseDpr;
      var zoom = (STEPS[step] / 100) * realZoom;
      var screen = SCREEN_WIDTH / zoom;                       // simulated viewport width in CSS px
      var padding = screen <= NARROW_AT ? 40 : 64;            // main's side padding at that width
      var reportWidth = Math.min(screen, MAIN_MAX_WIDTH) - padding;
      var available = viewport.clientWidth;
      if (!available) return;

      canvas.style.width = reportWidth + 'px';
      canvas.style.zoom = String(available / reportWidth);
      canvas.classList.toggle('is-reflowed', screen <= REFLOW_AT);

      level.textContent = STEPS[step] + '%';
      outBtn.setAttribute('aria-disabled', String(step === 0));
      inBtn.setAttribute('aria-disabled', String(step === STEPS.length - 1));
    }

    function setStep(next) {
      step = Math.max(0, Math.min(STEPS.length - 1, next));
      layout();
    }

    sim.querySelector('.zoom-controls').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-zoom]');
      if (!btn) return;
      var action = btn.getAttribute('data-zoom');
      if (action === 'in') setStep(step + 1);
      else if (action === 'out') setStep(step - 1);
      else setStep(0);
    });

    if (window.ResizeObserver) new ResizeObserver(layout).observe(viewport);
    window.addEventListener('resize', layout);
    layout();
  });
})();
