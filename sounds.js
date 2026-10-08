/* ============================================================
   winstep.io — Sound engine (Web Audio, no files)
   ------------------------------------------------------------
   გამოყენება:
     <script src="/sounds.js" defer></script>
     winstepSound.play('click');
     winstepSound.play('coin', { n: 10, dur: 620 });   // ხურდის ჩაყრა (n ქულა, dur ms)
   ხმის ჩართვა/გამორთვის ღილაკი header-ში:
     <button data-ws-sound-toggle class="h-btn" aria-label="Sound"></button>

   ხმა default 60%-ზეა (MASTER). ხმის სლაიდერი არ არის — მომხმარებელი
   მოწყობილობიდან არეგულირებს. არჩევანი (on/off) localStorage-შია.
   ============================================================ */
(function () {
  'use strict';

  var AC = window.AudioContext || window.webkitAudioContext;
  var KEY = 'winstep_sound_on';
  var MASTER = 0.8; // ეფექტების საერთო ხმა = 60%

  if (!AC) {
    window.winstepSound = {
      play: function () {}, isOn: function () { return false; },
      toggle: function () {}, on: function () {}, off: function () {},
      setVolume: function () {}, mountToggle: function () {}
    };
    return;
  }

  var enabled = true;
  try { if (localStorage.getItem(KEY) === '0') enabled = false; } catch (e) {}

  var ctx = null;
  function ac() {
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function T() { return ac().currentTime; }

  // ---- synth helpers ----
  // tone — მარტივი attack + exponential decay (Section B/C ტემბრი)
  function tone(t0, type, f0, f1, dur, peak) {
    var c = ac(); var o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    var v = Math.max(peak * MASTER, 0.0002);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  // paper — filtered noise burst (ფურცლის გადაფურცვლა, doubleFlip-ისთვის)
  function paper(t0, dur, peak, f0, f1, q) {
    var c = ac(); var n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) { var env = Math.pow(i / n, 0.5) * Math.pow(1 - i / n, 1.6); d[i] = (Math.random() * 2 - 1) * env; }
    var s = c.createBufferSource(); s.buffer = buf;
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q || 0.9;
    bp.frequency.setValueAtTime(f0, t0);
    if (f1) bp.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    var g = c.createGain(); g.gain.value = peak * MASTER;
    s.connect(bp); bp.connect(g); g.connect(c.destination); s.start(t0);
  }
  // coinPlink — square "ხურდა" (cascade-ისთვის)
  var COIN_NOTES = [988, 1047, 1175, 1319, 1397, 1568];
  var COIN_STEP = 0.058;   // წამი თითო ხურდაზე — თანაბარი ტემპი ყველა ქულაზე
  var COIN_MAXDUR = 1.5;   // ზედა ზღვარი (დიდ ქულაზე ინტერვალი იკუმშება)
  var COIN_MAXN = 40;      // მაქს. წკაპი (დიდ დაჯილდოებაზე)
  function coinPlan(n){ n = Math.max(1, Math.min(Math.round(n), COIN_MAXN));
    var step = COIN_STEP; if (n * step > COIN_MAXDUR) step = COIN_MAXDUR / n;
    return { n: n, step: step, dur: n * step }; }

  // ---- sound catalog (Bacho-ს საბოლოო არჩევანი, ნომრებით all-sounds-numbered-დან) ----
  var SOUNDS = {
    click:       function () { var t = T(); tone(t, 'triangle', 420, 300, 0.06, 0.28); },                                     // #12
    pop:         function () { var t = T(); tone(t, 'sine', 500, 900, 0.05, 0.3); },                                          // #22
    nav:         function () { var t = T(); tone(t, 'sine', 440, 380, 0.05, 0.18); },                                         // #24
    stand:       function () { var t = T(); tone(t, 'sine', 660, 520, 0.09, 0.22); },                                         // #13
    win:         function () { var t = T();[523, 659, 784, 1046].forEach(function (f, i) { tone(t + i * 0.12, 'sine', f, f, 0.2, 0.3); }); }, // #18
    error:       function () { var t = T(); tone(t, 'square', 160, 160, 0.14, 0.24); tone(t + 0.14, 'square', 130, 130, 0.2, 0.24); },        // #20
    correctStep: function () { var t = T(); tone(t, 'sine', 523, 523, 0.11, 0.28); tone(t + 0.1, 'sine', 784, 784, 0.16, 0.3); },             // #14
    wrongStep:   function () { var t = T(); tone(t, 'sawtooth', 200, 120, 0.28, 0.26); },                                     // #15
    spin:        function () { var t = T(); for (var i = 0; i < 14; i++) { tone(t + i * 0.05, 'square', 300 + i * 8, 300 + i * 8, 0.04, 0.14); } }, // #17
    doubleFlip:  function () { var t = T(); paper(t, 0.13, 0.45, 700, 2600, 0.8); paper(t + 0.11, 0.15, 0.4, 900, 3000, 0.8); }, // Tab sound
    // ხურდის ჩაყრა — n ქულა, თანაბრად განაწილებული dur ms-ში (ნორმალური დონე)
    coin:        function (opts) {
      opts = opts || {};
      var pl = coinPlan(opts.n || 5);
      var t0 = T();
      for (var i = 0; i < pl.n; i++) {                       // ფიქსირებული ინტერვალი — სუფთა თანაბარი ტემპი
        var f = COIN_NOTES[Math.floor(Math.random() * COIN_NOTES.length)];
        tone(t0 + i * pl.step, 'square', f, f * 0.985, 0.06, 0.13 + Math.random() * 0.06);
      }
    }
  };

  function play(name, arg) {
    if (!enabled) return;
    var fn = SOUNDS[name];
    if (!fn) return;
    try { fn(arg); } catch (e) {}
  }

  // ---- unlock audio on first user gesture ----
  function unlock() { try { ac(); } catch (e) {} }
  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach(function (ev) {
    window.addEventListener(ev, unlock, { once: true, passive: true, capture: true });
  });

  // ---- on/off toggle + speaker icon ----
  var toggles = [];
  function iconOn() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M11 5 6 9H2v6h4l5 4V5z"></path>' +
      '<path d="M15.5 8.5a5 5 0 0 1 0 7"></path>' +
      '<path d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg>';
  }
  function iconOff() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M11 5 6 9H2v6h4l5 4V5z"></path>' +
      '<line x1="22" y1="2" x2="16" y2="22"></line></svg>';
  }
  function render(btn) {
    btn.innerHTML = enabled ? iconOn() : iconOff();
    btn.setAttribute('aria-pressed', enabled ? 'false' : 'true');
    btn.setAttribute('title', enabled ? 'Sound on' : 'Sound off');
    btn.style.opacity = enabled ? '1' : '0.55';
  }
  function updateToggles() { toggles.forEach(render); }

  function setEnabled(v) {
    enabled = !!v;
    try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch (e) {}
    updateToggles();
    if (enabled) { try { ac(); play('nav'); } catch (e) {} } // ჩართვისას პატარა დადასტურება
  }

  function wire(btn) {
    if (!btn || btn.__wsSound) return;
    btn.__wsSound = true;
    btn.style.cursor = 'pointer';
    render(btn);
    toggles.push(btn);
    btn.addEventListener('click', function (e) { e.preventDefault(); setEnabled(!enabled); });
  }
  function mountToggle(elOrSel) {
    var el = (typeof elOrSel === 'string') ? document.querySelector(elOrSel) : elOrSel;
    wire(el); return el;
  }
  function autoWire() {
    var list = document.querySelectorAll('[data-ws-sound-toggle]');
    for (var i = 0; i < list.length; i++) wire(list[i]);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoWire);
  } else {
    autoWire();
  }

  // ---- public API ----
  window.winstepSound = {
    play: play,
    isOn: function () { return enabled; },
    toggle: function () { setEnabled(!enabled); },
    on: function () { setEnabled(true); },
    off: function () { setEnabled(false); },
    setVolume: function (v) { MASTER = Math.max(0, Math.min(1, +v || 0)); },
    coinDuration: function (n) { return coinPlan(n).dur * 1000; },   // ms — counter-ის სინქრონისთვის
    mountToggle: mountToggle
  };
})();
