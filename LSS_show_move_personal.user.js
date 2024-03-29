// ==UserScript==
// @name        LSS show move personal
// @version     1.0
// @author      Crazycake, Ron31
// @description How much personal is on the buildings you want to move from.
// @include     https://www.leitstellenspiel.de/buildings/*/hire
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    alert(`Das Skript ist mittlerweile nativ ins Spiel implementiert! (s. https://forum.leitstellenspiel.de/index.php?thread/19294-skriptwunsch-personalanzeige-personal-verschieben/&postID=450769#post450769) und wird nur noch für didaktische Zwecke zur Verfügung gestellt.`);
    return;
    if (!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).userId !== user_id || JSON.parse(sessionStorage.aBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) {
        $.getJSON('/api/buildings').done(data => sessionStorage.setItem('aBuildings', JSON.stringify({ lastUpdate: new Date().getTime(), value: data, userId: user_id })));
    }
    const aBuildings = JSON.parse(sessionStorage.aBuildings).value;

    let wachen = document.getElementsByClassName("panel-heading personal-select-heading");

    for (let wache of wachen) {
        const wacheID = wache.getAttribute("building_id");
        for (let i = 0; i < aBuildings.length; i++) {
            if (wacheID == aBuildings[i].id) {
                const personal_count = aBuildings[i].personal_count;
                wache.textContent += " | Personal: " + personal_count;

            }
        }

    }

}());
