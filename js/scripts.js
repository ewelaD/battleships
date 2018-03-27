var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};
var model = {
	boardSize: 7, //wielkość siatki tworzącej planszę
	numShips: 3, //liczba okrętów biorących udział w grze
	shipLength: 3, //liczba komórek siatki zajmowanych przez każdy okręt
	shipsSunk: 0, //liczba zatopionych okrętów
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""]},
		{ locations: [0, 0, 0], hits: ["", "", ""]},
		{ locations: [0, 0, 0], hits: ["", "", ""]},
	], //informacje o lokalizacji okrętów i trafieniach
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				if (ship.hits[index] === "hit") {
					view.displayMessage("Tu już trafiłeś, strzelaj jeszcze raz!");
				} else {
					ship.hits[index] = "hit";
					view.displayHit(guess); //Poinformuj widok, że w polu o wsp zapisanych w param guess mamy trafienie
					view.displayMessage("TRAFIONY!"); //Poproś widok o wyświetlenie komunikatu "TRAFIONY!"
					if (this.isSunk(ship)) {
						view.displayMessage("Zatopiłeś mój okręt:(");
						this.shipsSunk++;
					}
				}
				return true;
			} //zamyka główną pętlę
		}
		view.displayMiss(guess); //Poinformuj widok, że w polu o wsp zapisanych w param guess mamy pudło
		view.displayMessage("Spudłowałeś:/"); //Poproś widok o wyświetlenie komunikatu "Spudłowałeś:/"
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false; //gdy jst pole, które nie zostalo trafione
			}
			return true; //okręt zatopiony
		}
	},
	generateShipLocations: function() { //tworzy nowe okręty
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize); //generuje okręt w poziomie
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength)); //generuje okręt w pionie
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i)); //poziom
			} else {
				newShipLocations.push((row + i) + "" + col); //pion
			}
		}
		return newShipLocations; //po wygenerowaniu wszystkich pól zwracam tablicę
	},
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};
var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guesses + " próbach.");
				var buttonStop = document.getElementById("fireButton"); //tutaj zdarzenie na button Fire żeby zablokować 
				buttonStop.disabled = true;
			}
		}
	}
};
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę.");
	} else {
		firstChar = guess.charAt(0);
		var changeLetter = firstChar.toUpperCase();
		var row = alphabet.indexOf(changeLetter);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert("Ups, to nie są współrzędne!");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Ups, pole poza planszą!");
		} else {
			return row + column;
		}
	}
	return null;
}
function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}
window.onload = init;

