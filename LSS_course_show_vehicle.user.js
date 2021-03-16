// ==UserScript==
// @name        LSS Course show vehicles
// @version     1.0.2
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/buildings\/\d+$
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/schoolings\/\d+$
// @grant       none
// @UpdateURL   https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_building_notes.user.js
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


    if (window.location.pathname.split("/")[ 1 ] == "buildings" && document.getElementById("schooling") != null)
    {
        var building_inputs = document.querySelectorAll("input[id^=education_]");
        building_inputs.forEach(element =>
        {
            element.addEventListener("click", function ()
            {
                const educationArray = [
                    [ "gw_messtechnik", [ 12 ] ],
                    [ "gw_gefahrgut", [ 27, 77 ] ],
                    [ "gw_hoehenrettung", [ 33 ] ],
                    [ "elw2", [ 34, 78 ] ],
                    [ "wechsellader", [ 46 ] ],
                    [ "dekon_p", [ 53, 54 ] ],
                    [ "fwk", [ 57 ] ],
                    [ "arff", [ 75 ] ],
                    [ "rettungstreppe", [ 76 ] ],
                    [ "werkfeuerwehr", [ 83, 85, 86 ] ],
                    [ "notarzt", [ 29, 73, 74, 97 ] ],
                    [ "lna", [ 55 ] ],
                    [ "orgl", [ 56 ] ],
                    [ "seg_elw", [ 59 ] ],
                    [ "seg_gw_san", [ 60 ] ],
                    [ "gw_wassserrettung", [ 64, 65 ] ],
                    [ "gw_taucher", [ 63, 69 ] ],
                    [ "seg_rescue_dogs", [ 91 ] ],
                    [ "intensive_care", [ 97 ] ],
                    [ "police_einsatzleiter", [ 35 ] ],
                    [ "police_fukw", [ 51 ] ],
                    [ "polzeihubschrauber", [ 61 ] ],
                    [ "police_wassserwerfer", [ 72 ] ],
                    [ "police_sek", [ 79, 80 ] ],
                    [ "police_mek", [ 81, 82 ] ],
                    [ "k9", [ 94 ] ],
                    [ "police_motorcycle", [ 95 ] ],
                    [ "police_firefighting", [ 96 ] ],
                    [ "thw_zugtrupp", [ 40 ] ],
                    [ "thw_raumen", [ 42, 45 ] ],
                    [ "thw_rescue_dogs", [ 93 ] ]
                ];

                if (element.checked)
                {
                    for (let a = 0; a < educationArray.length; a++)
                    {
                        console.log(educationArray[ a ]);

                        if (element.attributes.education_key.value == educationArray[ a ][ 0 ])
                        {
                            for (let b = 0; b < educationArray[ a ][ 1 ].length; b++)
                            {
                                showVehicles(educationArray[ a ][ 1 ][ b ], element.attributes.value);
                            }
                            break;
                        }
                        else 
                        {
                            cleanUp();
                        }
                    }
                }
            })
        });
    }


})();

/*  shows vehicles
*   @vehicle_id: int
*   @
*/
function showVehicles(vehicleId, educationType)
{
    cleanUp(educationType);

    sessionStorage.setItem('ccCourseEducation', educationType);
    if (!localStorage.aVehicles || JSON.parse(localStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(localStorage.aVehicles).userId != user_id)
    {
        $.getJSON('/api/vehicles').done(data => localStorage.setItem('aVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
    }
    var aVehicles = JSON.parse(localStorage.aVehicles).value;

    var wachen = document.getElementById("accordion").children;
    for (var i = 0; i < wachen.length; i++)
    {
        for (var j = 0; j < aVehicles.length; j++)
        {
            if (wachen[ i ].firstElementChild.attributes.building_id.value == aVehicles[ j ].building_id && aVehicles[ j ].vehicle_type == vehicleId)
            {
                console.log("We found" + aVehicles[ j ].caption);
                let span = document.createElement("span");
                span.classList.add("label", "label-info");
                span.innerText = aVehicles[ j ].caption;
                wachen[ i ].firstElementChild.firstElementChild.appendChild(span);
            }
        }
    }
}

//Delets span if a other education is selected
function cleanUp(educationType)
{
    if (sessionStorage.getItem('ccCourseEducation') != educationType && sessionStorage.getItem('ccCourseEducation') != null)
    {
        let labels = document.getElementsByClassName("label-info");
        while (labels[ 0 ] != null)
        {
            labels[ 0 ].remove();
        }

    }
}
