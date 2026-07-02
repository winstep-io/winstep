/* ============================================================
   winstep.io — Cookie consent banner (EU / GDPR)
   - Accept All / Reject All (both clearly visible — compliant)
   - Variant B: Reject -> non-personalized (contextual) ads, not zero
   - Google Consent Mode v2: when GA / AdSense are added later, they
     automatically respect this choice (no extra wiring needed).
   - Choice stored per browser (localStorage). "Cookie Settings" link
     re-opens the banner via window.winstepConsent.open().
   Place <script src="/cookie-consent.js"></script> in <head> of every
   page, ABOVE the Google Analytics / AdSense tag (when you add them).
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'winstep_cookie_consent'; // 'accepted' | 'rejected'

  // ---- Google Consent Mode v2 plumbing (ready for GA / AdSense) ----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  // Default = everything denied (must run before GA/AdSense load).
  // With ad_storage denied, AdSense auto-serves NON-personalized ads (variant B).
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function applyConsent(state) {
    var granted = (state === 'accepted');
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage:        granted ? 'granted' : 'denied',
      ad_user_data:      granted ? 'granted' : 'denied',
      ad_personalization:granted ? 'granted' : 'denied'
    });
    // Simple flag any ad-loading code can read: true = personalized, false = contextual
    window.winstepAds = { personalized: granted };
  }

  // Re-apply a previously saved choice on every page load (no banner re-show)
  if (stored === 'accepted' || stored === 'rejected') {
    applyConsent(stored);
  } else {
    window.winstepAds = { personalized: false }; // safe default until they choose
  }

  // ---- Banner UI ----
  function buildBanner() {
    if (document.getElementById('ws-cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'ws-cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie consent');
    b.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:99999;' +
      'background:#0e1614;border-top:1px solid rgba(46,196,182,.25);' +
      'box-shadow:0 -8px 30px rgba(0,0,0,.45);padding:16px 20px;' +
      "font-family:Rajdhani,'Segoe UI',sans-serif;color:#c9d4d1";
    b.innerHTML =
      '<div style="max-width:1000px;margin:0 auto;display:flex;align-items:center;' +
      'gap:18px;flex-wrap:wrap;justify-content:center">' +
        '<div style="flex:1;min-width:240px;font-size:.92rem;line-height:1.5">' +
          '\uD83C\uDF6A We use cookies to keep you logged in and support our free rewards. ' +
          'Choose your preference below. ' +
          '<a href="/privacy.html" target="_blank" rel="noopener" ' +
          'style="color:#2ec4b6;text-decoration:underline">Privacy Policy</a>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;justify-content:center">' +
          '<button id="ws-cookie-reject" type="button" ' +
          'style="padding:11px 22px;background:transparent;border:1.5px solid rgba(159,181,176,.55);' +
          "color:#c9d4d1;border-radius:10px;font-family:inherit;font-size:.92rem;font-weight:600;cursor:pointer\">" +
          'Reject All</button>' +
          '<button id="ws-cookie-accept" type="button" ' +
          'style="padding:11px 26px;background:#2ec4b6;border:1.5px solid #2ec4b6;' +
          "color:#0a1413;border-radius:10px;font-family:inherit;font-size:.92rem;font-weight:700;cursor:pointer\">" +
          'Accept All</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    document.getElementById('ws-cookie-accept').onclick = function () { choose('accepted'); };
    document.getElementById('ws-cookie-reject').onclick = function () { choose('rejected'); };
  }

  function removeBanner() {
    var el = document.getElementById('ws-cookie-banner');
    if (el) el.remove();
  }

  function choose(state) {
    try { localStorage.setItem(KEY, state); } catch (e) {}
    applyConsent(state);
    removeBanner();
  }

  function showBannerIfNeeded() {
    if (stored !== 'accepted' && stored !== 'rejected') buildBanner();
  }

  // ---- Public API (for the "Cookie Settings" footer link) ----
  window.winstepConsent = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    open: function () { buildBanner(); }  // re-open to change choice anytime
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBannerIfNeeded);
  } else {
    showBannerIfNeeded();
  }
})();
