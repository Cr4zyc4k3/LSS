// ==UserScript==
// @name        LSS warn BSR run off
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// @updateURL	https://github.com/Cr4zyc4k3/LSS/raw/master/LSS_warn_BSR_run_off.user.js
// ==/UserScript==

(function () {
	('use strict');
	const countdown = 2;
	const soundURL = '';
	if (!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).lastUpdate < new Date().getTime() - 5 * 1000 * 60 || JSON.parse(sessionStorage.aBuildings).userId != user_id) {
		$.getJSON('/api/buildings').done((data) => sessionStorage.setItem('aBuildings', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: user_id})));
	}
	var aBuildings = JSON.parse(sessionStorage.aBuildings).value;
	for (let i = 0; i < aBuildings.length; i++) {
		if (aBuildings[i].building_type == 14) {
			var BSRiD = aBuildings[i].id;
			break;
		}
	}
	$.get('/buildings/' + BSRiD, function (data) {
		var resText = data;
		const inSec = resText.substring(resText.search('educationCountdown') + 19, resText.search('educationCountdown') + 24);
		const remainingTime = secondsToHms(inSec);
		const remH = remainingTime.split(':')[0];
		if (remH < countdown) {
			$('body').append('<audio width="0" height="0" id="sound" src="' + soundURL + '" type="audio/mpeg" ></audio>');
			sound.loop = false;
			sound.play();
		}
	});
	window.setInterval(function () {
		$.get('/buildings/' + BSRiD, function (data) {
			var resText = data;
			const inSec = resText.substring(resText.search('educationCountdown') + 19, resText.search('educationCountdown') + 24);
			const remainingTime = secondsToHms(inSec);
			const remH = remainingTime.split(':')[0];
			if (remH < countdown) {
				$('body').append('<audio width="0" height="0" id="sound" src="' + soundURL + '" type="audio/mpeg" ></audio>');
				sound.loop = false;
				sound.play();
			}
		});
	}, 900000);
})();

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor((d % 3600) / 60);
	var s = Math.floor((d % 3600) % 60);
	return h + ':' + m + ':' + s;
}
