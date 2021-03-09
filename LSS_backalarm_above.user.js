// ==UserScript==
// @name        LSS backalarm above
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/missions\/\d+
// @grant       none
// @updateURL	https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_backalarm_above.user.js
// ==/UserScript==

(function ()
{
	'use strict';
	const ccbackaalarmaboveString = $("#group_max_distance").prev().prev();
	const ccbackaalarmabove = $(ccbackaalarmaboveString);
	$(".mission_header_info").append(ccbackaalarmabove);
})();
