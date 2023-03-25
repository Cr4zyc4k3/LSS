// ==UserScript==
// @name         Backalarm standalone
// @version      1.0
// @description  Alle/RD zurückalarmieren
// @author       Crazycake
// @match        https://www.leitstellenspiel.de/missions/*
// @downloadURL  https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_backalarm_standalone.user.js
// @updateURL    https://github.com/Cr4zyc4k3/LSS/raw/main/LSS_backalarm_standalone.user.js
// @grant        none
// ==/UserScript==
'use strict';




let keysPressed ={};
//1 => Alle; 0 => RD
const backalarmAll = 0;
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;

    //Prevent executing while using some control keys
    if (keysPressed['Control'] || keysPressed['Shift'] || keysPressed['Alt'] ||  keysPressed['AltGraph']) {
        return;
    }
    else if(keysPressed['r'] && keysPressed['1'])
    {
        if(backalarmAll) {
          document.querySelectorAll("a[href$='/backalarmAll']")[0]?.click();
          return;
        }
        document.querySelectorAll("a[href$='/backalarmRettungsdienst']")[0]?.click();
    }
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});




