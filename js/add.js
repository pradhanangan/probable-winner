var intervalId;
var timer = 0;

var countdown = 1;
var GAMETIME = 10;
var isDrawBoard = true;
var gameCount = 0;
var numCorrectAnswer = 0;
var numIncorrectAnswer = 0;

var yourScore = 0;

var avatars = ['iconfinder_batman_hero_avatar_comics_4043232.png', 
												'iconfinder_bear_russian_animal_avatar_4043234.png', 
												'iconfinder_boy_person_avatar_kid_4043238.png', 
												'iconfinder_cactus_cacti_avatar_pirate_4043242.png',
												'iconfinder_coffee_zorro_avatar_cup_4043245.png',
												'iconfinder_geisha_japanese_woman_avatar_4043249.png',
												'iconfinder_girl_avatar_child_kid_4043250.png',
												'iconfinder_girl_female_woman_avatar_4043251.png',
												'iconfinder_grandma_elderly_nanny_avatar_4043254.png',
												'iconfinder_indian_woman_hindi_avatar_4043259.png',
												'iconfinder_pilot_traveller_person_avatar_4043277.png',
												'iconfinder_scientist_einstein_avatar_professor_4043274.png']

// function drawBoard() {
// 	document.getElementById("divFirst").innerHTML = genRandomNum(0, 5);
// 	document.getElementById("divOperator").innerHTML = '+';
// 	document.getElementById("divSecond").innerHTML = genRandomNum(0, 5);
// 	document.getElementById("divEquals").innerHTML = '=';
// 	document.getElementById("divAnswer").innerHTML = `<input id="txtAnswer" 
// 																							type="text" 
// 																							size="1px" 
// 																							maxlength="2" 
// 																							style="font-size: 60px; line-height: 72px; font-weight: 700; text-align: center;" 
// 																							onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
// 																							placeholder="Type your answer">`;
	
// 	const elAnswer = document.getElementById("txtAnswer");
// 	elAnswer.addEventListener("keypress", onKeyPressAnswer);
// 	elAnswer.value = '';
// 	elAnswer.focus();
// }

// function genRandomNum(min, max) {
// 	min = Math.ceil(min);
//   max = Math.floor(max);
// 	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
// }

function start() {
	let name = localStorage.getItem("UserName");
	let idx = localStorage.getItem("UserImageIndex");

	if(!name) { location.href = "name.html"; }
	if(!idx) { location.href = "avatar.html"; }

	document.getElementById("lblName").innerText = name;
	let selectedImage = avatars[idx];
	document.getElementById("imgProfile").src = "./images/" + selectedImage;
	
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
			gameCount++;
			gameboard.draw();
			isDrawBoard = false;
		}

		// STOP GAME
		if(isGameOver()) {
			stop();
			// document.getElementById("txtAnswer").disabled = true;
			gameboard.disableAnswerFld();
			showGameoverLabel();
			showPercentLabel();
			showRestartBtn();
		}

	} else {
		updateCountdownLabel();
		countdown--;
	}
} 

function isGameOver() {
	return GAMETIME === timer;
}

function updateCountdownLabel() {
	document.getElementById("lblCountdown").innerText = countdown; 
}

function updateTimerLabel() {
	document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' 
	+ timer + '</label>';
}

function showGameoverLabel() {
	document.getElementById("divGameover").innerHTML = '<label style="font-weight: 700; font-size: 36px; line-height: 72px;">Game Over</label>';
}

function showPercentLabel() {
	document.getElementById("divPercent").innerHTML = '<label style="font-weight: 700; font-size: 48px; line-height: 72px;">' 
		+ Math.round((numCorrectAnswer/gameCount) * 100) + '% Correct</label>';
}

function showRestartBtn() {
	document.getElementById("divRestart").innerHTML = `<input type="button" 
																							id="btnRestart" 
																							value="Restart" 
																							style="font-weight: 700; font-size: 36px; line-height: 60px;"/>`;
	const elRestart = document.getElementById("btnRestart");
	elRestart.addEventListener("click", onRestartClick);
}

function showSummaryLabel() {
	document.getElementById("divSummary").innerHTML = '<label style="font-weight: 700; font-size: 18px;">Summary</label><br/>'  
			+ '<label style="font-weight:400; font-size:18px;">Total questions: ' + gameCount + '<br/>' 
			+ 'Correct: ' + numCorrectAnswer + '<br/>' 
			+ 'Incorrect: ' + numIncorrectAnswer + '</label><br/>';
}

function onKeyPressAnswer(e) {
	if(e.key === 'Enter') {
		if(document.getElementById('txtAnswer').value) {
			var ret = checkAnswer();
			if(ret) {
				numCorrectAnswer++;
				document.getElementById("lblYourScore").innerHTML += gameCount + ') ' + getQuestionStr() + ' <span>&#10004;</span><br/>';;
			} else {
				numIncorrectAnswer++;
				document.getElementById("lblYourScore").innerHTML += gameCount + ') ' + getQuestionStr() + ' <span>&#10060;</span><br/>';
			}
			if((GAMETIME - timer) <= 1) return;
			gameCount++;
			board();
		}
	}
}

function onRestartClick(e) {
	location.reload();
}

// function checkAnswer() {
// 	var fst = parseInt(document.getElementById("divFirst").innerHTML);
// 	var sec = parseInt(document.getElementById("divSecond").innerHTML);
// 	var ans = parseInt(document.getElementById("txtAnswer").value);
// 	return ans === (fst + sec);
// }

// function getQuestionStr() {
// 	var fst = parseInt(document.getElementById("divFirst").innerHTML);
// 	var sec = parseInt(document.getElementById("divSecond").innerHTML);
// 	var ans = parseInt(document.getElementById("txtAnswer").value);
// 	return fst + ' + '  + sec + ' = ' + ans;
// }



start();