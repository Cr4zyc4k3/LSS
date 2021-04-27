// ==UserScript==
// @name        LSS change fms bg color
// @version     1.0
// @author      Crazycake, Jan (jxn_30)
// @description Just changes the fms-text
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       none
// ==/UserScript==

(function ()
{
    'use strict';


    let radioMessageBuffer = radioMessage;
    radioMessage = function (t)
    {
        if (t.type == "vehicle_fms")
        {
            var bgcolor = 'transparent';
            var color = 'black';
            switch (t.fms)
            {
                case 0:
                    break;
                case 1: bgcolor = "1";
                    break;
                case 2: bgcolor = "2";
                    break;
                case 3: bgcolor = "3";
                    break;
                case 4: bgcolor = "4";
                    break;
                case 5: bgcolor = "5";
                    //color = "white;"
                    break;
                case 6: bgcolor = "6";
                    break;
                case 7: bgcolor = "7";
                    break;
                case 8: bgcolor = "7";
                    break;
                case 9: bgcolor = "9";
                    break;
            }
            t.fms_text = '<div style="display:inline" class="building_list_fms building_list_fms_' + bgcolor + '">' + t.fms_text + '</div>';
        }
        radioMessageBuffer(t);
    }
}());