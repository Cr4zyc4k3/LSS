// ==UserScript==
// @name        LSS hide hospital
// @version     1.2
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/vehicles\/\d*$
// @grant       none
// @downloadURL https://github.com/Cr4zyc4k3/LSS/raw/master/LSS_hide_hospital.user.js
// ==/UserScript==

(function () {
	'use strict';
	const ccRTWKHList = [
		{
			name: 'STO',
			RTW: ['10101554','10327789','12125863'],
			KH: ['2917725', '4603995'],
		},
		{
			name: 'SIM',
			RTW: ['28426687'],
			KH: ['5857559'],
		},
	];
	let ccPathname = window.location.pathname;
	let ccRTWid = ccPathname.split('/')[2];

	for (let i = 0; i < ccRTWKHList.length; i++) {
		if (ccRTWKHList[i].RTW.includes(ccRTWid)) {
			ccRTWKHList[i].KH.forEach((element) => {
				console.log(
					$('#btn_approach_' + element)
						.parent()
						.parent()
				);
				$('#btn_approach_' + element)
					.parent()
					.parent()
					.addClass('ccNoDel');
			});
			$('tr').not('.ccNoDel').hide();
		}
	}
})();
