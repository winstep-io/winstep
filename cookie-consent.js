/* ============================================================
   winstep.io — Cookie consent banner (GEO-AWARE)
   - EU / UK / EEA / CH  -> full opt-in CMP: Accept All / Reject All
     (UNCHANGED from the previous version — the compliant banner).
   - Everywhere else (US, etc.) -> light opt-out bar: "Got it" +
     "Your Privacy Choices" (opt out to non-personalized ads).
   - Region comes from /api/geo (Vercel edge header). If detection
     fails or is unknown, we SAFELY fall back to the EU banner.
   - Google Consent Mode v2 default = denied for everyone (unchanged),
     so GA / AdSense respect the choice automatically.
   - Choice stored per browser (localStorage). "Cookie Settings" link
     re-opens the banner via window.winstepConsent.open().
   - TEST without a VPN:  ?geo=us  or  ?geo=eu  forces a region.

   Place <script src="/cookie-consent.js"></script> in <head> of every
   page, ABOVE the Google Analytics / AdSense tag.
   Requires the edge function at /api/geo.js (returns {"country":"US"}).
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'winstep_cookie_consent'; // 'accepted' | 'rejected'

  // Countries that get the strict opt-in banner: EU-27 + EEA + UK + Switzerland.
  var STRICT = {
    AT:1,BE:1,BG:1,HR:1,CY:1,CZ:1,DK:1,EE:1,FI:1,FR:1,DE:1,GR:1,HU:1,IE:1,IT:1,
    LV:1,LT:1,LU:1,MT:1,NL:1,PL:1,PT:1,RO:1,SK:1,SI:1,ES:1,SE:1,   // EU-27
    IS:1,LI:1,NO:1,                                                // EEA
    GB:1,                                                          // UK
    CH:1                                                           // Switzerland
  };

  // ---- Google Consent Mode v2 plumbing (ready for GA / AdSense) ----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  // Default = everything denied (must run before GA/AdSense load).
  // With ad_storage denied, AdSense auto-serves NON-personalized ads.
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

  // ---- region detection ----
  var _region = null; // 'eu' | 'us'  (cached after first detect)

  function regionFromCountry(cc) {
    return (cc && STRICT[cc]) ? 'eu' : 'us';
  }

  function detectRegion(cb) {
    if (_region) { cb(_region); return; }

    // test override: ?geo=us / ?geo=eu
    try {
      var q = (new URLSearchParams(window.location.search)).get('geo');
      if (q) { _region = (q.toLowerCase() === 'eu') ? 'eu' : 'us'; cb(_region); return; }
    } catch (e) {}

    // ask our own edge function; on ANY problem fall back to EU (strict/safe)
    var done = false;
    var finish = function (r) { if (done) return; done = true; _region = r; cb(r); };
    try {
      var t = setTimeout(function () { finish('eu'); }, 1500); // network stall -> safe default
      fetch('/api/geo', { cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (d) { clearTimeout(t); finish(regionFromCountry(d && d.country)); })
        .catch(function () { clearTimeout(t); finish('eu'); });
    } catch (e) { finish('eu'); }
  }

  // ---- shared helpers ----
  function removeBanner() {
    var el = document.getElementById('ws-cookie-banner');
    if (el) el.remove();
  }
  function choose(state) {
    try { localStorage.setItem(KEY, state); } catch (e) {}
    applyConsent(state);
    removeBanner();
    try { window.dispatchEvent(new CustomEvent('winstep:consent', { detail: { state: state } })); } catch (e) {}
  }

  // ---- EU / UK banner (UNCHANGED — full opt-in, Accept All / Reject All) ----
  function buildEUBanner() {
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
          '🍪 Winstep is completely free for everyone, and ads are our only source of income. ' +
          'Accepting cookies helps us keep it that way — but the choice is yours. Thank you for understanding! ' +
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

  // ---- US (and rest-of-world) light bar (opt-out model) ----
  function buildUSBanner() {
    if (document.getElementById('ws-cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'ws-cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie notice');
    b.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:99999;' +
      'background:#0e1614;border-top:1px solid rgba(46,196,182,.25);' +
      'box-shadow:0 -8px 30px rgba(0,0,0,.45);padding:12px 20px;' +
      "font-family:Rajdhani,'Segoe UI',sans-serif;color:#c9d4d1";
    b.innerHTML =
      '<div style="max-width:1000px;margin:0 auto;display:flex;align-items:center;' +
      'gap:16px;flex-wrap:wrap;justify-content:center">' +
        '<div style="flex:1;min-width:220px;font-size:.9rem;line-height:1.5">' +
          '🍪 We use cookies to keep winstep free and support the site. ' +
          '<a href="/privacy.html" target="_blank" rel="noopener" ' +
          'style="color:#2ec4b6;text-decoration:underline">Privacy Policy</a>' +
        '</div>' +
        '<div style="display:flex;gap:14px;align-items:center;flex-shrink:0;flex-wrap:wrap;justify-content:center">' +
          '<a id="ws-cookie-optout" href="#" ' +
          'style="color:#9fb5b0;text-decoration:underline;font-size:.86rem;cursor:pointer">' +
          'Your Privacy Choices</a>' +
          '<button id="ws-cookie-gotit" type="button" ' +
          'style="padding:10px 24px;background:#2ec4b6;border:1.5px solid #2ec4b6;' +
          "color:#0a1413;border-radius:10px;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer\">" +
          'Got it</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    // "Got it" = accept (US opt-out allows personalized by default, one tap)
    document.getElementById('ws-cookie-gotit').onclick = function () { choose('accepted'); };
    // "Your Privacy Choices" = open the full Accept All / Reject All choices
    document.getElementById('ws-cookie-optout').onclick = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      removeBanner();
      buildChoices();
    };
  }

  // Full choices card (Reject All / Reject All) — opened from "Your Privacy Choices".
  // Neutral wording so it fits both the US opt-out path and a re-opened EU choice.
  function buildChoices() {
    if (document.getElementById('ws-cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'ws-cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Privacy choices');
    b.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:99999;' +
      'background:#0e1614;border-top:1px solid rgba(46,196,182,.25);' +
      'box-shadow:0 -8px 30px rgba(0,0,0,.45);padding:16px 20px;' +
      "font-family:Rajdhani,'Segoe UI',sans-serif;color:#c9d4d1";
    b.innerHTML =
      '<div style="max-width:1000px;margin:0 auto;display:flex;align-items:center;' +
      'gap:18px;flex-wrap:wrap;justify-content:center">' +
        '<div style="flex:1;min-width:240px;font-size:.92rem;line-height:1.5">' +
          '🍪 Choose how winstep uses cookies. Accept for a personalized experience, ' +
          'or reject non-essential cookies — the site stays free either way. ' +
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

  function showBanner(region) {
    if (region === 'us') buildUSBanner(); else buildEUBanner();
  }

  function showBannerIfNeeded() {
    if (stored === 'accepted' || stored === 'rejected') return; // already chose
    detectRegion(showBanner);
  }

  // ---- Public API (for the "Cookie Settings" footer link) ----
  window.winstepConsent = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    // re-open the region-appropriate banner to change the choice anytime
    open: function () { removeBanner(); detectRegion(showBanner); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBannerIfNeeded);
  } else {
    showBannerIfNeeded();
  }
})();
