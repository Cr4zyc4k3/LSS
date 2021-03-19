// ==UserScript==
// @name        LSS Course show vehicles
// @version     1.0.4
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/schoolings\/\d+$
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/buildings\/\d+$
// @grant       none
// @UpdateURL   https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_building_notes.user.js
// ==/UserScript==

//education and the vehicles whom need them. de_DE only!
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
    [ "notarzt", [ 29, 31, 73, 74, 97 ] ],
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
    [ "polizeihubschrauber", [ 61 ] ],
    [ "police_wasserwerfer", [ 72 ] ],
    [ "police_sek", [ 79, 80 ] ],
    [ "police_mek", [ 81, 82 ] ],
    [ "k9", [ 94 ] ],
    [ "police_motorcycle", [ 95 ] ],
    [ "police_firefighting", [ 96 ] ],
    [ "thw_zugtrupp", [ 40 ] ],
    [ "thw_raumen", [ 42, 45 ] ],
    [ "thw_rescue_dogs", [ 93 ] ]
];

(function ()
{

    'use strict';

    //check whether this is a building and a school
    if (window.location.pathname.split("/")[ 1 ] == "buildings" && document.getElementById("schooling") != null)
    {
        //get all input education buttons
        const inputs = document.querySelectorAll("input[id^=education_]");
        inputs.forEach(element =>
        {
            //Adding eventlistener to each input
            element.addEventListener("click", function ()
            {
                //checking whether this input is really checked
                if (element.checked)
                {
                    //delete all existing labels
                    cleanUp();
                    let education = element.attributes.education_key.value;
                    for (let i = 0; i < educationArray.length; i++)
                    {
                        if (education == educationArray[ i ][ 0 ])
                        {
                            var educationIDs = educationArray[ i ][ 1 ];
                            break;
                        }

                    }
                    showVehicles(educationIDs);
                }

            })
        });

    }
    return;

})();
function cleanUp()
{
    let vehicleLabel = document.querySelectorAll(".label", ".label - success");
    vehicleLabel.forEach(element =>
    {
        element.remove();
    });
}
function showVehicles(vehicleIDArray)
{
    var buildings = [].slice.call(document.getElementById("accordion").children);
    if (!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId != user_id)
    {
        $.getJSON('/api/vehicles').done(data => sessionStorage.setItem('aVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
    }
    var aVehicles = JSON.parse(sessionStorage.aVehicles).value;

    for (let j = 0; j < vehicleIDArray.length; j++)
    {
        for (let l = 0; l < buildings.length; l++)
        {
            let buildingsChild = buildings[ l ].firstElementChild

            for (let k = 0; k < aVehicles.length; k++)
            {
                if (buildingsChild.attributes.building_id.value == aVehicles[ k ].building_id && vehicleIDArray[ j ] == aVehicles[ k ].vehicle_type)
                {
                    var span = document.createElement("span");
                    span.classList.add("label", "label-info");
                    span.innerText = aVehicles[ k ].caption;
                    buildingsChild.firstElementChild.appendChild(span);
                }
            }
        }
    }

}