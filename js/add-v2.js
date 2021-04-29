var intervalId;
var timer = 0;

var gameCount = 0;
var gameMax = 1;

var maxTimePerGame = 10;

var yourScore = 0;
var oppScore = 0;

var countdown = 3;
var GAMETIME = 60;
var isDrawBoard = true;

function drawBoard() {
	document.getElementById("first").innerHTML = genRandomNum(10);
	document.getElementById("plus").innerHTML = '+';
	document.getElementById("second").innerHTML = genRandomNum(10);
	document.getElementById("equals").innerHTML = '=';
	document.getElementById("divAnswer").innerHTML = `<input id="answer" 
																							type="text" 
																							size="1px" 
																							maxlength="2" 
																							style="font-size: 60px; line-height: 72px; font-weight: 700; text-align: center;" 
																							onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
																							placeholder="Type your answer">`;
	const elAnswer = document.getElementById("answer");
	elAnswer.addEventListener("keypress", function(e) {
		if(e.key === 'Enter') {
			if(document.getElementById('answer').value) {
				var ret = checkAnswer();
				if(ret) {
					yourScore++
					document.getElementById("lblYourScore").innerText = yourScore;
				} else {
					oppScore++;
					document.getElementById("lblOppScore").innerText = oppScore;

				}
				drawBoard();
			}
		}
	});
	el.value = '';
	el.focus();

	// updateGameLabel();
	// updateTimerLabel();
}


function check() {
	var fst = parseInt(document.getElementById("first").innerHTML);
	var sec = parseInt(document.getElementById("second").innerHTML);
	var ans = parseInt(document.getElementById("answer").value);
	document.getElementById("divResult").style.visibility = "visible";
	if(ans == (fst + sec)) {
		yourScore++;				
		document.getElementById("divResult").innerHTML = '<div style="border: 1px solid #5cb85c; font-size: 30px; text-align: center; font-weight: 700; color: white; background-color: #5cb85c;">RIGHT ANSWER</div>';
		document.getElementById("lblYourScore").innerText = yourScore;
		
	}
	else {
		oppScore++;
		document.getElementById("divResult").innerHTML = '<div style="border: 1px solid #d9534f; font-size: 30px; text-align: center; font-weight: 700; color: white; background-color: #d9534f;">WRONG ANSWER</div>';
		document.getElementById("lblOppScore").innerText = oppScore;
		
	}
}

function genRandomNum(top) {
	return Math.floor(Math.random() * top);
}

function start() {
	// drawBoard();
	intervalId = setInterval(startTimer, 1000);
}

function stop() {
	clearInterval(intervalId);
}

function startTimer() {	
	if(countdown < 0) {
		// Remove countdown row.
		let el = document.getElementById("rowCountdown")
		if(el) {
			el.remove();
		}

		// START GAME
		timer++;
		updateTimerLabel();

		if(isDrawBoard) {
			drawBoard();
			isDrawBoard = false;
		}


		// STOP GAME
		if(timer === GAMETIME) {
			stop();
		}

	} else {
		updateCountdownLabel();
		countdown--;
	}

	
	


	// timer++;
	// hideResult();

	// if(isGameOver() && timer == 5) {
	// 	stop();
	// }

	// // new game
	// if(timer == maxTimePerGame) {
	// 	gameCount++;
	// 	check();

	// 	if(isGameOver()) {
	// 		console.log('game over!!!');
			
	// 		// stop();
	// 		updateGameLabel();
	// 		updateTimerLabel();
	// 		timer = 0;
	// 		var whoWins = '';
	// 		debugger;
	// 		if(yourScore > oppScore) {
	// 			whoWins = 'YOU WIN';
	// 		}
	// 		else if(yourScore < oppScore) {
	// 			whoWins = 'YOU LOOSE';
	// 		} 
	// 		else {
	// 				whoWins = "DRAW";
	// 		}
	// 		document.getElementById("answer").disabled = true;
	// 		document.getElementById("divWins").innerHTML = '<div style="border: 1px solid #5cb85c; font-size: 30px; text-align: center; font-weight: 700; color: white; background-color: #5cb85c;">' + whoWins + '</div>';
	// 		return;
	// 	}

	// 	timer = 0;
		
	// 	drawBoard();
	// }
	
	
} 

function isGameOver() {
	console.log('isGameOver gameCount: ' + gameCount + ' maxCount: ' + gameMax);
	return gameCount >= gameMax;
}

// function updateTimerLabel() {
	
// 	if((10 - timer) < 5) {
// 		document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px; color: red;">' + (isGameOver() ? 0 : 10 - timer) + '</label>';
// 	} 
// 	else {
// 		document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' + (isGameOver() ? 0 : 10 - timer) + '</label>';
// 	}
// }

function updateTimerLabel() {
	document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' + timer + '</label>';
}



function updateGameLabel() {
	document.getElementById("lblGameCount").innerText = "Game #" + (isGameOver() ? gameMax : gameCount + 1);
}

function hideResult() {
	if(timer == 5) {
		document.getElementById("divResult").style.visibility = "hidden";
	}	
}

function updateCountdownLabel() {
	document.getElementById("lblCountdown").innerText = countdown; 
}


function checkAnswer() {
	var fst = parseInt(document.getElementById("first").innerHTML);
	var sec = parseInt(document.getElementById("second").innerHTML);
	var ans = parseInt(document.getElementById("answer").value);
	return ans === (fst + sec);
}

start();