// ==UserScript==
// @name        LSS hide missions
// @version     1.2
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:(policie\.)?operacni-stredisko\.cz|(politi\.)?alarmcentral-spil\.dk|(polizei\.)?leitstellenspiel\.de|(?:(police\.)?missionchief-australia|(police\.)?missionchief|(poliisi\.)?hatakeskuspeli|missionchief-japan|missionchief-korea|(politiet\.)?nodsentralspillet|(politie\.)?meldkamerspel|operador193|(policia\.)?jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|(police\.)?missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|(police\.)?operateur112\.fr|(polizia\.)?operatore112\.it|(policja\.)?operatorratunkowy\.pl|dispetcher112\.ru|(polis\.)?larmcentralen-spelet\.se)\/.*$/
// @grant       none
// ==/UserScript==

(() =>
{
	'use strict';


	//default credits
	var creditsMin;
	var creditsMax;
	if (localStorage.getItem("ccHideMissionsMin") != null && localStorage.getItem("ccHideMissionsMax"))
	{
		creditsMin = localStorage.getItem("ccHideMissionsMin");
		creditsMax = localStorage.getItem("ccHideMissionsMax");
		sortList(creditsMin, creditsMax);
	}
	else
	{
		creditsMin = 3000;
		creditsMax = 12000
		localStorage.setItem("ccHideMissionsMin", creditsMin);
		localStorage.setItem("ccHideMissionsMax", creditsMax);
	}


	//input for custom credit value
	$('#navbar_profile_link').parent().after(`<li role="presentation">
												<div style ="padding: 3px 20px;">
													Ausblenden bis: <input id="ccHideMissionsCreditsMin" type="number" style="width:100px;color:black;" placeholder="`+ creditsMin + `">
													Ausblenden ab: <input id="ccHideMissionsCreditsMax" type="number" style="width:100px;color:black;" placeholder="`+ creditsMax + `">
												</div>
											</li>`);


	//Eventlistener for focusout on checkboxes
	$('[id^=ccHideMissionsCreditsM]').focusout(function ()
	{

		//check whether input is number
		if (!Number.isNaN($('#ccHideMissionsCreditsMin').val()) && !Number.isNaN($('#ccHideMissionsCreditsMax').val()))
		{
			creditsMin = $('#ccHideMissionsCreditsMin').val()
			creditsMax = $('#ccHideMissionsCreditsMax').val()
			localStorage.setItem("ccHideMissionsMin", creditsMin);
			localStorage.setItem("ccHideMissionsMax", creditsMax);
			sortList(creditsMin, creditsMax);
		}
	})
	//get own missions
	async function sortList(creditsMin, creditsMax)
	{
		//Remove all hides
		var ownMissions = $('#mission_list').children();
		var EventMissions = $('#mission_list_alliance_event').children();
		var allMissions = {};
		Object.assign(allMissions, ownMissions, EventMissions);
		for (let i = 0; i < allMissions.length; i++)
		{
			//exclude the "no emergency"
			if (allMissions[ i ].id == "emergency_no")
			{
				allMissions[ i ].classList.add('hide');
				continue;
			}
			allMissions[ i ].classList.remove('hide');

		}
		//default request for einsaetze.json
		if (!localStorage.aMissions || JSON.parse(localStorage.aMissions).lastUpdate < (new Date().getTime() - 5 * 1000 * 60))
		{
			await $.getJSON('/einsaetze.json').done(data => localStorage.setItem('aMissions', JSON.stringify({ lastUpdate: new Date().getTime(), value: data })));
		}
		var aMissions = JSON.parse(localStorage.aMissions).value;


		for (let i = 0; i < allMissions.length; i++)
		{	//remove the "no missions-info"
			if (allMissions[ i ].attributes.mission_id != null && allMissions[ i ].hasAttribute("mission_type_id"))
			{	//compare to missions API
				for (let j = 0; j < aMissions.length; j++)
				{	//if avarge_credits < credtisMin hide them
					if (allMissions[ i ].attributes.mission_type_id.value == aMissions[ j ].id && (aMissions[ j ].average_credits < creditsMin || aMissions[ j ].average_credits > creditsMax))
					{
						allMissions[ i ].classList.add('hide');
						//break for faster work
						break;
					}

				}
			}
		}
	}
})();
