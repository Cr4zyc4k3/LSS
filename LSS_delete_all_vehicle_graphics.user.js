// ==UserScript==
// @name         LSS delete all vehicle graphics
// @namespace    https://www.leitstellenspiel.de
// @version      0.1
// @description  Deletes all vehicle graphics
// @author      Crazycake
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|jogo-operador112\.com|operador193\.com|dyspetcher101-game\.com|missionchief-japan\.com|missionchief-korea\.com|jocdispecerat112\.com|hatakeskuspeli\.com|dispecerske-centrum\.com)\/.?.?$/
// @grant       none
// ==/UserScript==
run();
async function run() {
    if(!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId != user_id) {
        await $.getJSON('/api/vehicles').done(data => sessionStorage.setItem('aVehicles', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: user_id})) );
    }
    var aVehicles = JSON.parse(sessionStorage.aVehicles).value;
    for(let i=0;i<aVehicles.length;i++){
        await $.get(`/vehicle_graphic_image_search/${aVehicles[i].id}/set/-1`);
        sleep(100);
        console.log("Bild von Fahrzeug "+aVehicles[i].caption+" gelöscht");
    }
}
//Copied from: https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
