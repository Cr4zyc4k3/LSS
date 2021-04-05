// ==UserScript==
// @name        LSS overwrite sounds
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       unsafeWindow

// ==/UserScript==
unsafeWindow.play = function (e) {
	var player = document.createElement('audio');
	player.preload = 'auto';
	switch (e) {
		case 'funk':
			player.src = "http://www.nonstick.com/audio/soundsource/FX/ltfx_086.mp3";
			break;

		case 'fms5':
			player.src = "http://www.nonstick.com/audio/soundsource/FX/ltfx_086.mp3";
			break;

		case 'ring':
			player.src = "http://www.nonstick.com/audio/soundsource/FX/ltfx_086.mp3";
			break;


		default:
			break;
	}
	player.play();
}