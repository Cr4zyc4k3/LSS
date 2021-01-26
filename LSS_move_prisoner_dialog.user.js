// ==UserScript==
// @name        LSS move prisoner dialog
// @version     1.0
// @author      Crazycake
// @include     /https:\/\/www.leitstellenspiel.de/missions/\d+/
// @grant       none
// ==/UserScript==

(function () {
	'use strict';

	var prisoner_headline = document.getElementById('h2_prisoners');
	var prisoner_box = prisoner_headline.nextElementSibling;
	document.getElementById('h2_prisoners').nextElementSibling.remove();
	document.getElementById('h2_prisoners').remove();
	document.getElementById('col_left').appendChild(prisoner_headline);
	document.getElementById('col_left').appendChild(prisoner_box);
})();
