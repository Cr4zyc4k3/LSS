// ==UserScript==
// @name        LSS custom AAO reset
// @version     1.0
// @author      Crazycake
// @include     *leitstellenspiel.de/missions/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';
    $('#aao_14167103').empty().text("Reset").addClass("btn-info btn-lg").removeClass("btn-xs aao aao_searchable aao_btn");
}());