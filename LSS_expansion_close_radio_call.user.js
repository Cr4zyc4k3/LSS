// ==UserScript==
// @name        LSS expansion close radio call
// @version     1.0
// @author      Crazycake
// @description Closes radio request also if you click on button "to msission"
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?#?$
// @grant       none
// ==/UserScript==

(function () {
	'use strict';

	const observertarget = $('#radio_messages_important')[0];
	const observerOptions = {
		childList: true,
	};
	const observer = new MutationObserver(handleObserved);

	function handleObserved(mutations) {
		$('.radio_message_close').each(function () {
			$(this).prev().addClass('radio_message_close').attr('vehicle_id', $(this).attr('vehicle_id'));
		});
	}

	observer.observe(observertarget, observerOptions);
})();
