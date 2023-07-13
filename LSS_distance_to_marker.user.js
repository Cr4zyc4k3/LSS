// ==UserScript==
// @name         Distance to marker
// @version      1.0
// @description:de Berechnet die Distanz und Anfahrtsdauer von einer Wache zum Marker
// @author       Crazycake
// @match        https://www.leitstellenspiel.de/
// @match        https://leitstellenspiel.de/
// @downloadURL  https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_distance_to_marker.user.js
// @updateURL    https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_distance_to_marker.user.js
// @grant        none
// @run-at document-idle
// ==/UserScript==
'use strict';

let ccDtMLayerGroup = L.layerGroup().addTo(window.map);
let ccDtMLayerGroupMarker = L.layerGroup().addTo(window.map);
let aBuildings = await callAPI();

async function callAPI() {
    if (!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aBuildings).userId !== window.user_id) {
        await fetch('/api/buildings')
            .then(data => data.json())
            .then(data => sessionStorage.setItem('aBuildings', JSON.stringify({
                lastUpdate: new Date().getTime(), value: data, userId: window.user_id
            })));
        return JSON.parse(sessionStorage.getItem("aBuildings")).value;
    }
}


//Button to open
const map = document.getElementById("map");
let startBtn = document.createElement('a');
startBtn.classList.add("leaflet-bar", "leaflet-control", "leaflet-control-custom");
startBtn.id = "ccDtM"
startBtn.style.backgroundColor = "white";
startBtn.style.width = "26px";
startBtn.style.height = "26px";
startBtn.style.display = "flex";
startBtn.style.alignItems = "center";
startBtn.style.justifyContent = "center";
let span = document.createElement('span');
span.classList.add("glyphicon", "glyphicon-road");
startBtn.appendChild(span);
const bottomRight = document.getElementsByClassName('leaflet-bottom leaflet-right')[0];
const firstChild = bottomRight.firstChild;
bottomRight.insertBefore(startBtn, firstChild);
startBtn.addEventListener('click', toggleVisibility);

//Dialog Element
const rowMainTemplate = document.getElementById("row-main-template");
const missionsOuter = document.getElementById("missions_outer");

let configDiv = document.createElement("div");
configDiv.classList.add("col-sm-4", "hidden");
configDiv.id = "ccDtMconfigDiv";
configDiv.style.height = "560px";

let select = document.createElement("select");
select.id = "ccDtMSelect"
select.addEventListener("change", function () {
    if (this.options[this.selectedIndex].value === -1) {
        document.getElementById("ccDtMmarkerBtn").disabled = true;
        document.getElementById("ccDtMmarkerBtn").classList.add("btn-danger");
        document.getElementById("ccDtMmarkerBtn").classList.remove("btn-success");
    } else {
        document.getElementById("ccDtMmarkerBtn").disabled = false;
        document.getElementById("ccDtMmarkerBtn").classList.add("btn-success");
        document.getElementById("ccDtMmarkerBtn").classList.remove("btn-danger");
    }
})
//create a descriptive disabled start option. Value is set to check on API call whether this is a valid option
let startOption = document.createElement("option");
startOption.innerText = "Gebäude auswählen";
startOption.disabled = true;
startOption.selected = true;
startOption.value = -1;
select.appendChild(startOption);

// Create an option for each building
await aBuildings.forEach(element => {
    let optionTag = document.createElement("option");
    optionTag.setAttribute("data-lat", element.latitude);
    optionTag.setAttribute("data-lon", element.longitude);
    optionTag.innerText = element.caption;
    select.appendChild(optionTag);
})

let markerBtn = document.createElement("button");
markerBtn.innerText = "Route berechnen";
markerBtn.id = "ccDtMmarkerBtn";
markerBtn.classList.add("btn", "btn-xs", "ml-1")
markerBtn.disabled = true;
markerBtn.addEventListener("click", getRoute);
configDiv.appendChild(select);
configDiv.appendChild(markerBtn);

let distanceDiv = document.createElement("div");
const distanceDivText = document.createElement("div");
let distanceDivValue = document.createElement("div");
distanceDivValue.id = "ccDtMDistanceDivValue";
distanceDivValue.innerText = "0 km";
distanceDivText.innerHTML = "<b>Entfernung:</b> ";
distanceDivValue.style.display = "inline";
distanceDivText.style.display = "inline";
distanceDiv.appendChild(distanceDivText);
distanceDiv.appendChild(distanceDivValue);
configDiv.appendChild(distanceDiv);

let durationDiv = document.createElement("div");
const durationDivText = document.createElement("div");
let durationDivValue = document.createElement("div");
durationDivValue.id = "ccDtMDurationDivValue";
durationDivValue.innerText = "0:00";
durationDivText.innerHTML = "<b>Dauer:</b> ";
durationDivValue.style.display = "inline";
durationDivText.style.display = "inline";
durationDiv.appendChild(durationDivText);
durationDiv.appendChild(durationDivValue);
configDiv.appendChild(durationDiv);


//to prevent that the marker is hidden under a building a zIndexOffset
const marker = L.marker([window.map.getCenter().lat, window.map.getCenter().lng], {
    draggable: 'true', zIndexOffset: 100
}).addTo(ccDtMLayerGroupMarker);

configDiv.appendChild(select);
configDiv.appendChild(markerBtn);
rowMainTemplate.insertBefore(configDiv, missionsOuter);


function toggleVisibility() {
    if (!configDiv.classList.contains("hidden")) {
        document.getElementById("missions_outer").classList.remove("hidden");
        configDiv.classList.add("hidden");
    } else {
        document.getElementById("missions_outer").classList.add("hidden");
        configDiv.classList.remove("hidden");
    }
}

async function getRoute() {
    const buildingLatLng = {
        'lat': document.getElementById("ccDtMSelect").selectedOptions[0].dataset.lat,
        'lng': document.getElementById("ccDtMSelect").selectedOptions[0].dataset.lon
    }
    const markerLatLng = {
        'lat': marker._latlng.lat, 'lng': marker._latlng.lng
    }
    document.getElementById("ccDtMmarkerBtn").disabled = true;
    document.getElementById("ccDtMmarkerBtn").classList.remove("btn-success");
    document.getElementById("ccDtMmarkerBtn").classList.add("btn-info");
    await fetch(`https://osrm.missionchief.com/viaroute?loc=${buildingLatLng.lat},${buildingLatLng.lng}&loc=${markerLatLng.lat},${markerLatLng.lng}&compression=false`, {
        /*headers: {
            'X-Thirdparty-Script': 'Crazycake Distance to Marker'
        }*/
    })
        .then(data => data.json())
        .then(data => {
            if (data.status === 200) {
                ccDtMLayerGroup.clearLayers();
                L.polyline(data.route_geometry, {color: 'blue'}).addTo(ccDtMLayerGroup);
                document.getElementById("ccDtMDistanceDivValue").innerText = ((data.route_summary.total_distance) / 1000).toFixed(2).toLocaleString("de") + " km"
                document.getElementById("ccDtMDurationDivValue").innerText = new Date(1000 * data.route_summary.total_time).toISOString().substring(11, 19);
            }
        })
    setTimeout(function () {
        document.getElementById("ccDtMmarkerBtn").disabled = false;
        document.getElementById("ccDtMmarkerBtn").classList.add("btn-success");
        document.getElementById("ccDtMmarkerBtn").classList.remove("btn-info");
    }, 5000)
}