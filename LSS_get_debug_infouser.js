// ==UserScript==
// @name        LSS get Debug Information
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// @description  Dumps relevant data to screen to make it esaier for users to write an error report
// @requires 	https://raw.githubusercontent.com/bestiejs/platform.js/master/platform.js
// ==/UserScript==

(function () {
	'use strict';
	const modalbtn = `
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ccgetDebugInfo">
  Get Debug Information
</button>
	`;
	const modal = `
	<div class="modal fade" id="ccgetDebugInfo" tabindex="-1" role="dialog" aria-labelledby="ccgetDebugInfoModalHead" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ccgetDebugInfoModalHead">Get your Debug Information</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
		<textarea id="ccgetDebugInfoTextarea" readonly></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
        <button type="button" class="btn btn-primary">Speichern und als Text downloaden</button>
      </div>
    </div>
  </div>
</div>
	`;
	cons;
	var content;
	const browser = 'Browser + Version: ' + platform.name + ' ' + platform.version + '\n';
	const os = 'Operation System: ' + platform.os + '\n';
	const uid = 'Username (ID): ' + user_name + '(' + user_id + ')';
	$('footer').append(modalbtn);
})();
