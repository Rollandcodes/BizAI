/**
 * CypAI Chat Widget v2 — Embeddable Script
 *
 * Usage (recommended):
 *   <script src="https://www.cypai.app/widget.js"
 *           data-business-id="YOUR_BUSINESS_ID"
 *           data-color="#2563eb"
 *           data-position="bottom-right"
 *           async></script>
 *
 * Legacy usage:
 *   <script>window.CypAIConfig = { businessId: "...", primaryColor: "#..." };</script>
 *   <script src="https://www.cypai.app/widget.js" defer></script>
 */
(function () {
  "use strict";

  // Support both data-* attributes and legacy window.CypAIConfig
  var scriptEl = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var config = window.CypAIConfig || {};
  var businessId = scriptEl.getAttribute("data-business-id") || config.businessId;

  if (!businessId) {
    console.warn("[CypAI] Missing data-business-id attribute.");
    return;
  }

  var primaryColor  = scriptEl.getAttribute("data-color") || config.primaryColor || "#2563eb";
  var position      = scriptEl.getAttribute("data-position") || config.position || "bottom-right";
  var isRight       = position !== "bottom-left";

  // Resolve base URL
  var baseUrl = config.widgetUrl || (function () {
    var src = scriptEl.src || "";
    var m = src.match(/^(https?:\/\/[^/]+)/);
    return m ? m[1] : "";
  })();

  var SESSION_ID = "cypai_" + Math.random().toString(36).slice(2, 11);
  var SIDE        = isRight ? "right" : "left";
  var CHAT_URL    = baseUrl + "/chat/" + businessId + "?embedded=1&color=" + encodeURIComponent(primaryColor);

  // ── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    "#cypai-btn{all:initial;position:fixed;bottom:24px;" + SIDE + ":24px;z-index:2147483646;",
    "width:56px;height:56px;border-radius:50%;background:" + primaryColor + ";border:none;",
    "cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;",
    "justify-content:center;transition:transform .2s;}",
    "#cypai-btn:hover{transform:scale(1.08)}",
    "#cypai-badge{position:absolute;top:-4px;" + SIDE + ":-4px;width:18px;height:18px;",
    "border-radius:50%;background:#ef4444;color:#fff;font-size:11px;font-weight:700;",
    "display:none;align-items:center;justify-content:center;font-family:sans-serif;}",
    "#cypai-panel{all:initial;position:fixed;bottom:92px;" + SIDE + ":24px;z-index:2147483645;",
    "width:min(380px,calc(100vw - 48px));height:min(560px,calc(100vh - 120px));",
    "border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.18);",
    "transform-origin:bottom " + SIDE + ";transition:transform .25s,opacity .25s;",
    "transform:scale(0) translateY(8px);opacity:0;pointer-events:none;}",
    "#cypai-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:auto}",
    "#cypai-panel iframe{width:100%;height:100%;border:none;display:block}",
    "@media(max-width:639px){#cypai-panel{width:100vw;height:100vh;bottom:0;" + SIDE + ":0;border-radius:0}}",
  ].join("");
  document.head.appendChild(style);

  // ── Button ────────────────────────────────────────────────────────────────
  var btn = document.createElement("button");
  btn.id = "cypai-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = [
    '<svg id="cypai-chat-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "</svg>",
    '<svg id="cypai-close-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">',
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    "</svg>",
    '<span id="cypai-badge"></span>',
  ].join("");

  // ── Panel ────────────────────────────────────────────────────────────────
  var panel = document.createElement("div");
  panel.id = "cypai-panel";

  var iframe = document.createElement("iframe");
  iframe.setAttribute("title", "CypAI Chat");
  iframe.setAttribute("allow", "microphone");
  iframe.setAttribute("loading", "lazy");
  panel.appendChild(iframe);

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var isOpen = false;

  function open() {
    isOpen = true;
    if (!iframe.src) iframe.src = CHAT_URL;
    panel.classList.add("open");
    document.getElementById("cypai-chat-icon").style.display = "none";
    document.getElementById("cypai-close-icon").style.display = "block";
    document.getElementById("cypai-badge").style.display = "none";
    btn.setAttribute("aria-label", "Close chat");
  }

  function close() {
    isOpen = false;
    panel.classList.remove("open");
    document.getElementById("cypai-chat-icon").style.display = "block";
    document.getElementById("cypai-close-icon").style.display = "none";
    btn.setAttribute("aria-label", "Open chat");
  }

  btn.addEventListener("click", function () {
    if (isOpen) close(); else open();
  });

  // Handle messages from iframe (e.g. close request, lead captured)
  window.addEventListener("message", function (e) {
    if (e.data === "cypai:close") close();
    if (e.data === "cypai:lead_captured") {
      var badge = document.getElementById("cypai-badge");
      if (!isOpen && badge) { badge.textContent = "1"; badge.style.display = "flex"; }
    }
  });
})();
