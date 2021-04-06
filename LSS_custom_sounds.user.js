// ==UserScript==
// @name        LSS overwrite sounds
// @version     1.0.1
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       unsafeWindow

// ==/UserScript==
unsafeWindow.play = function (e)
{
	var player = document.createElement('audio');
	player.preload = 'auto';
	switch (e)
	{
		case 'funk':
			player.src = "https://media1.vocaroo.com/mp3/1dccqkEfEFtH";
			break;

		case 'fms5':
			player.src = "https://www.leitstellenspiel.de/audio/doorbell.mp3";
			break;

		case 'melder':
			player.src = "https://media1.vocaroo.com/mp3/1nu7awIgCRLP";
			break;

		case 'chat_message':
			player.src = "https://media1.vocaroo.com/mp3/1iGwuyClz2eh";
			break;
		case 'chat_message_highlight':
			player.src = "https://media1.vocaroo.com/mp3/13CzOY8JfPmF";
			break;
		case 'ring':
			player.src = "https://media1.vocaroo.com/mp3/13CzOY8JfPmF";
			break;

		default:
			break;
	}
	console.log(player.src);
	player.play();
}