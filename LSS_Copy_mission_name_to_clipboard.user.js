// ==UserScript==
// @name         LSS Copy mission name to clipboard
// @version      0.2
// @author       Crazycake
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    const missionTitle = document.getElementById("missionH1").childNodes[2].nodeValue.trim();
    GM_setClipboard(missionTitle, "text");
})();
