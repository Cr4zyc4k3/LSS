// ==UserScript==
// @name        LSS Bigger AAO buttons
// @version     1.0.0
// @description Changes the size of the AAO Buttons
// @author      Crazycake
// @include     /https:\/\/www.leitstellenspiel.de/missions/\d+/
// @grant       none
// ==/UserScript==

(function () {
	'use strict';

	//config
	/*
    0 = supersmall (default);
    1 = small;
    2 = medium;
    3 = large;
    */
	var btnSize = 0;

	var AAObtns = document.getElementsByClassName('aao_btn');
	for (var i = 0; i < AAObtns.length; i++) {
		switch (btnSize) {
			case 1:
				AAObtns[i].classList.remove('btn-xs');
				AAObtns[i].classList.remove('aao');
				AAObtns[i].classList.add('btn-sm');
				break;
			case 2:
				AAObtns[i].classList.remove('btn-xs');
				AAObtns[i].classList.add('btn-default');
				break;
			case 3:
				AAObtns[i].classList.remove('btn-xs');
				AAObtns[i].classList.remove('aao');
				AAObtns[i].classList.add('btn-lg');
				break;

			default:
				break;
		}
	}
})();
