// ==UserScript==
// @name        LSS hide missions
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:(policie\.)?operacni-stredisko\.cz|(politi\.)?alarmcentral-spil\.dk|(polizei\.)?leitstellenspiel\.de|(?:(police\.)?missionchief-australia|(police\.)?missionchief|(poliisi\.)?hatakeskuspeli|missionchief-japan|missionchief-korea|(politiet\.)?nodsentralspillet|(politie\.)?meldkamerspel|operador193|(policia\.)?jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|(police\.)?missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|(police\.)?operateur112\.fr|(polizia\.)?operatore112\.it|(policja\.)?operatorratunkowy\.pl|dispetcher112\.ru|(polis\.)?larmcentralen-spelet\.se)\/.*$/
// @grant       none
// ==/UserScript==

(() =>
{
	'use strict';


	//default credits
	var creditsMin
	if (localStorage.getItem("ccHideMissions") != null)
	{
		creditsMin = localStorage.getItem("ccHideMissions");
		sortList(creditsMin);
	}
	else
	{
		creditsMin = 3000;
		localStorage.setItem("ccHideMissions", creditsMin);
	}


	//input for custom credit value
	$('#navbar_profile_link').parent().after(`<li role="presentation">
												<div style ="padding: 3px 20px;">
													Ausblenden bis: <input id="ccHideMissions" type="number" style="width:100px;" placeholder="3000">
												</div>
											</li>`);


	//Eventlistener for focusout on checkbox
	$('#ccHideMissions').focusout(function ()
	{
		//check whether input is number
		if (!Number.isNaN($('#ccHideMissions').val()) && $('#ccHideMissions').val() != creditsMin)
		{
			creditsMin = this.value;
			sortList(creditsMin);
			localStorage.setItem("ccHideMissions", creditsMin);
		}
	})
	//get own missions
	async function sortList(creditsMin)
	{
		//default request for einsaetze.json
		if (!localStorage.aMissions || JSON.parse(localStorage.aMissions).lastUpdate < (new Date().getTime() - 5 * 1000 * 60))
		{
			await $.getJSON('/einsaetze.json').done(data => localStorage.setItem('aMissions', JSON.stringify({ lastUpdate: new Date().getTime(), value: data })));
		}
		var aMissions = JSON.parse(localStorage.aMissions).value;


		var missions = $('#mission_list').children();
		for (let i = 0; i < missions.length; i++)
		{	//remove the "no missions-info"
			if (missions[ i ].attributes.mission_id != null)
			{	//compare to missions API
				for (let j = 0; j < aMissions.length; j++)
				{	//if avarge_credits < credtisMin hide them
					if (missions[ i ].attributes.mission_type_id.value == aMissions[ j ].id && aMissions[ j ].average_credits < creditsMin)
					{
						missions[ i ].classList.add('hide');
						//break for faster work
						break;
					}

				}
			}
		}
	}
})();
