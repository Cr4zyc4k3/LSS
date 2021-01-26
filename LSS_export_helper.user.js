// ==UserScript==
// @name        LSS export helper
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/buildings\/\d+$
// @grant       none
// @updateURL	https://github.com/Cr4zyc4k3/LSS/raw/master/LSS_export_helper.user.js
// ==/UserScript==

(function () {
	'use strict';
	//default codeblock to get json from api
	if (!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).lastUpdate < new Date().getTime() - 5 * 1000 * 60 || JSON.parse(sessionStorage.aBuildings).userId != user_id) {
		$.getJSON('/api/buildings').done((data) => sessionStorage.setItem('aBuildings', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: user_id})));
	}
	var aBuildings = JSON.parse(sessionStorage.aBuildings).value;

	//initiate btns
	var btnClassRelease, btnClass0, btnClass1, btnClass2, btnClass3, btnClass4, btnClass5;

	//check whether building has a buildings tab
	if ($('a[href="#tab_buildings"').length > 0) {
		//add eventlistener bc, building content is only load on click
		$('a[href="#tab_buildings"').click(function () {
			//timeout to make sure we will grab the loaded content
			setTimeout(() => {
				//get every line of table
				const tbody = document.getElementById('building_table').lastElementChild.children;
				for (let i = 0; i < tbody.length; i++) {
					//get id from url
					var id = tbody[i].children[1].children[0].getAttribute('href').split('/')[2];
					//check against bulidings api-list
					for (let j = 0; j < aBuildings.length; j++) {
						//check whether building has shareable content
						if (id == aBuildings[j].id && aBuildings[j].hasOwnProperty('is_alliance_shared')) {
							if (!aBuildings[j].is_alliance_shared) {
								btnClassRelease = 'btn-success';
								btnClass0 = btnClass1 = btnClass2 = btnClass3 = btnClass4 = btnClass5 = 'btn-disabled';
							} else {
								btnClassRelease = 'btn-danger';
								switch (aBuildings[j].alliance_share_credits_percentage) {
									case 0:
										btnClass0 = 'btn-success';
										btnClass1 = btnClass2 = btnClass3 = btnClass4 = btnClass5 = 'btn-default';
										break;

									case 10:
										btnClass1 = 'btn-success';
										btnClass0 = btnClass2 = btnClass3 = btnClass4 = btnClass5 = 'btn-default';
										break;

									case 20:
										btnClass2 = 'btn-success';
										btnClass0 = btnClass1 = btnClass3 = btnClass4 = btnClass5 = 'btn-default';
										break;

									case 30:
										btnClass3 = 'btn-success';
										btnClass0 = btnClass1 = btnClass2 = btnClass4 = btnClass5 = 'btn-default';
										break;

									case 40:
										btnClass4 = 'btn-success';
										btnClass0 = btnClass1 = btnClass2 = btnClass3 = btnClass5 = 'btn-default';

										break;

									case 50:
										btnClass5 = 'btn-success';
										btnClass0 = btnClass1 = btnClass2 = btnClass3 = btnClass4 = 'btn-default';
										break;
								}
							}

							//htmlstuff to be injected later
							const htmlStuff =
								`<div class="btn-group">
									<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance');" class="btn btn-alliance_costs btn-xs ` +
								btnClassRelease +
								` ">Freigeben</a>
									<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/0');" class="btn btn-alliance_costs btn-xs ` +
								btnClass0 +
								` ">0%</a>
									<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/1');" class="btn btn-alliance_costs btn-xs ` +
								btnClass1 +
								` ">10%</a>
								<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/2');" class="btn btn-alliance_costs btn-xs ` +
								btnClass2 +
								` ">20%</a>
								<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/3');" class="btn btn-alliance_costs btn-xs ` +
								btnClass3 +
								` ">30%</a>
								<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/4');" class="btn btn-alliance_costs btn-xs ` +
								btnClass4 +
								` ">40%</a>
								<a onclick="$('head').load('/buildings/` +
								id +
								`/alliance_costs/5');" class="btn btn-alliance_costs btn-xs ` +
								btnClass5 +
								` ">50%</a>

								</div>`;
							let td = document.createElement('td');
							td.innerHTML = htmlStuff;
							tbody[i].appendChild(td);
							break;
						}
					}
				}
			}, 1500);
		});
	}
})();
