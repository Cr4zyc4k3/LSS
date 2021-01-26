// ==UserScript==
// @name        LSS New building vehicle sort
// @version     1.0.0
// @description Sorts the list of vehicles in the building dialog
// @author      Crazycake
// @include     /https:\/\/www.leitstellenspiel.de/
// @grant       none
// ==/UserScript==

(function () {
    'use strict';

    let observer = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            const form = mutation.target.querySelector("#new_building");
            if(form != null)
            {
                document.getElementById("building_building_type").addEventListener("focusout", function() {
                    var buildingID = document.getElementById("building_building_type").value;
                    if(buildingID == 0) {
                        document.getElementById("building_start_vehicle_feuerwache").innerHTML = '<option value="" disabled>----------LF----------</option><option value="9">LF 16-TS 0l</option><option value="6">LF 8/6 600l</option><option value="8">LF 10/6 600l</option><option value="1">LF 10 1200l</option><option value="7">LF 20/16 1600l</option><option value="0">LF 20 2000l</option><option value="" disabled>----------HLF---------</option><option value="30" selected>HLF 20 1600l + RW</option><option value="90">HLF 10 1000l + RW</option><option value="" disabled>-------Sonstige-------</option><option value="37">TSF-W 500l</option><option value="88">KLF 500l</option><option value="89">MLF 500l</option>'
                    }
                    else if(buildingID == 18) {
                        document.getElementById("building_start_vehicle_feuerwache_kleinwache").innerHTML = '<option value="" disabled>----------LF----------</option><option value="9">LF 16-TS 0l</option><option value="6">LF 8/6 600l</option><option value="8">LF 10/6 600l</option><option value="1">LF 10 1200l</option><option value="7">LF 20/16 1600l</option><option value="0">LF 20 2000l</option><option value="" disabled>----------HLF---------</option><option value="30" selected>HLF 20 1600l + RW</option><option value="90">HLF 10 1000l + RW</option><option value="" disabled>-------Sonstige-------</option><option value="37">TSF-W 500l</option><option value="88">KLF 500l</option><option value="89">MLF 500l</option>'
                    }
                })
            }
        })
    });

    observer.observe(document.getElementById("buildings"), {
        childList: true,
    });



})();