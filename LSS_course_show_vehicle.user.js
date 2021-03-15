// ==UserScript==
// @name        LSS Test
// @version     1.0
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/buildings\/\d+$
// @grant       none
// ==/UserScript==

(function ()
{
    'use strict';

    //Default stuff, getting buldings/vehicles from API
    if (!localStorage.aBuildings || JSON.parse(localStorage.aBuildings).userId !== user_id || JSON.parse(localStorage.aBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60))
    {
        $.getJSON('/api/buildings').done(data => localStorage.setItem('aBuildings', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
    }
    const aBuildings = JSON.parse(localStorage.aBuildings).value;


    //get current building id via url
    var cur_id = window.location.pathname.split("/")[ 2 ];

    //serach for current building in api data
    for (let i = 0; i < aBuildings.length; i++)
    {
        if (aBuildings[ i ].id == cur_id)
        {
            if (aBuildings[ i ].building_type != 1 && aBuildings[ i ].building_type != 3 && aBuildings[ i ].building_type != 8 && aBuildings[ i ].building_type != 10)
            {
                return;
            }
            else
            {
                var cur_type = aBuildings[ i ].building_type;
                break;
            }
        }
    }
    var building_inputs = document.querySelectorAll("input[id^=education_]");
    building_inputs.forEach(element =>
    {
        element.addEventListener("click", function ()
        {
            if (element.checked)
            {

                switch (cur_type)
                {
                    case 1:
                        switch (parseInt(element.value))
                        {
                            case 0:
                                showVehicles(12);
                                break;
                            case 1:
                                showVehicles(27);
                                break;
                            case 2:
                                showVehicles(33);
                                break;
                            case 3:
                                showVehicles(34);
                                break;
                            case 4:
                                showVehicles(46);
                                break;
                            case 5:
                                showVehicles(53);
                                break;
                            case 6:
                                showVehicles(57);
                                break;
                            case 7:
                                showVehicles(64);
                                break;
                            case 8:
                                showVehicles(63);
                                break;
                            case 9:
                                showVehicles(29);
                                break;
                            case 10:
                                showVehicles(75);
                                break;
                            case 11:
                                showVehicles(76);
                                break;
                            case 12:
                                showVehicles(86);
                                showVehicles(83);
                                break;
                            case 13:
                                showVehicles(97);
                                break;
                        }
                        break;
                    case 3:
                        switch (parseInt(element.value))
                        {
                            case 0:
                                showVehicles(29);
                                break;
                            case 1:
                                showVehicles(55);
                                break;
                            case 2:
                                showVehicles(56);
                                break;
                            case 3:
                                showVehicles(59);
                                break;
                            case 4:
                                showVehicles(60);
                                break;
                            case 5:
                                showVehicles(64);
                                break;
                            case 6:
                                showVehicles(63);
                                break;
                            case 7:
                                showVehicles(91);
                                break;
                            case 8:
                                showVehicles(97);
                                break;
                        }

                        break;
                    case 8:
                        switch (parseInt(element.value))
                        {
                            case 0:
                                showVehicles(35);
                                break;
                            case 1:
                                showVehicles(51);
                                break;
                            case 2:
                                showVehicles(61);
                                break;
                            case 3:
                                showVehicles(72);
                                break;
                            case 4:
                                showVehicles(79);
                                showVehicles(80);
                                break;
                            case 5:
                                showVehicles(81);
                                showVehicles(82);
                                break;
                            case 6:
                                showVehicles(94);
                                break;
                            case 7:
                                showVehicles(95);
                                break;
                            case 8:
                                showVehicles(96);
                                break;
                        }


                        break;
                    case 10:
                        switch (parseInt(element.value))
                        {
                            case 0:
                                showVehicles(40);
                                break;
                            case 1:
                                showVehicles(42);
                                showVehicles(44);
                                break;
                            case 2:
                                showVehicles(65);
                                break;
                            case 3:
                                showVehicles(69);
                                break;
                            case 4:
                                showVehicles(93);
                                break;
                        }
                        break;
                }
            }
        })
    });


})();

/*  shows vehicles
*   vehicle_id
*/
function showVehicles(vehicleId)
{

    if (!localStorage.aVehicles || JSON.parse(localStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(localStorage.aVehicles).userId != user_id)
    {
        $.getJSON('/api/vehicles').done(data => localStorage.setItem('aVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
    }
    var aVehicles = JSON.parse(localStorage.aVehicles).value;

    let labels = document.getElementsByClassName("label-info");
    while (labels[ 0 ] != null)
    {
        labels[ 0 ].remove();
    }

    var wachen = document.getElementById("accordion").children;
    for (var i = 0; i < wachen.length; i++)
    {
        for (var j = 0; j < aVehicles.length; j++)
        {
            if (wachen[ i ].firstElementChild.attributes.building_id.value == aVehicles[ j ].building_id && aVehicles[ j ].vehicle_type == vehicleId)
            {

                let span = document.createElement("span");
                span.classList.add("label", "label-info");
                span.innerText = aVehicles[ j ].caption;
                wachen[ i ].firstElementChild.firstElementChild.appendChild(span);
            }
        }
    }
}
