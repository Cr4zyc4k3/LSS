// ==UserScript==
// @name        LSS alliance mission filter by creator
// @version     1.0
// @author      Crazycake, Lenni.04
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// ==/UserScript==

(function ()
{
	'use strict';

	var allianceMissions = document.getElementById("mission_list_alliance").children;

	if (document.getElementById("alliance_no_mission").style.display != "none")
	{
		return;
	}

	var input = document.createElement("Input");
	document.getElementsByClassName("missions-panel-head big_map_window_head ui-draggable-handle")[ 0 ].appendChild(input);

	allianceMissions = [].slice.call(allianceMissions);
	allianceMissions.shift();
	for (var i = 0; i < allianceMissions.length; i++)
	{
		var url = allianceMissions[ i ].querySelector("a").attributes.href.value;
		fetch("https://www.leitstellenspiel.de/missions/1905815634")
			.then(function (response)
			{
				return response.text();
			}).then(function (data)
			{
				let dom = new DOMParser().parseFromString(data, 'text/html');
				let name = dom.getElementsByClassName("alert alert-info")[ 0 ].children[ 0 ].text;
				allianceMissions[ i ].setAttribute("ersteller", name)
			})
	}
})();
