// ==UserScript==
// @name        LSS Test
// @version     1.0
// @author      Crazycake, Jan (jxn_30)
// @description Just changes the fms-text
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// ==/UserScript==

(function () {
    'use strict';


    let radioMessageBuffer = radioMessage;
    radioMessage = function (t) {
        if (t.type == "vehicle_fms") {
            switch (t.fms) {
                case 0:
                    break;
                case 1: t.fms_text = "Frei über Funk <br>";
                    break;
                case 2: t.fms_text = "Frei auf Wache <br>";
                    break;
                case 3: t.fms_text = "Zum Berufungsort <br>";
                    break;
                case 4: t.fms_text = "Am Berufungsort <br>";
                    break;
                case 5:
                    break;
                case 7: t.fms_text = "Zum Zielort <br>";
                    break;
                case 8:
                    break;
                case 9:
                    break;
            }
        }
        radioMessageBuffer(t);
    }
}());