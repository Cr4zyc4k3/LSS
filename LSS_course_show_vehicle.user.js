// ==UserScript==
// @name        LSS Course show vehicles
// @version     1.0.6
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/schoolings\/\d+$
// @include     /^https?:\/\/(?:w{3}\.)?(?:polizei.)?(?:leitstellenspiel\.de)\/buildings\/\d+$
// @grant       none
// @UpdateURL   https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_building_notes.user.js
// ==/UserScript==

//education and the vehicles whom need them. de_DE only!
const educationArray = [
    ["gw_messtechnik", [12]],
    ["gw_gefahrgut", [27, 77]],
    ["gw_hoehenrettung", [33]],
    ["elw2", [34, 78]],
    ["wechsellader", [46]],
    ["dekon_p", [53, 54]],
    ["fwk", [57]],
    ["arff", [75]],
    ["rettungstreppe", [76]],
    ["werkfeuerwehr", [83, 85, 86]],
    ["notarzt", [29, 31, 73, 74, 97]],
    ["lna", [55]],
    ["orgl", [56]],
    ["seg_elw", [59]],
    ["seg_gw_san", [60]],
    ["gw_wasserrettung", [64, 65]],
    ["gw_taucher", [63, 69]],
    ["seg_rescue_dogs", [91]],
    ["intensive_care", [97]],
    ["police_einsatzleiter", [35]],
    ["police_fukw", [51]],
    ["polizeihubschrauber", [61]],
    ["police_wasserwerfer", [72]],
    ["police_sek", [79, 80]],
    ["police_mek", [81, 82]],
    ["k9", [94]],
    ["police_motorcycle", [95]],
    ["police_firefighting", [96]],
    ["thw_zugtrupp", [40]],
    ["thw_raumen", [42, 45]],
    ["thw_rescue_dogs", [93]]
];
const educationArrayVB = [
    ["GW-Messtechnik Lehrgang", [12]],
    ["GW-Gefahrgut Lehrgang", [27, 77]],
    ["Höhenrettung Lehrgang", [33]],
    ["ELW 2 Lehrgang", [34, 78]],
    ["Wechsellader Lehrgang", [46]],
    ["Dekon-P Lehrgang", [53, 54]],
    ["Feuerwehrkran Lehrgang", [57]],
    ["Flugfeldlöschfahrzeug-Ausbildung", [75]],
    ["Rettungstreppen-Ausbildung", [76]],
    ["Werkfeuerwehr-Ausbildung", [83, 85, 86]],
    ["Notarzt-Ausbildung", [29, 31, 73, 74, 97]],
    ["LNA-Ausbildung", [55]],
    ["OrgL-Ausbildung", [56]],
    ["SEG - Einsatzleitung", [59]],
    ["SEG - GW-San", [60]],
    ["GW-Wasserrettung Lehrgang", [64, 65]],
    ["GW-Taucher Lehrgang", [63, 69]],
    ["Rettungshundeführer (SEG)", [91]],
    ["Intensivpflege", [97]],
    ["Zugführer (leBefKw)", [35]],
    ["Hundertschaftsführer (FüKw)", [51]],
    ["Polizeihubschrauber", [61]],
    ["Wasserwerfer", [72]],
    ["SEK", [79, 80]],
    ["MEK", [81, 82]],
    ["Hundeführer (Schutzhund)", [94]],
    ["Motorradstaffel", [95]],
    ["Brandbekämpfung", [96]],
    ["Zugtrupp", [40]],
    ["Fachgruppe Räumen", [42, 45]],
    ["Wassergefahren Lehrgang", [64, 65]],
    ["Bergungstaucher Lehrgang", [63, 69]],
    ["Rettungshundeführer (THW)", [93]]
];
var showOnlyExistence;


(function () {

    'use strict';
   
    if (localStorage.getItem("ccCourseShow")!=null) {
        showOnlyExistence = localStorage.getItem("ccCourseShow");
        
    }
    else{
        showOnlyExistence = false;
        localStorage.setItem("ccCourseShow", false);
    }
    
    document.querySelectorAll(".alert", ".alert-info")[0].insertAdjacentHTML("afterend","<div class='alert alert-info' id='ccShowCourseOptionDiv'><input type='checkbox' id='ccShowCourseOptionCheckbox'> Nur Anzeigen, ob Fahrzeug(e) existieren.</div>");
    document.getElementById("ccShowCourseOptionCheckbox").addEventListener("change", function(){
        if(document.getElementById("ccShowCourseOptionCheckbox").checked)
        {
            showOnlyExistence = true;
            localStorage.setItem("ccCourseShow", true);
        }
        else{
            showOnlyExistence = false;
            localStorage.setItem("ccCourseShow", false);
        }
    })

    //check whether this is a building and a school
    if (window.location.pathname.split("/")[1] == "buildings" && document.getElementById("schooling") != null) {
        //get all input education buttons
        const inputs = document.querySelectorAll("input[id^=education_]");
        inputs.forEach(element => {
            //Adding eventlistener to each input
            element.addEventListener("click", function () {
                //checking whether this input is really checked
                if (element.checked) {
                    //delete all existing labels
                    cleanUp();
                    let education = element.attributes.education_key.value;
                    for (let i = 0; i < educationArray.length; i++) {
                        if (education == educationArray[i][0]) {
                            var educationIDs = educationArray[i][1];
                            break;
                        }

                    }
                    showVehicles(educationIDs);
                }

            })
        });

    }
    //URL is /schooling
    else if (window.location.pathname.split("/")[1] == "schoolings" && document.getElementById("accordion") != null) {
        //delete all exisitng labels
        cleanUp();
        //get education
        let education = document.getElementsByTagName("h2")[0].innerHTML;
        //check educationtype in array
        for (let i = 0; i < educationArrayVB.length; i++) {
            if (education == educationArrayVB[i][0]) {
                var educationIDs = educationArrayVB[i][1];
                break;
            }

        }
        showVehicles(educationIDs);
    }
    return;

})();

//delete all labels
function cleanUp() {
    //get all labels
    let vehicleLabel = document.querySelectorAll("[id^=ccShowCourse_");
    vehicleLabel.forEach(element => {
        element.remove();
    });
}

//show vehicles async for call at API
async function showVehicles(vehicleIDArray) {

    //Try-Catch for timeout/overflow
    try {
        if (!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId != user_id) {
            await $.getJSON('/api/vehicles').done(data => sessionStorage.setItem('aVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
        }
        var aVehicles = JSON.parse(sessionStorage.aVehicles).value;
    } catch (error) {
        console.error("Cant read Vehicle data");
    }
    var buildings = [].slice.call(document.getElementById("accordion").children);

    //1. loop for all vehicles who need this education
    loop1: for (let j = 0; j < vehicleIDArray.length; j++) {
        //2. Loop for all buildings availible
        loop2: for (let l = 0; l < buildings.length; l++) {
            let buildingsChild = buildings[l].firstElementChild
            //3. Loop for all vehicles 
            loop3: for (let k = 0; k < aVehicles.length; k++) {
                if (buildingsChild.attributes.building_id.value == aVehicles[k].building_id && vehicleIDArray[j] == aVehicles[k].vehicle_type) {
                    if (!showOnlyExistence) {
                        var span = document.createElement("span");
                        span.id = "ccShowCourse_" + aVehicles[k].id;
                        span.classList.add("label", "label-info");
                        span.innerText = aVehicles[k].caption;
                        buildingsChild.firstElementChild.appendChild(span);
                    }
                    else {
                        span = document.createElement("span");
                        span.id = "ccShowCourse_" + aVehicles[k].id;
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