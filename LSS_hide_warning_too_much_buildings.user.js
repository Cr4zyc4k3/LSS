// ==UserScript==
// @name         LSS hide warning too many buildings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Crazycake
// @match        https://*.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
     if(document.getElementsByClassName("anti-abuse-warning").length>0){
       document.getElementsByClassName("anti-abuse-warning")[0].classList.add("hidden");
     }

})();
