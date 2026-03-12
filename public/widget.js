/**
 * CypAI Chat Widget — Embeddable Script
 *
 * Usage:
 *   <script>
 *     window.CypAIConfig = {
 *       businessId: "YOUR_BUSINESS_ID",
 *       primaryColor: "#4F46E5",      // optional, default indigo
 *       widgetUrl: "https://yourdomain.com" // optional, defaults to script src origin
 *     };
 *   </script>
 *   <script src="https://yourdomain.com/widget.js" defer></script>
 */
(function () {
  "use strict";

  var config = window.CypAIConfig || {};
  var businessId = config.businessId;

  if (!businessId) {
    console.warn("[CypAI] widget.js: window.CypAIConfig.businessId is required.");
    return;
  }

  // Resolve base URL from config or from the script tag's src
  var baseUrl = config.widgetUrl || (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || "";
      if (src.indexOf("widget.js") !== -1) {
        var match = src.match(/^(https?:\/\/[^\/]+)/);
        return match ? match[1] : "";
      }
    }
    return "";
  })();

  var primaryColor = config.primaryColor || "#4F46E5";
  var BUTTON_SIZE = 56;
  var PANEL_WIDTH = 380;
  var PANEL_HEIGHT = 520;
  var BOTTOM_OFFSET = 24;
  var RIGHT_OFFSET = 24;

  // ── Inject minimal reset styles ──────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent =
    "#cypai-toggle-btn,#cypai-iframe-container{all:initial;box-sizing:border-box;font-family:inherit}" +
    "#cypai-toggle-btn{position:fixed;bottom:" + BOTTOM_OFFSET + "px;right:" + RIGHT_OFFSET + "px;z-index:2147483646;" +
      "width:" + BUTTON_SIZE + "px;height:" + BUTTON_SIZE + "px;border-radius:50%;" +
      "background:" + primaryColor + ";border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.25);" +
      "display:flex;align-items:center;justify-content:center;transition:transform .2s;}" +
    "#cypai-toggle-btn:hover{transform:scale(1.08)}" +
    "#cypai-toggle-btn svg{display:block}" +
    "#cypai-iframe-container{position:fixed;bottom:" + (BOTTOM_OFFSET + BUTTON_SIZE + 12) + "px;right:" + RIGHT_OFFSET + "px;" +
      "z-index:2147483645;width:" + PANEL_WIDTH + "px;height:" + PANEL_HEIGHT + "px;" +
      "border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.2);" +
      "transform-origin:bottom right;transition:transform .25s,opacity .25s;" +
      "transform:scale(0);opacity:0;pointer-events:none;}" +
    "#cypai-iframe-container.cypai-open{transform:scale(1);opacity:1;pointer-events:auto}" +
    "#cypai-iframe{width:100%;height:100%;border:none;display:block}";
  document.head.appendChild(style);

  // ── Chat icon SVG ─────────────────────────────────────────────────────────
  var chatIconSVG =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
    "</svg>";

  var closeIconSVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
    "</svg>";

  // ── Create iframe ─────────────────────────────────────────────────────────
  var iframeContainer = document.createElement("div");
  iframeContainer.id = "cypai-iframe-container";

  var iframe = document.createElement("iframe");
  iframe.id = "cypai-iframe";
  iframe.title = "CypAI Chat";
  iframe.allow = "microphone";

  // Lazy-load: set src only when first opened
  var iframeLoaded = false;

  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);

  // ── Create toggle button ──────────────────────────────────────────────────
  var btn = document.createElement("button");
  btn.id = "cypai-toggle-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = chatIconSVG;
  document.body.appendChild(btn);

  // ── Toggle logic ──────────────────────────────────────────────────────────
  var isOpen = false;

  btn.addEventListener("click", function () {
    isOpen = !isOpen;

    if (isOpen) {
      if (!iframeLoaded) {
        iframe.src =
          baseUrl +
          "/widget/" +
          encodeURIComponent(businessId) +
          "?color=" +
          encodeURIComponent(primaryColor);
        iframeLoaded = true;
      }
      iframeContainer.classList.add("cypai-open");
      btn.innerHTML = closeIconSVG;
      btn.setAttribute("aria-label", "Close chat");
    } else {
      iframeContainer.classList.remove("cypai-open");
      btn.innerHTML = chatIconSVG;
      btn.setAttribute("aria-label", "Open chat");
    }
  });

  // ── Allow iframe to close the widget via postMessage ──────────────────────
  window.addEventListener("message", function (event) {
    if (event.data === "cypai:close") {
      if (isOpen) btn.click();
    }
  });
})();

