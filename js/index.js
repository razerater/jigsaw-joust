var puzzles = new Array(2);
var currentPuzzleNum = 0;
var numMoves = 0;

puzzles[0] = {
	numPieces : 4,
	numRows : 2
}

puzzles[1] = {
	numPieces : 24,
	numRows : 6
}

for(var i = 0; i < puzzles.length; i++) {
	puzzles[i].numCols = puzzles[i].numPieces/puzzles[i].numRows;
}

var currentPuzzle = puzzles[currentPuzzleNum];

function makePuzzle() {
	document.getElementById("gameover").style.display = "none";
	if(document.getElementById("game")) {
		document.getElementById("game").parentNode.removeChild(document.getElementById("game"));
	}
	game = document.createElement("table");
	document.body.appendChild(game);
	game.id = "game";

	startTimer();

	var availablePieces = [];
	for(var i = 0; i < currentPuzzle.numPieces; i++) {
		availablePieces.push(i);
	}

	for(var i = 0; i < currentPuzzle.numRows; i++) {
		var rowPieces = document.createElement("tr");
		game.appendChild(rowPieces);

		for(var j = 0; j < currentPuzzle.numCols; j++) {
			var puzzlePieceContainer = document.createElement("td");
			rowPieces.appendChild(puzzlePieceContainer);
			puzzlePieceContainer.id = "pieceholder" + (i * currentPuzzle.numCols + j);

			var puzzlePiece = document.createElement("img");
			var rand = availablePieces[Math.floor(Math.random()*availablePieces.length)];
			while(rand == i * currentPuzzle.numCols + j) {
				rand = availablePieces[Math.floor(Math.random()*availablePieces.length)];
			}
			availablePieces.splice(availablePieces.indexOf(rand), 1);
			puzzlePieceContainer.appendChild(puzzlePiece);
			puzzlePiece.id = "piece" + rand;
			puzzlePiece.draggable = true;
			puzzlePiece.src = "images/puzzle" + currentPuzzleNum + "/piece" + rand + ".jpeg";

			puzzlePiece.addEventListener("dragstart", function(event) {
				event.dataTransfer.setData("text", event.target.id);
			});
			puzzlePieceContainer.addEventListener("dragover", function(event) {
				event.preventDefault();
			});
			puzzlePieceContainer.addEventListener("drop", function(event) {
				event.preventDefault();
				var pieceId = event.dataTransfer.getData("text");
				var draggedPiece = document.getElementById(pieceId);
				document.getElementById(pieceId).parentNode.replaceChild(event.target, document.getElementById(pieceId));
				event.currentTarget.appendChild(draggedPiece);
				numMoves++;
				if(gameOver()) {
					for(var k = 0; k < currentPuzzle.numPieces; k++) {
						document.getElementById("piece" + k).draggable = false;
					}
					clearInterval(timerInterval);
					if(timerInterval) {
						console.log("hi");
					}
					document.getElementById("start").removeAttribute("onclick");
					document.getElementById("start").removeAttribute("style");
					setTimeout(function() {
						document.getElementById("game").parentNode.removeChild(document.getElementById("game"));
						document.getElementById("gameover").style.display = "block";
					}, 1500);
				}
			});
		}
	}
}

function startTimer() {
	var timerElem = document.getElementById("start");
	var startTime = Date.now();
	function timer() {
		var currentTime = Date.now() - startTime;
		var seconds = parseInt(currentTime / 1000);
		var minutes = parseInt(seconds / 60);
		timerElem.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds % 60 < 10 ? "0" : "") + seconds % 60;
	}
	timerElem.style.cursor = "initial";
	timer();
	timerInterval = setInterval(timer, 1000);
}

function gameOver() {
	return Array.prototype.slice.call(document.getElementsByTagName("td")).every(function(element, index) {
		return element.firstChild.id == "piece" + index;
	});
	/*var arrayElems = Array.prototype.slice.call(document.getElementsByTagName("td"));
	var correctElems = arrayElems.filter(function(element, index) {
		return element.firstChild.id == "piece" + index;
	});
	return arrayElems.length == correctElems.length;
	// return arrayElems.toString() == correctElems.toString(); // also works but probably slower*/
}

function getNextPuzzle() {
	currentPuzzle = puzzles[++currentPuzzleNum % puzzles.length];
	makePuzzle();
}