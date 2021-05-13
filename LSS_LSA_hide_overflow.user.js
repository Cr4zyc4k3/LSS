// ==UserScript==
// @name         LSS LSA hide overflow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Crazycake
// @match        https://*.leitstellenspiel.de/leitstellenansicht
// @match        https://*.leitstellenspiel.de/leitstellenansichtClassic
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle ( `
    .ccNowrap {
        white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    }
` );
(function() {
    'use strict';
    var header = document.querySelectorAll("a");
for(let i=0;i< header.length;i++)
{header[i].classList.add("ccNowrap");
 header[i].setAttribute('data-toggle', 'tooltip');
 header[i].setAttribute('data-placement', 'top');
 header[i].setAttribute('title', header[i].innerText);
}

})();
