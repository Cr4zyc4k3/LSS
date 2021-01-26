// ==UserScript==
// @name        LSS building notes
// @version     1.0.1
// @author      Crazycake
// @include     *.leitstellenspiel.de/buildings/*
// @grant       none
// ==/UserScript==

(function () {
	'use strict';
	const buildingID = window.location.pathname.split('/')[2];
	const LSName = 'LSS_CrazycakeBN_' + buildingID;
	const inputDiv =
		'<a href="#" id=crazcakeEnableBN class="btn btn-default btn-xs" data-toggle="modal" data-target="#crazycakeBNMod"><span class="glyphicon glyphicon-eye-close"></span></a><div id="crazycakeBNMod" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Modal Header</h4></div><div class="modal-body"><textarea class="text optional" cols="40" id="crazycakeBNInput" name="note[message]" rows="20" style="width:100%;height:200px;"></textarea></div><div class="modal-footer"><a href="#"class="btn btn-danger" id="crazcykeBNDelete">Löschen</a><a href="#"class="btn btn-success" id="crazcykeBNSubmit">Speichern</a><button type="button" id="crazycakeBNClose" class="btn btn-default" data-dismiss="modal">Schließen&Speichern</button></div></div></div></div>';
	$('#tabs').before(inputDiv);

	if (localStorage.getItem(LSName) != null) {
		let text = getText();
	}
	$('#crazcykeBNSubmit', '#crazycakeBNClose').on('click', function () {
		setText($('#crazycakeBNInput').val());
	});

	$('#crazcykeBNDelete').on('click', function () {
		setText($('#crazycakeBNInput').val(''));
	});

	function setText(input) {
		localStorage.setItem(LSName, input);
	}
	function getText() {
		let text = localStorage.getItem(LSName);
		$('#crazycakeBNInput').val(text);
	}
})();
