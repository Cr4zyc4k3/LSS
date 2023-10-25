// ==UserScript==
// @name            LSS find DGL duplicates
// @version         1.0.0
// @description     Finds two or more vehicle on one station
// @description:de  Gibt die Wachen aus, wo zwei, oder mehr, DGL stehen
// @author          Crazycake
// @match           https://www.leitstellenspiel.de/*
// @grant           none
// ==/UserScript==

(async function () {
    'use strict';
    //Hier ändern, falls anderer Fahrzeugtyp benötigt wird. Diese kann man unter https://api.lss-manager.de/[lang]/vehicles rausfinden
    const wantedVehicleTypeID = 103;
    const getThisPartyStartedBtn = document.createElement("btn");
    getThisPartyStartedBtn.id = 'getThisPartyStartedBtn';
    getThisPartyStartedBtn.innerText = "Finde alle doppelten DGL";
    getThisPartyStartedBtn.classList.add("btn", "btn-small", "btn-default");
    getThisPartyStartedBtn.addEventListener("click", () => {
        init(wantedVehicleTypeID);
    }, false);
    document.querySelector("#navbar-main-collapse").appendChild(getThisPartyStartedBtn);
})();

async function init(wantedVehicleTypeID) {
    const dialog = document.createElement('dialog');
    dialog.id = 'CCDGLFinderDialog';
    dialog.style = 'visible=false';
    let dialogCloseBtn = document.createElement('button');
    dialogCloseBtn.innerText = "schließen";
    dialogCloseBtn.classList.add("btn","btn-small", "btn-info")
    dialogCloseBtn.addEventListener('click', () => {
        dialog.close();
    });
    dialog.appendChild(dialogCloseBtn);
    document.body.appendChild(dialog);

    //Lade Gebäude und API
    const [vehicles, buildings] = await loadRequiredAPIs();
    //Filter alle DGL raus
    const DGL = vehicles.filter(ele => ele.vehicle_type === wantedVehicleTypeID);
    //Schreib die Wachen IDs in einen Array
    let Wachen = [];
    DGL.forEach(fz => Wachen.push(fz.building_id));
    //Ein sehr schneller (und hässlicher Weg) um alle Duplikate in einem Array zu finden
    const duplikate = Wachen.filter((e, i, a) => a.indexOf(e) !== i)

    //Noch mehr Ninja Coding um den Namen und die URL der Wachen zu erstellen, welche doppelte Fahrzeuge haben.
    let returnArray = []

    for (let i = 0; i < duplikate.length; i++) {
        const found = buildings.find(x => x.id === duplikate[i]);
        returnArray.push([found.caption, found.id]);
    }
    //returnArray.forEach(x => console.log(x));
    returnArray.forEach(x => dialog.insertAdjacentHTML('afterbegin', `<p>Wache <a href="/buildings/${x[1]}" target="_blank"> ${x[0]} </a>hat mehr als einen DGL </p>`))
    dialog.showModal();
}

async function loadRequiredAPIs() {
    //Lade die Fahrzeuge von der API und schreibe sie in den SessionStorage
    if (!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId !== user_id) {
        await fetch('/api/vehicles').then(res => res.json()).then(data => sessionStorage.setItem('aVehicles', JSON.stringify({
            lastUpdate: new Date().getTime(),
            value: data,
            userId: user_id
        })));
    }
    const aVehicles = JSON.parse(sessionStorage.aVehicles).value;
    //Lade die Gebäude von der API und schreibe sie in den SessionStorage
    if (!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aBuildings).userId !== user_id) {
        await fetch('/api/buildings').then(res => res.json()).then(data => sessionStorage.setItem('aBuildings', JSON.stringify({
            lastUpdate: new Date().getTime(),
            value: data,
            userId: user_id
        })));
    }
    const aBuildings = JSON.parse(sessionStorage.aBuildings).value
    return [aVehicles, aBuildings];
}