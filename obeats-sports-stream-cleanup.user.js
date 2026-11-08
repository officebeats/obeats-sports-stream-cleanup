// ==UserScript==
// @name         oBEATS sports stream cleanup
// @namespace    https://greasyfork.org/users/obeats
// @version      1.0.8
// @description  Removes ads, popups, redirects, chatboxes, and clutter while responsively maximizing video above the fold with top bitrate and zero freezing. Supports ppv.st, ppv.tj, ppvs.pk, ppv.rw, ppv.ms, ppv.bi, ppv.ug, strmfree.pk, streamfree.top, strmfree.st, strmfree.link, tim-streams.com, timst.cfd.
// @author       oBEATS (https://github.com/officebeats)
// @homepageURL  https://github.com/officebeats
// @supportURL   https://github.com/officebeats
// @license      MIT
// @match        *://*.ppv.st/*
// @match        *://ppv.st/*
// @match        *://*.ppv.tj/*
// @match        *://ppv.tj/*
// @match        *://*.ppvs.pk/*
// @match        *://ppvs.pk/*
// @match        *://*.ppv.rw/*
// @match        *://ppv.rw/*
// @match        *://*.ppv.ms/*
// @match        *://ppv.ms/*
// @match        *://*.ppv.bi/*
// @match        *://ppv.bi/*
// @match        *://*.ppv.ug/*
// @match        *://ppv.ug/*
// @match        *://*.strmfree.pk/*
// @match        *://strmfree.pk/*
// @match        *://*.streamfree.top/*
// @match        *://streamfree.top/*
// @match        *://*.strmfree.st/*
// @match        *://strmfree.st/*
// @match        *://*.strmfree.link/*
// @match        *://strmfree.link/*
// @match        *://*.tim-streams.com/*
// @match        *://tim-streams.com/*
// @match        *://*.timst.cfd/*
// @match        *://timst.cfd/*
// @match        *://*.taifood-blog.asia/*
// @match        *://taifood-blog.asia/*
// @match        *://*.ehgembxe.cfd/*
// @match        *://ehgembxe.cfd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppv.st
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @all-frames   true
// ==/UserScript==

(function() {
  'use strict';

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const doc = win.document;
  const isTop = win === win.top;

  /* ==========================================================================
     1. ANTI-POPUP, ANTI-CLICKTRAP & AD STUBS (TOP WINDOW & EMBEDS)
     ========================================================================== */

  const AD_HOST_REGEX = /adsboosters|rainbet|ueuee\.com|adcash|popads|bufvrxymutjwx|wpnxiswpuyrfn|cemhlobja\.com|visariomedia\.com|histats\.com|plum\.js|tag\.min\.js|ad\.html|visit\.php|sxocvzgnnyo\.com|hpslzsfai\.com|qvfmpqrd\.com|162\.252\./i;

  // Harmless dummy window object returned when window.open is blocked
  const dummyWindow = {
    closed: false,
    focus: () => {},
    blur: () => {},
    close: () => {},
    location: { href: '' },
    document: { write: () => {} }
  };

  // Helper checking if current page is a video streaming / watch / embed view
  function isStreamLocation() {
    const path = (win.location.pathname || '').toLowerCase();
    const host = (win.location.hostname || '').toLowerCase();
    return !isTop || path.includes('/watch') || path.includes('/live') || path.includes('/player') || path.includes('/play') || path.includes('/embed') || host.includes('cfd') || host.includes('asia');
  }

  // Defeat all window.open popups unconditionally in subframes and on stream pages
  try {
    const origOpen = win.open;
    win.open = function(url, ...args) {
      if (!isTop || isStreamLocation()) {
        console.warn('[oBEATS] Blocked popup window.open:', url);
        return dummyWindow;
      }
      if (!url || typeof url !== 'string' || AD_HOST_REGEX.test(url) || url.includes('/ad/') || url.includes('visit.php')) {
        console.warn('[oBEATS] Blocked ad popup window.open:', url);
        return dummyWindow;
      }
      return origOpen.apply(this, arguments);
    };
  } catch (e) {}

  // Defeat HTML popup blob creation in subframes (used by adsboosters / rainbet popunders)
  try {
    const origCreateObjectURL = win.URL.createObjectURL;
    win.URL.createObjectURL = function(blob) {
      if (!isTop && blob && blob.type && blob.type.includes('html')) {
        console.warn('[oBEATS] Blocked HTML popup blob creation');
        return 'about:blank';
      }
      return origCreateObjectURL.apply(this, arguments);
    };
  } catch (e) {}

  // Defeat programmatic click triggers on <a target="_blank"> links used by PopAds/AdCash
  try {
    const origAnchorClick = win.HTMLAnchorElement.prototype.click;
    win.HTMLAnchorElement.prototype.click = function() {
      if (!isTop || this.target === '_blank') {
        console.warn('[oBEATS] Blocked programmatic anchor click:', this.href);
        return;
      }
      return origAnchorClick.apply(this, arguments);
    };
  } catch (e) {}

  // Defeat programmatic form submits targeting _blank
  try {
    const origFormSubmit = win.HTMLFormElement.prototype.submit;
    win.HTMLFormElement.prototype.submit = function() {
      if (!isTop || this.target === '_blank') {
        console.warn('[oBEATS] Blocked programmatic form popup submit');
        return;
      }
      return origFormSubmit.apply(this, arguments);
    };
  } catch (e) {}

  // Capture-phase click interceptor for ad link traps
  win.addEventListener('click', (e) => {
    // Inside embed frames, player controls are divs/buttons. Any <a> tag is an advertiser click trap!
    if (!isTop) {
      const link = e.target.closest('a');
      if (link) {
        e.preventDefault();
        e.stopImmediatePropagation();
        link.remove();
        console.warn('[oBEATS] Blocked ad link trap in embed:', link.href);
        return;
      }
    } else {
      const link = e.target.closest('a');
      if (link) {
        const href = (link.href || '').toLowerCase();
        if (AD_HOST_REGEX.test(href) || href.includes('visit.php') || href.includes('/ad/')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          link.remove();
          console.warn('[oBEATS] Blocked ad link on stream page:', href);
          return;
        }
      }
    }
  }, true);

  // Safe universal proxy for aclib (AdCash / PopAds / PropellerAds)
  try {
    const noopProxy = new Proxy({}, {
      get: () => () => {}
    });
    Object.defineProperty(win, 'aclib', { get: () => noopProxy, set: () => {}, configurable: false });
  } catch (e) {}
  try {
    win.popns = { installed: true };
  } catch (e) {}

  // Block chat WebSockets entirely to eliminate CPU & network thread lock
  try {
    const OrigWS = win.WebSocket;
    win.WebSocket = function(url, protocols) {
      if (typeof url === 'string' && (url.includes('/chat') || url.includes('chatango') || url.includes('television.st/chat') || url.includes('streamfree'))) {
        const dummy = new EventTarget();
        dummy.readyState = 3; // CLOSED
        dummy.close = () => {};
        dummy.send = () => {};
        return dummy;
      }
      return new OrigWS(url, protocols);
    };
    Object.assign(win.WebSocket, OrigWS);
  } catch (e) {}

  // If inside an embed frame, STOP here! Do not run top-level styling or DOM operations
  if (!isTop) return;

  /* ==========================================================================
     2. THEATRE MODE & CHAT REMOVAL (TOP WINDOW ONLY)
     ========================================================================== */

  const css = `
    /* HIDE CHATBOXES, ADS, AND OVERLAYS ACROSS ALL TARGET DOMAINS */
    #chat-slot-desktop,
    #chat-slot-mobile,
    [id*="chat-slot"],
    .rules-overlay,
    #chat-column,
    .chat-column,
    #chat-btn,
    #chatbox,
    .chat-container,
    iframe[src*="chatango"],
    iframe[src*="chat.streamfree"],
    iframe#close,
    iframe[src*="ad.html"],
    #mirror-toast,
    #feedback-overlay,
    #inactive-mirror-overlay,
    a[href*="visit.php"],
    div:has(> iframe[src*="chatango"]),
    div:has(> iframe[src*="chat.streamfree"]) {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
      height: 0 !important;
      width: 0 !important;
    }

    /* 1. PPV NETWORK (ppv.st, ppv.tj, ppvs.pk, ppv.rw, ppv.ms, ppv.bi, ppv.ug) */
    .live-page-container > div:first-child {
      margin-right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .live-page-container .aspect-video {
      max-height: calc(100dvh - var(--app-chrome-height, 4rem)) !important;
      width: min(100%, calc((100dvh - var(--app-chrome-height, 4rem)) * (16 / 9))) !important;
      height: auto !important;
      aspect-ratio: 16 / 9 !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .live-page-container {
      background-color: #0b0e14 !important;
    }

    /* 2. STREAMFREE NETWORK (strmfree.pk, streamfree.top, strmfree.st, strmfree.link) */
    .player-section {
      grid-template-columns: 1fr !important;
      width: 100% !important;
      margin: 0 auto !important;
    }

    .player-column {
      width: 100% !important;
      max-width: 100% !important;
    }

    .player-page-content {
      padding: 0 16px !important;
      max-width: 100% !important;
    }

    #player-container {
      max-height: calc(100dvh - var(--strmfree-top-offset, 140px)) !important;
      width: min(100%, calc((100dvh - var(--strmfree-top-offset, 140px)) * (16 / 9))) !important;
      height: auto !important;
      aspect-ratio: 16 / 9 !important;
      margin-left: auto !important;
      margin-right: auto !important;
      border-radius: 8px !important;
    }

    /* 3. TIMSTREAMS NETWORK (tim-streams.com, timst.cfd) */
    .h-screen.w-full > div:has(> iframe:not([src*="chatango"])) {
      width: 100% !important;
      flex: 1 1 100% !important;
    }
  `;

  // Inject stylesheet once
  let styleInjected = false;
  function injectStyle() {
    if (styleInjected) return;
    const target = win.document.head || win.document.documentElement;
    if (!target) {
      if (win.requestAnimationFrame) win.requestAnimationFrame(injectStyle);
      else setTimeout(injectStyle, 10);
      return;
    }
    styleInjected = true;
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
    } else {
      const s = doc.createElement('style');
      s.id = 'obeats-stream-cleanup';
      s.textContent = css;
      target.appendChild(s);
    }
  }
  injectStyle();

  // Dynamic measurement of top offset for StreamFree player
  let lastOffset = 0;
  function updateOffsets() {
    const strmPlayer = win.document.getElementById('player-container');
    if (strmPlayer) {
      const top = Math.max(60, Math.round(strmPlayer.getBoundingClientRect().top + win.scrollY));
      if (top !== lastOffset) {
        lastOffset = top;
        win.document.documentElement.style.setProperty('--strmfree-top-offset', top + 'px');
      }
    }
  }

  // Disconnect static chat iframes (Chatango / StreamFree chatbox) so they don't consume memory
  function stopHeavyChatSockets() {
    const chatIframes = win.document.querySelectorAll('iframe[src*="chatango"], iframe[src*="chat.streamfree"]');
    for (const f of chatIframes) {
      f.src = 'about:blank';
      f.remove();
    }
  }

  function onInit() {
    injectStyle();
    stopHeavyChatSockets();
    updateOffsets();
  }

  if (win.document.readyState === 'loading') {
    win.document.addEventListener('DOMContentLoaded', onInit);
  } else {
    onInit();
  }
  win.addEventListener('load', onInit);
  win.addEventListener('resize', updateOffsets);
})();
