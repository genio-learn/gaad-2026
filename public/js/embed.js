/*
 * Embed mode for the challenge rooms.
 *
 * Active only when the page URL has ?embed=1 (the embed flow at /embed/ links to rooms that way).
 * Without it this script does nothing, so the normal site is unaffected.
 *
 * Loaded as a normal (blocking) script in <head> so the `embed` class is on <html> before
 * first paint, which avoids a flash of the full-site header and footer. In embed mode it:
 *   - adds the `embed` class to <html> (css/room-embed.css hides the "← Lab" link, footer and top dots)
 *   - adds a bottom bar: ← Previous · "Room N of 5" with dots · Next →
 *   - keeps the success popup's "Continue" link in embed mode and removes "Back to the Lab"
 *
 * The room number comes from <body data-room="N">. The final code page uses <body data-room="final">:
 * its bar has ← Previous (Room 5), all five dots filled, and ↻ Restart (back to the start of the embed).
 *
 * Also, on any page:
 *   - <link data-embed-only media="not all"> stylesheets are switched on (media="all")
 *   - links with data-embed-href get that href instead, to stay inside the embed
 */
(function () {
  if (!new URLSearchParams(window.location.search).has('embed')) return;

  document.documentElement.classList.add('embed');

  // Stylesheets that only apply in embed mode. This script runs in <head> after them.
  document.querySelectorAll('link[data-embed-only]').forEach(function (l) {
    l.media = 'all';
  });

  var TOTAL_ROOMS = 5;
  var EMBED = '?embed=1';

  // Circular "restart" arrow, based on Lucide's "rotate-ccw" (ISC licence).
  var RESTART_ICON =
    '<svg class="room-flow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

  function roomUrl(n) {
    return '../' + n + '/' + EMBED;
  }

  function link(className, href, label, html) {
    var a = document.createElement('a');
    a.className = className;
    a.href = href;
    a.setAttribute('aria-label', label);
    a.innerHTML = html;
    return a;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[data-embed-href]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('data-embed-href'));
    });

    var isFinal = document.body.dataset.room === 'final';
    var room = isFinal ? TOTAL_ROOMS + 1 : Number(document.body.dataset.room);
    if (!room) return;

    // Previous: Room 1 goes back to the "How it works" page of the embed flow; the final page back to Room 5.
    var prev = isFinal
      ? link('btn-secondary room-flow-prev', '../rooms/' + TOTAL_ROOMS + '/' + EMBED, 'Previous: Room ' + TOTAL_ROOMS,
             '<span aria-hidden="true">←</span> Previous')
      : room === 1
      ? link('btn-secondary room-flow-prev', '../../embed/how-it-works/', 'Previous: How it works',
             '<span aria-hidden="true">←</span> Previous')
      : link('btn-secondary room-flow-prev', roomUrl(room - 1), 'Previous: Room ' + (room - 1),
             '<span aria-hidden="true">←</span> Previous');

    // Next: Room 5 goes on to the final code page. The final page has Restart instead, back to the embed's start.
    var next = isFinal
      ? link('btn-secondary room-flow-next room-flow-restart', '../embed/', 'Restart the challenge from the beginning',
             RESTART_ICON + ' Restart')
      : room === TOTAL_ROOMS
      ? link('btn-primary room-flow-next', '../../final/' + EMBED, 'Next: Enter your final code',
             'Next <span aria-hidden="true">→</span>')
      : link('btn-primary room-flow-next', roomUrl(room + 1), 'Next: Room ' + (room + 1),
             'Next <span aria-hidden="true">→</span>');

    var progress = document.createElement('div');
    progress.className = 'room-flow-progress';
    var dots = '';
    for (var i = 1; i <= TOTAL_ROOMS; i++) {
      dots += '<span class="room-flow-dot' + (i < room ? ' is-done' : '') + (i === room ? ' is-current' : '') + '"></span>';
    }
    progress.innerHTML =
      '<span class="room-flow-dots" aria-hidden="true">' + dots + '</span>' +
      '<span class="room-flow-count">' + (isFinal ? 'Final code' : 'Room ' + room + ' of ' + TOTAL_ROOMS) + '</span>';

    // A div with role="navigation" rather than <nav>: rooms.css deliberately disables
    // mouse clicks on every `nav a`, and these buttons must always work.
    var bar = document.createElement('div');
    bar.className = 'room-flow';
    bar.id = 'room-flow';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Challenge rooms');
    bar.append(prev, progress, next);

    var main = document.querySelector('main');
    if (main) main.append(bar);

    // Success popup: stay in the embed flow, and drop the link back to the full-site Lab.
    document.querySelectorAll('.modal .btn-next').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href') + EMBED);
    });
    document.querySelectorAll('.modal .btn-back').forEach(function (a) {
      a.remove();
    });
  });
})();
