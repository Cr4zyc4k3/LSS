// ==UserScript==
// @name         LSS Copy mission name to clipboard
// @version      0.1
// @author       Crazycake
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

  const copyText = document.getElementById("missionH1").innerText.substring(1);
  GM_setClipboard(copyText,"text")
})();
