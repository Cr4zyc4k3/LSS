// ==UserScript==
// @name         LSS Forum Seitenleiste oben
// @version      0.1
// @description  Copies the navigation bar on top of the thread
// @author       Crazycake
// @match        https://forum.leitstellenspiel.de/*
// @grant        none
// @updateURL   https://github.com/Cr4zyc4k3/LSS/raw/main/Forum_page_bar_above.user.js
// ==/UserScript==

(function() {
    if(document.getElementsByClassName("messageListPagination").length > 0){
        document.getElementsByClassName("messageList")[0].insertBefore(document.getElementsByClassName("messageListPagination")[0].cloneNode(true ), document.getElementsByClassName("messageList")[0].firstElementChild)}
})();
