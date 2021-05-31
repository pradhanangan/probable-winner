var intervalId;
// var timer = 0;

var LEVEL = 0;
var countdown = 3;
var GAMETIME = 60;

var isDrawBoard = true;
var gameCount = 0;
// var numCorrectAnswer = 0;
// var numIncorrectAnswer = 0;

// var avatars = ['iconfinder_batman_hero_avatar_comics_4043232.png', 
// 						'iconfinder_bear_russian_animal_avatar_4043234.png', 
// 						'iconfinder_boy_person_avatar_kid_4043238.png', 
// 						'iconfinder_cactus_cacti_avatar_pirate_4043242.png',
// 						'iconfinder_coffee_zorro_avatar_cup_4043245.png',
// 						'iconfinder_geisha_japanese_woman_avatar_4043249.png',
// 						'iconfinder_girl_avatar_child_kid_4043250.png',
// 						'iconfinder_girl_female_woman_avatar_4043251.png',
// 						'iconfinder_grandma_elderly_nanny_avatar_4043254.png',
// 						'iconfinder_indian_woman_hindi_avatar_4043259.png',
// 						'iconfinder_pilot_traveller_person_avatar_4043277.png',
// 						'iconfinder_scientist_einstein_avatar_professor_4043274.png'];



function init() {
	// setGame();
	
	// startTimer();

	gameboard.draw(0);
}

// function setGame() {

// 	let name = localStorage.getItem("UserName");
// 	let idx = localStorage.getItem("UserImageIndex");
// 	let lvl = localStorage.getItem("Level");

// 	if(!name) { location.href = "name.html"; }
// 	if(!idx) { location.href = "avatar.html"; }
	
// 	LEVEL = lvl ? parseInt(lvl) : 0;

// 	document.getElementById("lblName").innerText = name;
// 	let selectedImage = avatars[idx];
// 	document.getElementById("imgProfile").src = "./images/" + selectedImage;
// }

// function startTimer() {
// 	intervalId = setInterval(startGame, 1000);
// }

// function stopTimer() {
// 	clearInterval(intervalId);
// }

// function startGame() {	
// 	if(countdown < 0) {
// 		// Remove countdown row.
// 		let el = document.getElementById("rowCountdown")
// 		if(el) {
// 			el.remove();
// 		}

// 		// START GAME
// 		timer++;
// 		updateTimerLabel();

// 		if(isDrawBoard) {
// 			gameCount++;
// 			// board();
// 			gameboard.draw(LEVEL);
// 			isDrawBoard = false;
// 		}

// 		// STOP GAME
// 		if(isGameOver()) {
// 			stopTimer();
// 			// document.getElementById("txtAnswer").disabled = true;
// 			gameboard.disableAnswerFld();
// 			showGameoverLabel();
// 			showPercentLabel();
// 			showRestartBtn();
// 			showBackBtn();
// 		}

// 	} else {
// 		updateCountdownLabel();
// 		countdown--;
// 	}
// } 

// function isGameOver() {
// 	return GAMETIME === timer;
// }

// function updateCountdownLabel() {
// 	document.getElementById("lblCountdown").innerText = countdown; 
// }

function updateTimerLabel() {
	document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' 
	+ timer + '</label>';
}

// Information to show after the game is over.
// Show gameover label
function showGameoverLabel() {
	document.getElementById("divGameover").innerHTML = '<label style="font-weight: 700; font-size: 36px; line-height: 72px;">Game Over</label>';
}



// Show restart button. It refreshes the page.
function showRestartBtn() {
	document.getElementById("divRestart").innerHTML = `<input type="button" 
																							class="btn btn-success" 
																							id="btnRestart" 
																							value="Restart" 
																							onclick="location.reload()"
																							style="font-weight: 700; font-size: 36px; line-height: 60px; border-radius: 0"/>`;
}

function showBackBtn() {
	document.getElementById("divBack").innerHTML = `<input type="button"
																							class="btn btn-success" 
																							id="btnBack" 
																							value="<" 
																							style="font-weight: 700; font-size: 36px; line-height: 60px; border-radius: 0;"/>`;
	const elBack = document.getElementById("btnBack");
	elBack.addEventListener("click", onBackClick);
}

function onBackClick() {
	location.href = "name.html"
}
// // Show game summary. No of correct answer, incorrect answer etc. etc.
// function showSummaryLabel() {
// 	document.getElementById("divSummary").innerHTML = '<label style="font-weight: 700; font-size: 18px;">Summary</label><br/>'  
// 			+ '<label style="font-weight:400; font-size:18px;">Total questions: ' + gameCount + '<br/>' 
// 			+ 'Correct: ' + numCorrectAnswer + '<br/>' 
// 			+ 'Incorrect: ' + numIncorrectAnswer + '</label><br/>';
// }

// init();