/*
 * Share buttons on the embed's Next Steps page (embed/next-steps/).
 *
 * SHARE_URL is the address people share: the genio.co page that hosts the embed.
 */
(function () {
  var SHARE_URL = 'https://genio.co/accessibility-lab';
  var SUBJECT = 'Try the Reverse Accessibility Lab';
  var BODY = 'Fifteen minutes in the Reverse Accessibility Lab will change the questions you ask about the tools students use. Try it: ' + SHARE_URL;

  var linkedin = document.querySelector('[data-share="linkedin"]');
  var email = document.querySelector('[data-share="email"]');
  var copy = document.querySelector('[data-share="copy"]');
  var status = document.querySelector('.ns-share-status');

  if (linkedin) {
    linkedin.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(SHARE_URL);
  }
  if (email) {
    email.href = 'mailto:?subject=' + encodeURIComponent(SUBJECT) + '&body=' + encodeURIComponent(BODY);
  }

  function say(msg) {
    if (!status) return;
    status.textContent = '';
    // Re-set after a tick so screen readers announce repeated messages.
    setTimeout(function () { status.textContent = msg; }, 50);
  }

  // Fallback for iframes where the Clipboard API is blocked: copy from a temporary text field.
  function legacyCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    field.remove();
    return ok;
  }

  if (copy) {
    copy.addEventListener('click', function () {
      var done = function () { say('Link copied: ' + SHARE_URL); };
      var fail = function () {
        if (legacyCopy(SHARE_URL)) done();
        else say('Couldn’t copy automatically. The link is ' + SHARE_URL);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(done, fail);
      } else {
        fail();
      }
    });
  }
})();
