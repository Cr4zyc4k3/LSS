// ==UserScript==
// @name        LSS radio call police table
// @version     1.3.1
// @author      Crazycake
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/vehicles\/\d*\/?$
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/missions/\d*\/?$
// @grant       none
// @updateURL  https://github.com/Cr4zyc4k3/LSS/raw/master/LSS_radio_call_police_table.user.js
// ==/UserScript==

(function () {
	'use strict';

	if (localStorage.getItem('ccPrisonTable') === null || JSON.parse(localStorage.getItem('ccPrisonTable')).userId !== user_id) {
		localStorage.setItem('ccPrisonTable', JSON.stringify({maxAllianceCells: -1, maxOwnCells: -1, userId: user_id}));
	}
	var ccPrisonTableLS = localStorage.getItem('ccPrisonTable');

	//create settings in a modal
	$('#btn_to_mission_place').parent().children().last().after(`
		<a data-toggle="modal" data-target="#ccPrisonTableModal" class="btn btn-default pull-right">
			<span class="glyphicon glyphicon-cog">
			</span>
		</a>
		<div class="modal fade" id="ccPrisonTableModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centerd" role="document">
    			<div class="modal-content">
      				<div class="modal-header">
        				<h5 class="modal-title" id="ccPrisonTableModalHeader">Einstellungen</h5>
        				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
          					<span aria-hidden="true">&times;</span>
        				</button>
      				</div>
      				<div class="modal-body form-group">
						<label for="ccPrisonTableOwnCellsInput" class="col-form-label">Maximal angezeigte eigene Zellen:&nbsp;</label>
						<input type="number" class="form-control-sm" id="ccPrisonTableOwnCellsInput" value="">
						<label for="ccPrisonTableAllianceCellsInput" class="col-form-label">Maximal angezeigte Verbanszellen:</label>
						<input type="number" class="form-control-sm" id="ccPrisonTableAllianceCellsInput" value=""><br>
						<small class="form-text text-muted">"-1" zeigt alle Zellen an.</small>
						
      				</div>
      				<div class="modal-footer">
        			<button type="button" class="btn btn-default" data-dismiss="modal">Schließen</button>
        			<button type="button" class="btn btn-success" data-dismiss="modal" id="ccPrisonTableModalSave">Speichern</button>
      				</div>
    			</div>
  			</div>
		</div>
		`);

	//Raw table, to be injected later
	const ccPrisonTableHTMLTable = `
    <h4 id="ccPrisonerTableHeading">Eigene Zellen</h4>
    <table id="ccPrisonerTable" class="table table-striped">
	    <thead>
		    <tr>
               	<th class="hidden-xs">Gebäude</th>
                <th class="hidden-xs">Entfernung</th>
                <th class="hidden-xs">Freie Zellen</th>
                <th></th>
			</tr>
        </thead>
        <tbody id="ccPrisonerTableBody">
        </tbody>
    </table>
    <h4 id="ccPrisonerTableHeadingAlliance">Verbandszellen</h4>
    <table id="ccPrisonerTableAlliance" class="table table-striped">
        <thead>
          <tr>
            <th class="hidden-xs">Gebäude</th>
            <th class="hidden-xs">Entfernung</th>
            <th class="hidden-xs">Freie Zellen</th>
            <th class="hidden-xs">Gebühr</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="ccPrisonerTableAllianceBody">
        </tbody>
    </table>
    `;

	//Abort for resuce missions
	if ($('h2').first().parent().children().length < 1) {
		return;
	}

	// Selector whether it is the mission or vehicle tab. Here for vehicles
	if (window.location.pathname.indexOf('vehicles') != -1) {
		var ccPrisonTableCellArray = [];

		//Get PrisonDiv
		var ccPrisonTableDiv = $('#btn_to_mission_place').parent().next();

		//Push every cell in Array
		ccPrisonTableCellArray = ccPrisonTableDiv.children().first().children().toArray();

		//Remove "Eigene Zellen"-Headline
		ccPrisonTableCellArray.shift();

		//Find "Verbandszellen"-Headline, important to differ between celltypes
		const ccPrisonTableAllianceCellsHeadline = ccPrisonTableCellArray.indexOf(ccPrisonTableCellArray.find((el) => el.attributes.length == 0));

		//Inject table from above
		ccPrisonTableDiv.html(ccPrisonTableHTMLTable);

		//Get "Eject Prisoner"-button and move it to top
		const ccPrsionTableEjecetPrisoner = ccPrisonTableCellArray.slice(-1)[0];
		ccPrsionTableEjecetPrisoner.classList.remove('btn-xs');
		$('#btn_to_mission_place').after(ccPrsionTableEjecetPrisoner);

		//Removes eject button and 2 <br>
		ccPrisonTableCellArray.length = ccPrisonTableCellArray.length - 3;

		get_ccPrisonTableLS();
		if (ccPrisonTableLS.maxOwnCells == -1) {
			var ccPrisonTablemaxOwnCells = ccPrisonTableAllianceCellsHeadline;
		} else if (ccPrisonTableLS.maxOwnCells <= ccPrisonTableAllianceCellsHeadline) {
			ccPrisonTablemaxOwnCells = ccPrisonTableLS.maxOwnCells;
		} else {
			ccPrisonTablemaxOwnCells = ccPrisonTableAllianceCellsHeadline;
		}

		//Fill the own-cells table
		for (let i = 0; i < ccPrisonTablemaxOwnCells; i++) {
			let stationName = ccPrisonTableCellArray[i].innerText.split('(')[0];
			let freeCells = ccPrisonTableCellArray[i].innerText.split('(')[1].split(',')[0].split(':')[1];
			let distance = ccPrisonTableCellArray[i].innerText.split(':')[2].split(')')[0];

			let btn = '';
			let disabled = '';
			if (freeCells == 0) {
				btn = 'btn-danger';
				disabled = 'disabled';
			} else if (freeCells > 0 && freeCells < 5) {
				btn = 'btn-warning';
			} else if (freeCells >= 5) {
				btn = 'btn-success';
			}

			$('#ccPrisonerTable').append(
				`<tr>
        <td>${stationName}</td>
        <td class="hidden-xs">${distance}</td>
        <td class="hidden-xs">${freeCells}</td>
        <td><a class="btn ${btn}" href="${ccPrisonTableCellArray[i].href}" ${disabled} >Anfahren</a></td>
        </tr>`
			);
		}
		if (ccPrisonTableLS.maxAllianceCells == -1) {
			var ccPrisonTablemaxAllianceCells = ccPrisonTableCellArray.length;
		} else if (Number(ccPrisonTableLS.maxAllianceCells) + Number(ccPrisonTableAllianceCellsHeadline) + 1 <= ccPrisonTableCellArray.length) {
			ccPrisonTablemaxAllianceCells = Number(ccPrisonTableLS.maxAllianceCells) + Number(ccPrisonTableAllianceCellsHeadline) + 1;
		} else {
			ccPrisonTablemaxAllianceCells = ccPrisonTableCellArray.length;
		}

		//Fill the alliance cell table
		for (let i = ccPrisonTableAllianceCellsHeadline + 1; i < ccPrisonTablemaxAllianceCells; i++) {
			let stationName = ccPrisonTableCellArray[i].innerText.split('(')[0];
			let freeCells = ccPrisonTableCellArray[i].innerText.split(': ')[1].split(',')[0];
			let distance = ccPrisonTableCellArray[i].innerText.split(': ')[2].split(', ')[0];
			let fee = ccPrisonTableCellArray[i].innerText.split(': ')[3].split(')')[0];

			let btn = '';
			let disabled = '';
			if (freeCells == 0) {
				btn = 'btn-danger';
				disabled = 'disabled';
			} else if (freeCells > 0 && freeCells < 5) {
				btn = 'btn-warning';
			} else if (freeCells >= 5) {
				btn = 'btn-success';
			}

			$('#ccPrisonerTableAlliance').append(
				`<tr>
           <td>${stationName}</td>
           <td class="hidden-xs">${distance}</td>
           <td class="hidden-xs">${freeCells}</td>
           <td class="hidden-xs">${fee}</td>
           <td><a class="btn ${btn}" href="${ccPrisonTableCellArray[i].href}" ${disabled} >Anfahren</a></td>
      </tr>`
			);
		}
	}
	//Here for missions
	else if (window.location.pathname.indexOf('missions') != -1) {
	} /* else if (window.location.pathname.indexOf('missions') != -1) {
		$('[id^=vehicle_prisoner_select_]').each(function () {
			console.log('Wörks for' + $(this).attr('id'));
			let ccPrisonTableDiv = $(this);
			let ccPrisonTableCellArray = ccPrisonTableDiv.children().toArray();

			//Find "Load-more button", important to differ between celltype
			for (let i = 0; i < ccPrisonTableCellArray.length; i++) {
				if (ccPrisonTableCellArray[i].classList.contains('load_cells')) {
					console.log(ccPrisonTableCellArray);
					ccPrisonTableCellArray.splice(i - 1, 3);
					var ccPrisonTableAllianceCellsHeadline = i;
					break;
				}
			}
			//Inject table from above
			ccPrisonTableDiv.html(ccPrisonTableHTMLTable);

			if (ccPrisonTableLS.maxOwnCells == -1) {
				var ccPrisonTablemaxOwnCells = ccPrisonTableAllianceCellsHeadline;
			} else if (ccPrisonTableLS.maxOwnCells <= ccPrisonTableAllianceCellsHeadline) {
				ccPrisonTablemaxOwnCells = ccPrisonTableLS.maxOwnCells;
			} else {
				ccPrisonTablemaxOwnCells = ccPrisonTableAllianceCellsHeadline;
			}
			console.log(ccPrisonTableCellArray);

			//Fill the own-cells table
			for (let i = 0; i < ccPrisonTablemaxOwnCells; i++) {
				let stationName = ccPrisonTableCellArray[i].innerText.split('(')[0];
				let freeCells = ccPrisonTableCellArray[i].innerText.split('(')[1].split(',')[0].split(':')[1];
				let distance = ccPrisonTableCellArray[i].innerText.split(':')[2].split(')')[0];

				let btn = '';
				let disabled = '';
				if (freeCells == 0) {
					btn = 'btn-danger';
					disabled = 'disabled';
				} else if (freeCells > 0 && freeCells < 5) {
					btn = 'btn-warning';
				} else if (freeCells >= 5) {
					btn = 'btn-success';
				}

				$('#ccPrisonerTable').append(
					`<tr>
        				<td>${stationName}</td>
        				<td class="hidden-xs">${distance}</td>
        				<td class="hidden-xs">${freeCells}</td>
						<td>
							<a class="btn ${btn}" href="${ccPrisonTableCellArray[i].href}" ${disabled} >Anfahren</a>
						</td>
        			</tr>`
				);
			}
			get_ccPrisonTableLS();
			if (ccPrisonTableLS.maxAllianceCells == -1) {
				var ccPrisonTablemaxAllianceCells = ccPrisonTableCellArray.length;
			} else if (Number(ccPrisonTableLS.maxAllianceCells) + Number(ccPrisonTableAllianceCellsHeadline) + 1 <= ccPrisonTableCellArray.length) {
				ccPrisonTablemaxAllianceCells = Number(ccPrisonTableLS.maxAllianceCells) + Number(ccPrisonTableAllianceCellsHeadline) + 1;
			} else {
				ccPrisonTablemaxAllianceCells = ccPrisonTableCellArray.length;
			}

			//Fill the alliance cell table
			for (let i = ccPrisonTableAllianceCellsHeadline + 1; i < ccPrisonTablemaxAllianceCells; i++) {
				let stationName = ccPrisonTableCellArray[i].innerText.split('(')[0];
				let freeCells = ccPrisonTableCellArray[i].innerText.split(': ')[1].split(',')[0];
				let distance = ccPrisonTableCellArray[i].innerText.split(': ')[2].split(', ')[0];
				let fee = ccPrisonTableCellArray[i].innerText.split(': ')[3].split(')')[0];

				let btn = '';
				if (freeCells == 0) {
					btn = 'btn-danger btn-disabled';
				} else if (freeCells > 0 && freeCells < 5) {
					btn = 'btn-warning';
				} else if (freeCells >= 5) {
					btn = 'btn-success';
				}

				$('#ccPrisonerTableAlliance').append(
					`<tr>
           <td>${stationName}</td>
           <td class="hidden-xs">${distance}</td>
           <td class="hidden-xs">${freeCells}</td>
           <td class="hidden-xs">${fee}</td>
           <td><a class="btn ${btn}" href="${ccPrisonTableCellArray[i].href}">Anfahren</a></td>
      </tr>`
				);
			}
		});
	} */

	function get_ccPrisonTableLS() {
		ccPrisonTableLS = JSON.parse(localStorage.getItem('ccPrisonTable'));
		$('#ccPrisonTableOwnCellsInput').val(ccPrisonTableLS.maxOwnCells);
		$('#ccPrisonTableAllianceCellsInput').val(ccPrisonTableLS.maxAllianceCells);
		return ccPrisonTableLS;
	}
	function set_ccPrisonTableLS(value) {
		localStorage.setItem('ccPrisonTable', JSON.stringify({maxAllianceCells: value.maxAllianceCells, maxOwnCells: value.maxOwnCells, userId: user_id}));
	}
	$('#ccPrisonTableModalSave').on('click', function () {
		if (!isNaN($('#ccPrisonTableOwnCellsInput').val())) {
			ccPrisonTableLS.maxOwnCells = $('#ccPrisonTableOwnCellsInput').val();
		} else {
			ccPrisonTableLS.maxOwnCells = -1;
		}
		if (!isNaN($('#ccPrisonTableAllianceCellsInput').val())) {
			ccPrisonTableLS.maxAllianceCells = $('#ccPrisonTableAllianceCellsInput').val();
		} else {
			ccPrisonTableLS.maxAllianceCells = -1;
		}
		set_ccPrisonTableLS(ccPrisonTableLS);
		location.reload();
	});
})();
