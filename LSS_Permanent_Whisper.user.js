// ==UserScript==
// @name        LSS Chat permanent whisper
// @version     1.6.4
// @description Enables permanent whisper in alliance chat.
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// @updateURL   https://github.com/Cr4zyc4k3/LSS/raw/master/LSS_Permanent_Whisper.user.js
// ==/UserScript==

(function () {
	'use strict';

	//Config
	var showOnlyOnlineUsers = false;
	var enableIcons = false;

	var chathead = document.getElementById('chat_panel_heading');
	chathead.insertAdjacentHTML(
		'beforebegin',
		'<div id="WhisperDiv" class="pull-right panel-heading"> Permanent whisper to <input id="whisperUser" list="whisperUserList" style="color:black"><datalist id="whisperUserList"></datalist> <input type="checkbox" id="Whisper"></div>'
	);

	if (!sessionStorage.aAlliance || JSON.parse(sessionStorage.aAlliance).userId !== user_id || JSON.parse(sessionStorage.aAlliance).lastUpdate < new Date().getTime() - 5 * 1000 * 60) {
		$.getJSON('/api/allianceinfo').done((data) => sessionStorage.setItem('aAlliance', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: user_id})));
	}
	const aAlliance = JSON.parse(sessionStorage.aAlliance).value;

	var allianceinfo = aAlliance;
	var allianceUsers = [];
	for (var i = 0; i < allianceinfo.users.length; i++) {
		if (showOnlyOnlineUsers) {
			if (allianceinfo.users[i].online) {
				allianceUsers.push([allianceinfo.users[i].name, allianceinfo.users[i].roles.toString()]);
			}
		} else {
			allianceUsers.push([allianceinfo.users[i].name, allianceinfo.users[i].roles.toString()]);
		}
	}
	var i = 0;
	allianceUsers.forEach(function (item) {
		var option = document.createElement('option');
		option.value = item[(i, 0)];

		if (enableIcons) {
			if (item[(i, 1)].includes('Verbands-Admin')) {
				option.innerHTML = option.value + ' ♛';
			} else if (item[(i, 1)].includes('Verbands-Co-Admin')) {
				option.innerHTML = option.value + ' ♚';
			} else if (item[(i, 1)].includes('Sprechwunsch-Admin')) {
				option.innerHTML = option.value + ' 📣';
			} else if (item[(i, 1)].includes('Lehrgangsmeister')) {
				option.innerHTML = option.value + ' 🕮';
			} else if (item[(i, 1)].includes('Finanzminister')) {
				option.innerHTML = option.value + ' 💰';
			} else if (item[(i, 1)].includes('Aufsichtsrat')) {
				option.innerHTML = option.value + ' 🔍';
			}
		}
		i++;
		whisperUserList.appendChild(option);
	});

	function ToggleWhisper() {
		var checkbox = document.getElementById('Whisper');
		var chatinhalt = document.getElementById('alliance_chat_message').value;
		var whisperUser = document.getElementById('whisperUser').value;

		if (checkbox.checked == true) {
			if (!chatinhalt.includes('/w')) {
				var w = '/w ' + whisperUser + ' ';
				var chatinhalt_old = chatinhalt;
				chatinhalt = w.concat(chatinhalt_old);
				document.getElementById('alliance_chat_message').value = chatinhalt;
			}
		} else {
			document.getElementById('alliance_chat_message').value = chatinhalt.replace('/w ', '').replace(whisperUser + ' ', '');
		}
	}

	var ToggleListener = document.querySelector('#Whisper');
	if (ToggleListener) {
		ToggleListener.addEventListener('click', ToggleWhisper);
	}
	var ReloadListener = document.querySelector('#new_alliance_chat');
	if (ReloadListener) {
		ReloadListener.addEventListener('submit', ToggleWhisper);
	}
})();
