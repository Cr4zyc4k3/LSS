// ==UserScript==
// @name        LSS new building lock ILS and bulding type
// @version     1.0.0
// @description Locks ILS and building type while building a new station
// @author      Crazycake
// @include     /https:\/\/www.leitstellenspiel.de/
// @grant       none
// ==/UserScript==

(function () {
	'use strict';

	const defaultBuilding = 0; //ID-list: https://lssdb.de/gebaeude
	const ILS = 0; //Set your ILS-ID

	let observer = new MutationObserver((mutationRecords) => {
		mutationRecords.forEach((mutation) => {
			const form = mutation.target.querySelector('#new_building');
			if (form != null) {
				document.getElementById('building_building_type').value = defaultBuilding;
				document.getElementById('building_leitstelle_building_id').value = ILS;
			}
		});
	});

	observer.observe(document.getElementById('buildings'), {
		childList: true,
	});
})();
