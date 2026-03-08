// ==UserScript==
// @name               4KHD Plus
// @name:zh-CN         4KHD 增强阅读
// @namespace          http://tampermonkey.net/
// @version            1.0.0
// @author             Viki
// @description        Reader mode with image navigation and floating controls for 4KHD and mirrors
// @description:zh-CN  为 4KHD 及镜像站提供阅读器模式，支持图片导航与悬浮控制
// @license            MIT
// @match              *://*.4khd.com/*/*
// @match              *://*.xxtt.ink/*/*
// @match              *://*.uuss.uk/*/*
// @match              *://*.ssuu.uk/*/*
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" *,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: } ");

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  const stylesCss = ':root{--accent: #F596AA;--accent-hover: #F7ABBE}.float-control{position:fixed;right:30px;bottom:30px;z-index:2147483647;display:flex;flex-direction:row;align-items:center;transition:opacity .3s;-webkit-user-select:none;user-select:none}.float-control.hidden{opacity:0;pointer-events:none}.side-btn.top-btn{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translate(-50%);opacity:.3;pointer-events:auto}.float-control:hover .side-btn.top-btn{opacity:.8}.side-btn.top-btn:hover{opacity:1!important;background:#555;transform:translate(-50%) scale(1.1)}.side-btn{width:36px;height:36px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;opacity:0;pointer-events:none}.float-control:hover .side-btn{opacity:1;pointer-events:auto}.side-btn:hover{background:#555;transform:scale(1.1)}.side-btn svg{width:18px;height:18px;fill:#fff}.side-btn.active{background:var(--accent)}.side-btn.active:hover{background:var(--accent-hover)}.auto-play-btn.hidden{display:none}.circle-control{position:relative;width:50px;height:50px;background:#1a1a1a;border:2px solid #555;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;box-shadow:0 4px 12px #00000080;margin:0 6px}.circle-control:hover{border-color:#888;box-shadow:0 6px 16px #000000b3;transform:scale(1.05)}.circle-control svg{width:24px;height:24px;fill:#fff}.settings-btn{cursor:pointer}.settings-panel{position:absolute;bottom:calc(100% + 10px);right:0;background:#1a1a1a;border:1px solid #555;border-radius:8px;padding:12px;min-width:180px;opacity:0;pointer-events:none;transition:all .3s;box-shadow:0 4px 12px #00000080;transform:translateY(5px)}.settings-panel.show{opacity:1;pointer-events:auto;transform:translateY(0)}.settings-item{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px;color:#ccc}.settings-item:last-child{margin-bottom:0}.settings-label{margin-right:10px;white-space:nowrap}.toggle-switch{width:40px;height:20px;background:#333;border-radius:10px;position:relative;cursor:pointer;transition:background .3s}.toggle-switch.on{background:var(--accent)}.toggle-slider{width:16px;height:16px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;transition:left .3s}.toggle-switch.on .toggle-slider{left:22px}.interval-input{width:60px;background:#333;border:1px solid #555;border-radius:4px;color:#fff;padding:4px 8px;font-size:12px;text-align:center}.interval-input:focus{outline:none;border-color:#888}.single-page-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:2147483646;display:none;align-items:center;justify-content:center}.single-page-overlay.active{display:flex}.sp-image-container{width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer}.sp-current-image{width:100%;height:100%;object-fit:contain;-webkit-user-select:none;user-select:none}.sp-close-btn{position:absolute;top:20px;right:20px;width:40px;height:40px;background:#333c;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;color:#fff;transition:all .3s;z-index:10}.sp-close-btn:hover{background:#555555e6;transform:scale(1.1)}.sp-scrollbar{position:absolute;right:40px;top:10%;width:12px;height:80%;background:#2828284d;border-radius:6px;z-index:10;transition:background .3s}.sp-scrollbar:hover{background:#32323280}.sp-scrollbar-thumb{position:absolute;left:0;width:100%;min-height:60px;background:#fff6;border-radius:6px;transition:background .3s;cursor:grab;-webkit-user-select:none;user-select:none}.sp-scrollbar-thumb:hover{background:#fff9}.sp-scrollbar-thumb:active{cursor:grabbing;background:#ffffffb3}.sp-scrollbar-label{position:absolute;right:calc(100% + 16px);top:50%;transform:translateY(-50%);background:#1a1a1af2;padding:8px 14px;border-radius:8px;color:#fff;font-family:monospace;font-size:14px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .3s;box-shadow:0 2px 8px #0000004d}.sp-scrollbar:hover .sp-scrollbar-label{opacity:1}.sp-thumb-panel{position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%);width:116px;background:#141414f2;border-radius:8px;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 16px #00000080;opacity:0;pointer-events:none;transition:opacity .2s;z-index:11;overflow:hidden}.sp-scrollbar:hover .sp-thumb-panel,.sp-thumb-panel:hover{opacity:1;pointer-events:auto}.sp-scrollbar:before{content:"";position:absolute;right:100%;top:0;width:140px;height:100%}.sp-thumb-viewport{width:100%;max-height:80vh;overflow:hidden;position:relative}.sp-thumb-content{position:relative;width:100%}.sp-thumb-item{position:absolute;left:8px;width:100px;height:72px;border-radius:4px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .15s;box-sizing:border-box}.sp-thumb-item:hover{border-color:#fff6}.sp-thumb-item.sp-thumb-active{border-color:var(--accent)}.sp-thumb-img{width:100%;height:100%;object-fit:cover;pointer-events:none}.sp-thumb-label{position:absolute;bottom:0;right:0;padding:1px 5px;background:#00000080;color:#fff9;font-family:monospace;font-size:11px;border-radius:4px 0 0;pointer-events:none}.sp-thumb-ph{width:100%;height:100%;background:#222;display:flex;align-items:center;justify-content:center;color:#555;font-family:monospace;font-size:13px;-webkit-user-select:none;user-select:none}.sp-thumb-counter{padding:8px 0;text-align:center;color:#999;font-family:monospace;font-size:13px;border-top:1px solid rgba(255,255,255,.08);-webkit-user-select:none;user-select:none}.sp-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}.sp-placeholder-pulse{width:60%;max-width:500px;height:60%;background:#181818;border-radius:8px;animation:sp-pulse 1.5s ease-in-out infinite}.sp-placeholder-text{position:absolute;color:#666;font-family:monospace;font-size:16px;-webkit-user-select:none;user-select:none}@keyframes sp-pulse{0%,to{opacity:.3}50%{opacity:.6}}.sp-error{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.sp-error-text{color:#666;font-family:monospace;font-size:16px;-webkit-user-select:none;user-select:none}.sp-error-msg{color:#d44;font-family:sans-serif;font-size:14px}.sp-error-retry{padding:8px 24px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;transition:background .2s}.sp-error-retry:hover{background:#555}';
  importCSS(stylesCss);
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function loadSettings() {
    return {
      showControl: _GM_getValue("showControl", true),
      autoEnterSinglePage: _GM_getValue("autoEnterSinglePage", false),
      autoPlayInterval: _GM_getValue("autoPlayInterval", 3e3)
    };
  }
  class Store {
    constructor() {
      __publicField(this, "_settings");
      __publicField(this, "listeners", new Map());
__publicField(this, "currPage", 1);
      __publicField(this, "totalPages", 1);
      __publicField(this, "nextUrl", null);
      __publicField(this, "prevUrl", null);
      __publicField(this, "isFetching", false);
      __publicField(this, "loadedPageUrls", new Set());
__publicField(this, "currentImageIndex", 0);
      __publicField(this, "allImages", []);
      __publicField(this, "pageRanges", []);
      __publicField(this, "autoPlayTimer", null);
      __publicField(this, "autoPlay", false);
      this._settings = loadSettings();
    }
    get settings() {
      return this._settings;
    }
    updateSetting(key, value) {
      this._settings[key] = value;
      _GM_setValue(key, value);
      this.emit("settingsChanged");
    }
    on(event, listener) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(listener);
    }
    emit(event) {
      var _a;
      (_a = this.listeners.get(event)) == null ? void 0 : _a.forEach((fn) => fn());
    }
  }
  const store = new Store();
  const parser = new DOMParser();
  function parseCurrentPageImages(doc) {
    const imgs = doc.querySelectorAll(".entry-content img");
    return Array.from(imgs).map((img) => img.src || img.getAttribute("src") || "").filter((src) => src && !src.includes("data:") && !src.includes("emoji"));
  }
  function parsePagination(doc) {
    var _a, _b;
    const items = doc.querySelectorAll(".page-links li");
    if (items.length === 0) {
      return { currentPage: 1, totalPages: 1, nextUrl: null, prevUrl: null };
    }
    let currentPage = 1;
    const totalPages = items.length;
    let currentIdx = -1;
    items.forEach((li, idx) => {
      var _a2;
      const a = li.querySelector("a");
      if (!a) {
        currentPage = parseInt(((_a2 = li.textContent) == null ? void 0 : _a2.trim()) || "1");
        currentIdx = idx;
      }
    });
    let nextUrl = null;
    let prevUrl = null;
    if (currentIdx >= 0 && currentIdx < items.length - 1) {
      const nextA = (_a = items[currentIdx + 1]) == null ? void 0 : _a.querySelector("a");
      if (nextA) nextUrl = nextA.href;
    }
    if (currentIdx > 0) {
      const prevA = (_b = items[currentIdx - 1]) == null ? void 0 : _b.querySelector("a");
      if (prevA) prevUrl = prevA.href;
    }
    return { currentPage, totalPages, nextUrl, prevUrl };
  }
  async function fetchPageImages(url) {
    const response = await fetch(url);
    const html = await response.text();
    const doc = parser.parseFromString(html, "text/html");
    const imgs = doc.querySelectorAll(".entry-content img");
    const images = Array.from(imgs).map((img) => {
      const src = img.getAttribute("src") || "";
      if (src.startsWith("http")) return src;
      try {
        return new URL(src, url).href;
      } catch {
        return "";
      }
    }).filter((src) => src && !src.includes("data:") && !src.includes("emoji"));
    const pagination = parsePagination(doc);
    let nextUrl = pagination.nextUrl;
    let prevUrl = pagination.prevUrl;
    if (nextUrl && !nextUrl.startsWith("http")) {
      try {
        nextUrl = new URL(nextUrl, url).href;
      } catch {
        nextUrl = null;
      }
    }
    if (prevUrl && !prevUrl.startsWith("http")) {
      try {
        prevUrl = new URL(prevUrl, url).href;
      } catch {
        prevUrl = null;
      }
    }
    return { images, nextUrl, prevUrl };
  }
  const svgSettings = `<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;
  const svgReader = `<svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>`;
  const svgPlay = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const svgPause = `<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`;
  const svgTop = `<svg viewBox="0 0 24 24"><path d="M4 4h16v2H4V4zm4 8l1.41 1.41L11 11.83V22h2V11.83l1.59 1.58L16 12l-4-4-4 4z"/></svg>`;
  const SETTINGS = [
    { label: "Show Control", key: "showControl" },
    { label: "Auto Enter Reader", key: "autoEnterSinglePage" }
  ];
  function createSettingsPanel() {
    const settingsBtn = document.createElement("div");
    settingsBtn.className = "settings-btn";
    const settingsPanel = document.createElement("div");
    settingsPanel.className = "settings-panel";
    SETTINGS.forEach(({ label, key }) => {
      const item = document.createElement("div");
      item.className = "settings-item";
      const labelEl = document.createElement("span");
      labelEl.className = "settings-label";
      labelEl.textContent = label;
      const toggle = document.createElement("div");
      toggle.className = `toggle-switch${store.settings[key] ? " on" : ""}`;
      const slider = document.createElement("div");
      slider.className = "toggle-slider";
      toggle.appendChild(slider);
      toggle.onclick = () => {
        const newValue = !store.settings[key];
        store.updateSetting(key, newValue);
        toggle.classList.toggle("on", newValue);
      };
      item.appendChild(labelEl);
      item.appendChild(toggle);
      settingsPanel.appendChild(item);
    });
    const intervalItem = document.createElement("div");
    intervalItem.className = "settings-item";
    const intervalLabel = document.createElement("span");
    intervalLabel.className = "settings-label";
    intervalLabel.textContent = "Play Interval";
    const intervalRight = document.createElement("div");
    intervalRight.style.cssText = "display:flex;align-items:center;gap:4px;";
    const intervalInput = document.createElement("input");
    intervalInput.type = "number";
    intervalInput.className = "interval-input";
    intervalInput.min = "1";
    intervalInput.max = "60";
    intervalInput.step = "0.5";
    intervalInput.value = String(store.settings.autoPlayInterval / 1e3);
    intervalInput.onclick = (e) => e.stopPropagation();
    intervalInput.onchange = (e) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value >= 1 && value <= 60) {
        store.updateSetting("autoPlayInterval", value * 1e3);
      }
    };
    const intervalUnit = document.createElement("span");
    intervalUnit.textContent = "s";
    intervalUnit.style.cssText = "font-size:12px;color:#888;";
    intervalRight.appendChild(intervalInput);
    intervalRight.appendChild(intervalUnit);
    intervalItem.appendChild(intervalLabel);
    intervalItem.appendChild(intervalRight);
    settingsPanel.appendChild(intervalItem);
    settingsBtn.onclick = (e) => {
      e.stopPropagation();
      settingsPanel.classList.toggle("show");
    };
    document.addEventListener("click", (e) => {
      if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.remove("show");
      }
    });
    return {
      getButtonElement: () => settingsBtn,
      getPanelElement: () => settingsPanel
    };
  }
  function createFloatControl(spmHandle) {
    const floatControl = document.createElement("div");
    floatControl.className = `float-control${store.settings.showControl ? "" : " hidden"}`;
    const autoPlayBtn = document.createElement("div");
    autoPlayBtn.className = `side-btn auto-play-btn hidden${store.autoPlay ? " active" : ""}`;
    autoPlayBtn.innerHTML = store.autoPlay ? svgPause : svgPlay;
    autoPlayBtn.title = "Auto Play";
    autoPlayBtn.onclick = (e) => {
      e.stopPropagation();
      const newValue = !store.autoPlay;
      store.autoPlay = newValue;
      store.emit("settingsChanged");
      autoPlayBtn.innerHTML = newValue ? svgPause : svgPlay;
      autoPlayBtn.classList.toggle("active", newValue);
    };
    const circleControl = document.createElement("div");
    circleControl.className = "circle-control";
    circleControl.innerHTML = svgReader;
    circleControl.title = "Reader Mode";
    circleControl.onclick = (e) => {
      var _a;
      if (e.target !== circleControl && !((_a = circleControl.querySelector("svg")) == null ? void 0 : _a.contains(e.target))) return;
      if (spmHandle.isActive()) {
        spmHandle.close();
      } else {
        spmHandle.open();
      }
    };
    store.on("readerModeChanged", () => {
      if (spmHandle.isActive()) {
        autoPlayBtn.classList.remove("hidden");
        autoPlayBtn.innerHTML = store.autoPlay ? svgPause : svgPlay;
        autoPlayBtn.classList.toggle("active", store.autoPlay);
      } else {
        autoPlayBtn.classList.add("hidden");
      }
    });
    const settings = createSettingsPanel();
    const settingsBtn = settings.getButtonElement();
    settingsBtn.className = "side-btn";
    settingsBtn.innerHTML = svgSettings;
    settingsBtn.title = "Settings";
    const topBtn = document.createElement("div");
    topBtn.className = "side-btn top-btn";
    topBtn.innerHTML = svgTop;
    topBtn.title = "Back to Top";
    topBtn.onclick = (e) => {
      e.stopPropagation();
      if (spmHandle.isActive()) {
        spmHandle.jumpTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    circleControl.appendChild(topBtn);
    floatControl.appendChild(autoPlayBtn);
    floatControl.appendChild(circleControl);
    floatControl.appendChild(settingsBtn);
    floatControl.appendChild(settings.getPanelElement());
    document.body.appendChild(floatControl);
  }
  const ITEM_HEIGHT = 80;
  const VISIBLE_COUNT = 12;
  const BUFFER = 3;
  function createThumbnailPanel(onIndexChange, onScrollToBottom, onScrollToTop) {
    const panel = document.createElement("div");
    panel.className = "sp-thumb-panel";
    const viewport = document.createElement("div");
    viewport.className = "sp-thumb-viewport";
    const content = document.createElement("div");
    content.className = "sp-thumb-content";
    const counter = document.createElement("div");
    counter.className = "sp-thumb-counter";
    viewport.appendChild(content);
    panel.appendChild(viewport);
    panel.appendChild(counter);
    let scrollOffset = 0;
    let lastCenteredIndex = -1;
    let clickedFromPanel = false;
    const itemPool = [];
    const activeItems = new Map();
    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }
    function vpHeight() {
      return Math.min(VISIBLE_COUNT * ITEM_HEIGHT, store.allImages.length * ITEM_HEIGHT);
    }
    function maxOffset() {
      return Math.max(0, store.allImages.length * ITEM_HEIGHT - vpHeight());
    }
    function acquireItem() {
      return itemPool.pop() || (() => {
        const el = document.createElement("div");
        el.className = "sp-thumb-item";
        return el;
      })();
    }
    function releaseItem(el) {
      el.remove();
      itemPool.push(el);
    }
    function renderItemContent(el, index) {
      el.dataset.index = String(index);
      el.classList.toggle("sp-thumb-active", index === store.currentImageIndex);
      const url = store.allImages[index];
      if (url) {
        let thumbImg = el.querySelector("img");
        if (!thumbImg) {
          el.innerHTML = "";
          thumbImg = document.createElement("img");
          thumbImg.className = "sp-thumb-img";
          el.appendChild(thumbImg);
          const label2 = document.createElement("span");
          label2.className = "sp-thumb-label";
          el.appendChild(label2);
        }
        if (thumbImg.src !== url) {
          thumbImg.src = url;
        }
        const label = el.querySelector(".sp-thumb-label");
        if (label) label.textContent = String(index + 1);
      } else {
        if (!el.querySelector(".sp-thumb-ph")) {
          el.innerHTML = "";
          const ph = document.createElement("div");
          ph.className = "sp-thumb-ph";
          ph.textContent = String(index + 1);
          el.appendChild(ph);
        }
      }
    }
    function renderVisibleItems() {
      const total = store.allImages.length;
      if (total === 0) return;
      const vp = vpHeight();
      viewport.style.height = `${vp}px`;
      content.style.height = `${total * ITEM_HEIGHT}px`;
      scrollOffset = clamp(scrollOffset, 0, maxOffset());
      const startIdx = Math.max(0, Math.floor(scrollOffset / ITEM_HEIGHT) - BUFFER);
      const endIdx = Math.min(total - 1, Math.ceil((scrollOffset + vp) / ITEM_HEIGHT) + BUFFER);
      for (const [idx, el] of activeItems) {
        if (idx < startIdx || idx > endIdx) {
          releaseItem(el);
          activeItems.delete(idx);
        }
      }
      for (let i = startIdx; i <= endIdx; i++) {
        let el = activeItems.get(i);
        if (!el) {
          el = acquireItem();
          activeItems.set(i, el);
          content.appendChild(el);
        }
        el.style.transform = `translateY(${i * ITEM_HEIGHT}px)`;
        renderItemContent(el, i);
      }
      content.style.transform = `translateY(${-scrollOffset}px)`;
    }
    function centerOnCurrent() {
      const vp = vpHeight();
      const target = store.currentImageIndex * ITEM_HEIGHT - vp / 2 + ITEM_HEIGHT / 2;
      scrollOffset = clamp(target, 0, maxOffset());
    }
    function ensureVisible() {
      const vp = vpHeight();
      const itemTop = store.currentImageIndex * ITEM_HEIGHT;
      const itemBottom = itemTop + ITEM_HEIGHT;
      if (itemTop < scrollOffset) {
        scrollOffset = itemTop;
      } else if (itemBottom > scrollOffset + vp) {
        scrollOffset = itemBottom - vp;
      }
      scrollOffset = clamp(scrollOffset, 0, maxOffset());
    }
    function update() {
      if (store.currentImageIndex !== lastCenteredIndex) {
        if (clickedFromPanel) {
          ensureVisible();
          clickedFromPanel = false;
        } else {
          centerOnCurrent();
        }
        lastCenteredIndex = store.currentImageIndex;
      }
      renderVisibleItems();
      counter.textContent = `${store.currentImageIndex + 1} / ${store.allImages.length}`;
    }
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollOffset = clamp(scrollOffset + e.deltaY, 0, maxOffset());
      renderVisibleItems();
      if (onScrollToBottom && scrollOffset >= maxOffset() - ITEM_HEIGHT) {
        onScrollToBottom();
      }
      if (onScrollToTop && scrollOffset <= ITEM_HEIGHT) {
        onScrollToTop();
      }
    }, { passive: false });
    content.addEventListener("click", (e) => {
      const item = e.target.closest(".sp-thumb-item");
      if (item == null ? void 0 : item.dataset.index) {
        const index = parseInt(item.dataset.index);
        if (!isNaN(index) && index >= 0 && index < store.allImages.length) {
          clickedFromPanel = true;
          onIndexChange(index);
        }
      }
    });
    return { update, getElement: () => panel };
  }
  function createScrollbar(onIndexChange, onScrollToBottom, onScrollToTop) {
    const pageIndicator = document.createElement("div");
    pageIndicator.className = "sp-scrollbar";
    const scrollbarThumb = document.createElement("div");
    scrollbarThumb.className = "sp-scrollbar-thumb";
    const scrollbarLabel = document.createElement("div");
    scrollbarLabel.className = "sp-scrollbar-label";
    pageIndicator.appendChild(scrollbarThumb);
    pageIndicator.appendChild(scrollbarLabel);
    const thumbPanel = createThumbnailPanel(onIndexChange, onScrollToBottom, onScrollToTop);
    pageIndicator.appendChild(thumbPanel.getElement());
    scrollbarLabel.style.display = "none";
    let cachedTrackHeight = 0;
    function refreshTrackHeight() {
      cachedTrackHeight = pageIndicator.offsetHeight;
    }
    window.addEventListener("resize", refreshTrackHeight, { passive: true });
    function update() {
      if (store.allImages.length === 0) return;
      if (!cachedTrackHeight) refreshTrackHeight();
      const trackHeight = cachedTrackHeight;
      let thumbHeight;
      if (store.allImages.length <= 10) {
        thumbHeight = 60;
      } else if (store.allImages.length <= 50) {
        thumbHeight = Math.max(60, trackHeight * (10 / store.allImages.length));
      } else {
        thumbHeight = Math.max(60, trackHeight * (5 / store.allImages.length));
      }
      const scrollProgress = store.currentImageIndex / Math.max(1, store.allImages.length - 1);
      const maxThumbTop = trackHeight - thumbHeight;
      const thumbTop = scrollProgress * maxThumbTop;
      scrollbarThumb.style.height = `${thumbHeight}px`;
      scrollbarThumb.style.top = `${thumbTop}px`;
      scrollbarLabel.textContent = `${store.currentImageIndex + 1} / ${store.allImages.length}`;
      thumbPanel.update();
    }
    pageIndicator.onclick = (e) => {
      if (e.target === scrollbarThumb) return;
      if (thumbPanel.getElement().contains(e.target)) return;
      const rect = pageIndicator.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const scrollProgress = Math.min(1, Math.max(0, clickY / rect.height));
      const targetIndex = Math.round(scrollProgress * (store.allImages.length - 1));
      if (targetIndex >= 0 && targetIndex < store.allImages.length) {
        onIndexChange(targetIndex);
      }
    };
    let isDragging = false;
    let dragStartY = 0;
    let thumbStartTop = 0;
    scrollbarThumb.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      dragStartY = e.clientY;
      thumbStartTop = scrollbarThumb.offsetTop;
      document.body.style.userSelect = "none";
    };
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - dragStartY;
      const newTop = thumbStartTop + deltaY;
      const trackHeight = cachedTrackHeight;
      const thumbHeight = scrollbarThumb.offsetHeight;
      const maxTop = trackHeight - thumbHeight;
      const clampedTop = Math.max(0, Math.min(maxTop, newTop));
      const scrollProgress = maxTop > 0 ? clampedTop / maxTop : 0;
      const targetIndex = Math.round(scrollProgress * (store.allImages.length - 1));
      if (targetIndex >= 0 && targetIndex < store.allImages.length && targetIndex !== store.currentImageIndex) {
        onIndexChange(targetIndex);
      }
    });
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
      }
    });
    scrollbarThumb.onclick = (e) => e.stopPropagation();
    return { update, getElement: () => pageIndicator };
  }
  function setupNavigation(deps) {
    function nextImage() {
      if (store.currentImageIndex < store.allImages.length - 1) {
        store.currentImageIndex++;
        deps.updateImage();
        deps.checkAndLoadNextPage();
      } else {
        deps.checkAndLoadNextPage();
        if (store.autoPlay) {
          deps.stopAutoPlayAtEnd();
        }
      }
    }
    function previousImage() {
      if (store.currentImageIndex > 0) {
        store.currentImageIndex--;
        deps.updateImage();
        if (store.autoPlay) {
          deps.resetAutoPlay();
        }
      }
      if (store.currentImageIndex <= 3) {
        deps.checkAndLoadPrevPage();
      }
    }
    let wheelTimeout;
    let wheelDelta = 0;
    let isScrolling = false;
    const processWheelScroll = () => {
      if (!isScrolling) return;
      const threshold = 100;
      if (Math.abs(wheelDelta) >= threshold) {
        if (wheelDelta > 0) {
          nextImage();
        } else {
          previousImage();
        }
        wheelDelta = wheelDelta > 0 ? wheelDelta - threshold : wheelDelta + threshold;
      }
      if (isScrolling) {
        requestAnimationFrame(processWheelScroll);
      }
    };
    deps.overlay.addEventListener("wheel", (e) => {
      e.preventDefault();
      wheelDelta += e.deltaY;
      if (!isScrolling) {
        isScrolling = true;
        processWheelScroll();
      }
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isScrolling = false;
        wheelDelta = 0;
      }, 150);
    }, { passive: false });
    document.addEventListener("keydown", (e) => {
      if (!deps.overlay.classList.contains("active")) return;
      if (e.key === "Escape") {
        deps.closeSinglePageMode();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        previousImage();
      }
    });
    return { nextImage, previousImage };
  }
  function createAutoPlay(nextImageFn) {
    function start() {
      if (store.autoPlayTimer) clearInterval(store.autoPlayTimer);
      if (store.autoPlay) {
        store.autoPlayTimer = setInterval(nextImageFn, store.settings.autoPlayInterval);
      }
    }
    function stop() {
      if (store.autoPlayTimer) {
        clearInterval(store.autoPlayTimer);
        store.autoPlayTimer = null;
      }
    }
    function reset() {
      if (store.autoPlay) {
        stop();
        start();
      }
    }
    function stopAtEnd() {
      store.autoPlay = false;
      store.emit("settingsChanged");
      stop();
    }
    return { start, stop, reset, stopAtEnd };
  }
  function createSinglePageOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "single-page-overlay";
    const closeBtn = document.createElement("div");
    closeBtn.className = "sp-close-btn";
    closeBtn.innerHTML = "&#10005;";
    const imageContainer = document.createElement("div");
    imageContainer.className = "sp-image-container";
    const currentImage = document.createElement("img");
    currentImage.className = "sp-current-image";
    imageContainer.appendChild(currentImage);
    currentImage.addEventListener("load", () => {
      if (!overlay.classList.contains("active")) return;
      removePlaceholder();
      scrollbar.update();
    });
    currentImage.addEventListener("error", () => {
      if (!overlay.classList.contains("active")) return;
      if (!currentImage.src || currentImage.src === location.href) return;
      showError();
    });
    function showPlaceholder() {
      currentImage.style.display = "none";
      removeErrorUI();
      const existing = imageContainer.querySelector(".sp-placeholder");
      if (existing) existing.remove();
      const ph = document.createElement("div");
      ph.className = "sp-placeholder";
      ph.innerHTML = `<div class="sp-placeholder-pulse"></div><div class="sp-placeholder-text">${store.currentImageIndex + 1} / ${store.allImages.length}</div>`;
      imageContainer.appendChild(ph);
    }
    function removePlaceholder() {
      const ph = imageContainer.querySelector(".sp-placeholder");
      if (ph) ph.remove();
      removeErrorUI();
      currentImage.style.display = "";
    }
    function showError() {
      currentImage.style.display = "none";
      const existing = imageContainer.querySelector(".sp-placeholder");
      if (existing) existing.remove();
      removeErrorUI();
      const errorDiv = document.createElement("div");
      errorDiv.className = "sp-error";
      errorDiv.innerHTML = `<div class="sp-error-text">${store.currentImageIndex + 1} / ${store.allImages.length}</div><div class="sp-error-msg">Load Failed</div><button class="sp-error-retry">Retry</button>`;
      const retryBtn = errorDiv.querySelector(".sp-error-retry");
      retryBtn.onclick = (e) => {
        e.stopPropagation();
        updateImage();
      };
      imageContainer.appendChild(errorDiv);
    }
    function removeErrorUI() {
      const err = imageContainer.querySelector(".sp-error");
      if (err) err.remove();
    }
    function updateImage() {
      removeErrorUI();
      const idx = store.currentImageIndex;
      const url = store.allImages[idx];
      if (!url) {
        showPlaceholder();
        scrollbar.update();
        return;
      }
      showPlaceholder();
      if (currentImage.src === url) {
        currentImage.src = "";
      }
      currentImage.src = url;
      scrollbar.update();
    }
    const autoPlay = createAutoPlay(() => nav.nextImage());
    const scrollbar = createScrollbar(
      (index) => {
        store.currentImageIndex = index;
        updateImage();
        autoPlay.reset();
      },
      () => loadNextPage(),
      () => loadPrevPage()
    );
    const nav = setupNavigation({
      overlay,
      updateImage,
      checkAndLoadNextPage: () => checkAndLoadNextPage(),
      checkAndLoadPrevPage: () => loadPrevPage(),
      resetAutoPlay: () => autoPlay.reset(),
      stopAutoPlayAtEnd: () => autoPlay.stopAtEnd(),
      closeSinglePageMode: () => close()
    });
    imageContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.closest(".sp-error-retry")) return;
      if (target.closest(".sp-close-btn")) return;
      if (target.closest(".sp-scrollbar")) return;
      const rect = imageContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) {
        nav.previousImage();
      } else {
        nav.nextImage();
      }
      autoPlay.reset();
    });
    overlay.appendChild(closeBtn);
    overlay.appendChild(scrollbar.getElement());
    overlay.appendChild(imageContainer);
    document.body.appendChild(overlay);
    closeBtn.onclick = () => close();
    function open(startIndex) {
      if (store.allImages.length === 0) {
        alert("No images found");
        return;
      }
      store.currentImageIndex = startIndex ?? 0;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      updateImage();
      store.emit("readerModeChanged");
      if (store.autoPlay) {
        autoPlay.start();
      }
    }
    function close() {
      removeErrorUI();
      autoPlay.stop();
      store.autoPlay = false;
      const exitIndex = store.currentImageIndex;
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      store.emit("readerModeChanged");
      const currentPageRange = store.pageRanges.find(
        (r) => r.url === window.location.href
      );
      if (currentPageRange && exitIndex >= currentPageRange.start && exitIndex < currentPageRange.start + currentPageRange.count) {
        const localIndex = exitIndex - currentPageRange.start;
        const imgs = document.querySelectorAll(".entry-content img");
        const filtered = Array.from(imgs).filter((img) => {
          const src = img.src || img.getAttribute("src") || "";
          return src && !src.includes("data:") && !src.includes("emoji");
        });
        const targetImg = filtered[localIndex];
        if (targetImg) {
          setTimeout(() => {
            targetImg.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      } else {
        const targetRange = store.pageRanges.find(
          (r) => exitIndex >= r.start && exitIndex < r.start + r.count
        );
        if (targetRange) {
          window.location.href = targetRange.url;
        }
      }
    }
    store.on("settingsChanged", () => {
      if (!overlay.classList.contains("active")) return;
      if (store.autoPlay) {
        autoPlay.start();
      } else {
        autoPlay.stop();
      }
    });
    function loadNextPage() {
      if (!store.nextUrl || store.isFetching) return;
      if (store.loadedPageUrls.has(store.nextUrl)) return;
      store.isFetching = true;
      const url = store.nextUrl;
      store.loadedPageUrls.add(url);
      fetchPageImages(url).then(({ images, nextUrl, prevUrl }) => {
        const start = store.allImages.length;
        store.allImages = [...store.allImages, ...images];
        store.pageRanges.push({ url, start, count: images.length });
        store.nextUrl = nextUrl;
        if (prevUrl && !store.prevUrl) store.prevUrl = prevUrl;
        store.isFetching = false;
        scrollbar.update();
      }).catch((err) => {
        console.error("[4KHD Reader] Load next page failed", err);
        store.loadedPageUrls.delete(url);
        store.isFetching = false;
      });
    }
    function loadPrevPage() {
      if (!store.prevUrl || store.isFetching) return;
      if (store.loadedPageUrls.has(store.prevUrl)) return;
      store.isFetching = true;
      const url = store.prevUrl;
      store.loadedPageUrls.add(url);
      fetchPageImages(url).then(({ images, nextUrl, prevUrl }) => {
        const prevCount = images.length;
        store.allImages = [...images, ...store.allImages];
        store.currentImageIndex += prevCount;
        store.pageRanges.forEach((r) => r.start += prevCount);
        store.pageRanges.unshift({ url, start: 0, count: prevCount });
        store.prevUrl = prevUrl;
        if (nextUrl && !store.nextUrl) store.nextUrl = nextUrl;
        store.isFetching = false;
        scrollbar.update();
      }).catch((err) => {
        console.error("[4KHD Reader] Load prev page failed", err);
        store.loadedPageUrls.delete(url);
        store.isFetching = false;
      });
    }
    function checkAndLoadNextPage() {
      if (!store.nextUrl || store.isFetching) return;
      const remaining = store.allImages.length - store.currentImageIndex;
      if (remaining <= 10) {
        loadNextPage();
      }
    }
    function jumpTo(index) {
      if (!overlay.classList.contains("active")) return;
      store.currentImageIndex = Math.max(0, Math.min(index, store.allImages.length - 1));
      updateImage();
      autoPlay.reset();
    }
    return {
      open,
      close,
      isActive: () => overlay.classList.contains("active"),
      getOverlayElement: () => overlay,
      jumpTo
    };
  }
  function registerMenuCommands() {
    _GM_registerMenuCommand("Toggle Control Display", () => {
      store.updateSetting("showControl", !store.settings.showControl);
      alert(`Control Display ${store.settings.showControl ? "Enabled" : "Disabled"}`);
      location.reload();
    });
    _GM_registerMenuCommand("Toggle Auto Enter Reader", () => {
      store.updateSetting("autoEnterSinglePage", !store.settings.autoEnterSinglePage);
      alert(`Auto Enter Reader ${store.settings.autoEnterSinglePage ? "Enabled" : "Disabled"}`);
      location.reload();
    });
  }
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });
  (function main() {
    const images = parseCurrentPageImages(document);
    if (images.length === 0) return;
    const pagination = parsePagination(document);
    store.currPage = pagination.currentPage;
    store.totalPages = pagination.totalPages;
    store.nextUrl = pagination.nextUrl;
    store.prevUrl = pagination.prevUrl;
    store.allImages = images;
    store.pageRanges.push({ url: window.location.href, start: 0, count: images.length });
    store.loadedPageUrls.add(window.location.href);
    let spmHandle;
    createFloatControl({
      open: (startIndex) => spmHandle.open(startIndex),
      close: () => spmHandle.close(),
      isActive: () => spmHandle.isActive(),
      getOverlayElement: () => spmHandle.getOverlayElement(),
      jumpTo: (index) => spmHandle.jumpTo(index)
    });
    spmHandle = createSinglePageOverlay();
    const pageImgs = document.querySelectorAll(".entry-content img");
    const filteredImgs = Array.from(pageImgs).filter((img) => {
      const src = img.src || img.getAttribute("src") || "";
      return src && !src.includes("data:") && !src.includes("emoji");
    });
    filteredImgs.forEach((img, localIndex) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        spmHandle.open(localIndex);
      });
    });
    registerMenuCommands();
    if (store.settings.autoEnterSinglePage) {
      setTimeout(() => spmHandle.open(), 500);
    }
  })();

})();