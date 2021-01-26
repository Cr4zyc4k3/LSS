// ==UserScript==
// @name        LSS delete multiple AAOs
// @version     1.0
// @author      Crazycake
// @include     *.leitstellenspiel.de/aaos*
// @description Allows you to delete multiple AAOs at once
// @grant       none
// ==/UserScript==

(function () {
    'use strict';
    sleep(100);
    if (sessionStorage.getItem('LSS_crazycakeselectedAAOs') != null) {
        deleteSelectedAAOs();
    }
    var crazycakeselectedAAOs = [];
    $("#tutorial_video_show").parent().before('<div class="btn-group"><a href="#" class="btn btn-xs btn-danger" id="crazycakeDeleteSelectedAAOs">Ausgewählte AAOs löschen</a><a href="#" class="btn btn-xs btn-default" id="crazycakeToggleAAOs">AAOs auswählen</a></div>');
    $('#crazycakeToggleAAOs').on('click', function () {
        $(this).toggleClass('btn-default btn-success');
        if ($(this).hasClass('btn-success')) {
            deleteBtnDisable();
            selectAAOs();
        }
        else {
            deleteBtnEnable();
        }
        $('#crazycakeDeleteSelectedAAOs').on('click', function (event) {
            event.preventDefault();
            deleteSelectedAAOs();
        })

        function selectAAOs() {
            $('a[href*="/aaos/"]').on('click', function (event) {
                if ($(this).attr('href').search(/\d/) != -1) {
                    event.preventDefault();
                    if (!$(this).hasClass('crazycakeSelectedAAO')) {
                        $(this).addClass('crazycakeSelectedAAO');
                        $(this).before('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
                        $(this).prev().attr('id', 'crazycakeAAOId' + $(this).attr('href').split('/')[2]);
                        crazycakeselectedAAOs.push($(this).attr('href').split('/')[2]);
                        sessionStorage.setItem('LSS_crazycakeselectedAAOs', crazycakeselectedAAOs);
                    } else {
                        $(this).removeClass('crazycakeSelectedAAO');
                        $(this).prev().remove();
                        for (var i = 0; i < crazycakeselectedAAOs.length; i++) {
                            if (crazycakeselectedAAOs[i] === $(this).attr('href').split('/')[2]) {
                                crazycakeselectedAAOs.splice(i, 1);
                            }
                        }
                        sessionStorage.setItem('LSS_crazycakeselectedAAOs', crazycakeselectedAAOs);
                    }
                }
            })
        }
        function deleteBtnEnable() {
            $('#crazycakeDeleteSelectedAAOs').removeClass('disabled');
        }
        function deleteBtnDisable() {
            $('#crazycakeDeleteSelectedAAOs').addClass('disabled');

        }

    })
    function deleteSelectedAAOs() {
        let selectedAAOs = sessionStorage.getItem('LSS_crazycakeselectedAAOs');
        var selectedAAOsArr = []
        selectedAAOsArr = selectedAAOs.split(',');
        var currentDeleteID = selectedAAOsArr.shift();
        selectedAAOs = selectedAAOsArr.join();
        sessionStorage.setItem('LSS_crazycakeselectedAAOs', selectedAAOs);
        currentDeleteID = '/aaos/' + currentDeleteID;
        $('a[href|="' + currentDeleteID + '"').click();
        
        

    }
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
}());