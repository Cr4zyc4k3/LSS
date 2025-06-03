// ==UserScript==
// @name        LSS Course show vehicles
// @version     1.0.2
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/(schoolings|buildings)\/\d+$
// @grant       none
// @UpdateURL   https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_course_show_vehicle.user.js
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// ==/UserScript==

const disableOptions = false;

//education and the vehicles whom need them. de_DE only!
const educationArray = [
    [ "gw_messtechnik", [ 12 ] ],
    [ "gw_gefahrgut", [ 27, 77 ] ],
    [ "gw_hoehenrettung", [ 33 ] ],
    [ "elw2", [ 34, 78, 129 ] ],
    [ "wechsellader", [ 46 ] ],
    [ "dekon_p", [ 53, 54 ] ],
    [ "fwk", [ 57 ] ],
    [ "arff", [ 75 ] ],
    [ "rettungstreppe", [ 76 ] ],
    [ "werkfeuerwehr", [ 83, 84, 85, 86 ] ],
    [ "notarzt", [ 29, 31, 73, 74, 97, 149, 157 ] ],
    [ "lna", [ 55 ] ],
    [ "orgl", [ 56 ] ],
    [ "seg_elw", [ 59 ] ],
    [ "seg_gw_san", [ 60 ] ],
    [ "gw_wasserrettung", [ 64, 65, 66, 67, 68, 70, 71 ] ],
    [ "gw_taucher", [ 63, 69 ] ],
    [ "seg_rescue_dogs", [ 91, 153 ] ],
    [ "intensive_care", [ 97 ] ],
    [ "police_einsatzleiter", [ 35 ] ],
    [ "police_fukw", [ 51 ] ],
    [ "polizeihubschrauber", [ 61, 156 ] ],
    [ "police_wasserwerfer", [ 72 ] ],
    [ "police_sek", [ 79, 80 ] ],
    [ "police_mek", [ 81, 82 ] ],
    [ "k9", [ 94 ] ],
    [ "police_motorcycle", [ 95 ] ],
    [ "police_firefighting", [ 96 ] ],
    [ "thw_zugtrupp", [ 40 ] ],
    [ "thw_raumen", [ 42, 45 ] ],
    [ "thw_rescue_dogs", [ 93 ] ],
    [ "water_damage_pump", [100, 101, 102, 123]],
    [ "criminal_investigation", [98]],
    [ "police_service_group_leader", [103]],
    [ "seg_drone",[127]],
    [ "care_service",[131,130,133]],
    [ "care_service_equipment",[130,133, 138, 139]],
    [ "energy_supply", [113]],
    [ "thw_energy_supply", [112]],
    [ "fire_drone", [126, 128, 129]],
    [ "fire_care_service", [138, 139, 140]],
    [ "police_horse", [134, 135, 136, 137]],
    [ "heavy_rescue", [109]],
    [ "thw_drone", [125]],
    [ "thw_command", [144, 145, 147, 148]],
    [ "police_helicopter_lift", [ 156 ]],
    [ "rescue_helicopter_lift", [ 157 ]],
    [ "police_speaker_operator", [ 165 ]],
    [ "railway_fire", [162, 163, 164]],
    [ "mountain_height_rescue", [155, 158]],
    [ "mountain_command", [ 151 ]],
    [ "coastal_rescue", [ 159 ]],
    [ "coastal_helicopter", [ 161 ]],
    [ "coastal_helicopter_lift", [ 161 ]],
    [ "emergency_paramedic_water_rescue", [ 161 ]]
];
const educationArrayVB = [
    [ "GW-Messtechnik Lehrgang", [ 12 ] ],
    [ "GW-Gefahrgut Lehrgang", [ 27, 77 ] ],
    [ "Höhenrettung Lehrgang", [ 33 ] ],
    [ "ELW 2 Lehrgang", [ 34, 78, 129 ] ],
    [ "Wechsellader Lehrgang", [ 46 ] ],
    [ "Dekon-P Lehrgang", [ 53, 54 ] ],
    [ "Feuerwehrkran Lehrgang", [ 57 ] ],
    [ "Flugfeldlöschfahrzeug-Ausbildung", [ 75 ] ],
    [ "Rettungstreppen-Ausbildung", [ 76 ] ],
    [ "Werkfeuerwehr-Ausbildung", [ 83, 84, 85, 86 ] ],
    [ "Notarzt-Ausbildung", [ 29, 31, 73, 74, 97, 149, 157 ] ],
    [ "LNA-Ausbildung", [ 55 ] ],
    [ "OrgL-Ausbildung", [ 56 ] ],
    [ "SEG - Einsatzleitung", [ 59 ] ],
    [ "SEG - GW-San", [ 60 ] ],
    [ "GW-Wasserrettung Lehrgang", [ 64, 65, 66, 67, 68, 70, 71 ] ],
    [ "GW-Taucher Lehrgang", [ 63, 69 ] ],
    [ "Rettungshundeführer (SEG)", [ 91, 153 ] ],
    [ "Intensivpflege", [ 97 ] ],
    [ "Zugführer (leBefKw)", [ 35 ] ],
    [ "Hundertschaftsführer (FüKw)", [ 51 ] ],
    [ "Polizeihubschrauber", [ 61, 156 ] ],
    [ "Wasserwerfer", [ 72 ] ],
    [ "SEK", [ 79, 80 ] ],
    [ "MEK", [ 81, 82 ] ],
    [ "Hundeführer (Schutzhund)", [ 94 ] ],
    [ "Motorradstaffel", [ 95 ] ],
    [ "Brandbekämpfung", [ 96 ] ],
    [ "Zugtrupp", [ 40 ] ],
    [ "Fachgruppe Räumen", [ 42, 45 ] ],
    [ "Wassergefahren Lehrgang", [ 64, 65 ] ],
    [ "Bergungstaucher Lehrgang", [ 63, 69 ] ],
    [ "Rettungshundeführer (THW)", [ 93 ] ],
    [ "Fachgruppe Wasserschaden/Pumpen", [100, 101, 102, 123]],
    [ "Kriminalpolizei", [98]],
    [ "Dienstgruppenleitung", [103]],
    [ "SEG Drohne",[127]],
    [ "Betreuungshelfer", [131,130,133]],
    [ "Verpflegungshelfer", [130,133, 138, 139]],
    [ "NEA200 Fortbildung", [113]],
    [ "Fachgruppe Elektroversorgung", [112]],
    [ "Drohnen-Schulung", [126, 128, 129]],
    [ "Feuerwehr-Verpflegungseinheit", [139, 139, 140]],
    [ "Reiterstaffel", [134, 135, 136, 137]],
    [ "Fachgruppe Schwere Bergung", [109]],
    [ "Trupp Unbemannte Luftfahrtsysteme", [125]],
    [ "Fachzug Führung und Kommunikation", [144, 145, 147, 148]],
    [ "Windenoperator", [ 156 ]],
    [ "Windenoperator", [ 157 ]],
    [ "Lautsprecheroperator", [ 165 ]],
    [ "Bahnrettung", [162, 163, 164]],
    [ "Höhenretter", [155, 158]],
    [ "Einsatzleiter Bergrettung", [ 151 ]],
    [ "Seenotretter", [ 159 ]],
    [ "Hubschrauberpilot (Seenotrettung)", [ 161 ]],
    [ "Windenoperator", [ 161 ]],
    [ "Wasserrettungsausbildung für Notfallsanitäter", [ 161 ]]
];
var showOnlyExistence;


(function ()
{

    'use strict';

    if (localStorage.getItem("ccCourseShow") != null)
    {
        showOnlyExistence = localStorage.getItem("ccCourseShow");

    }
    else
    {
        showOnlyExistence = false;
        localStorage.setItem("ccCourseShow", false);
    }
    if ((document.getElementById("schooling") != null || document.getElementById("accordion") != null) && !disableOptions)
    {
        document.querySelectorAll(".alert", ".alert-info")[ 0 ].insertAdjacentHTML("afterend", "<div class='alert alert-info' id='ccShowCourseOptionDiv'><input type='checkbox' id='ccShowCourseOptionCheckbox'> Nur Anzeigen, ob Fahrzeug(e) existieren.</div>");
        document.getElementById("ccShowCourseOptionCheckbox").addEventListener("change", function ()
        {
            showOnlyExistence = document.getElementById("ccShowCourseOptionCheckbox").checked;
            localStorage.setItem("ccCourseShow", showOnlyExistence);
        })
    }

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
    //URL is /schooling
    else if (window.location.pathname.split("/")[ 1 ] == "schoolings" && document.getElementById("accordion") != null)
    {
        //delete all exisitng labels
        cleanUp();
        //get education
        let education = document.getElementsByTagName("h2")[ 0 ].innerHTML;
        //check educationtype in array
        for (let i = 0; i < educationArrayVB.length; i++)
        {
            if (education == educationArrayVB[ i ][ 0 ])
            {
                var educationIDs = educationArrayVB[ i ][ 1 ];
                break;
            }

        }
        showVehicles(educationIDs);
    }
    return;

})();

//delete all labels
function cleanUp()
{
    //get all labels
    let vehicleLabel = document.querySelectorAll("[id^=ccShowCourse_]");
    vehicleLabel.forEach(element =>
    {
        element.remove();
    });
}

//show vehicles async for call at API
async function showVehicles(vehicleIDArray)
{

    //Try-Catch for timeout/overflow
    try
    {
        if (!localStorage.cVehicles || JSON.parse(localStorage.cVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(localStorage.cVehicles).userId != user_id)
        {
            await $.getJSON('/api/vehicles').done(data => localStorage.setItem('cVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), compressed: true, value: LZString.compressToUTF16(JSON.stringify(data)), userId: user_id })));
        }
        var aVehiclesContainer = JSON.parse(localStorage.cVehicles);
        var aVehicles = (aVehiclesContainer.compressed) ? JSON.parse(LZString.decompressFromUTF16(aVehiclesContainer.value)) : aVehiclesContainer.value;
    } catch (error)
    {
        console.error("Cant read Vehicle data");
    }
    var buildings = [].slice.call(document.getElementById("accordion").children);

    //1. loop for all vehicles who need this education
    loop1: for (let j = 0; j < vehicleIDArray.length; j++)
    {
        //2. Loop for all buildings availible
        loop2: for (let l = 0; l < buildings.length; l++)
        {
            let buildingsChild = buildings[ l ].firstElementChild
            //3. Loop for all vehicles
            loop3: for (let k = 0; k < aVehicles.length; k++)
            {
                if (buildingsChild.attributes.building_id.value == aVehicles[ k ].building_id && vehicleIDArray[ j ] == aVehicles[ k ].vehicle_type)
                {
                    if (!showOnlyExistence)
                    {
                        var span = document.createElement("span");
                        span.id = "ccShowCourse_" + aVehicles[ k ].id;
                        span.classList.add("label", "label-info");
                        span.innerText = aVehicles[ k ].caption;
                        buildingsChild.firstElementChild.appendChild(span);
                    }
                    else
                    {
                        span = document.createElement("span");
                        span.id = "ccShowCourse_" + aVehicles[ k ].id;
                        span.classList.add("label", "label-info");
                        span.innerText = "Fahrzeug vorhanden"
                        buildingsChild.firstElementChild.appendChild(span);
                        //jump to next building
                        continue loop2;
                    }
                }
            }
        }
    }

}