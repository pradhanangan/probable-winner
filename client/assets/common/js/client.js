var sock = io();

sock.on('init', handleInit);
sock.on('timer', handleTimerUpdate);
sock.on('updateCountdown', handleCountdownUpdate);
sock.on('drawBoard', handleDrawBoard);

sock.on('gameCode', handleGameCode);
sock.on('unknownGame', handleUnknownGame);
sock.on('tooManyPlayers', handleTooManyPlayers);
sock.on('gameOver', handleGameOver);

sock.on('drawProfile', handleDrawProfile);
sock.on('updateScore', handleUpdateScore);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const newGameBtn = document.getElementById('newGameBtn');
const joinGameBtn = document.getElementById('joinGameBtn');
const gameCodeInput = document.getElementById('gameCodeInput');

singlePlayerBtn.addEventListener('click', singlePlayer);
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

var avatars = [
    'iconfinder_30.User_290120.png',
    'iconfinder_batman_hero_avatar_comics_4043232.png', 
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
    'iconfinder_scientist_einstein_avatar_professor_4043274.png'
];

let playerName;
let playerImageIdx;
let selectedLevel;
let selectedMode;

let playerNumber;

function gameInit() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
}

function singlePlayer() {
    sock.emit('singlePlayer');
    gameInit();
    document.getElementById("rowGamecode").style.display="none";
    showScoreBoardForSingleMode();
    updateProfile(1);
}

function newGame() {
    sock.emit('newGame', playerName, playerImageIdx);
    gameInit();
}

function joinGame() {
    const code = gameCodeInput.value;
    sock.emit('joinGame', code, playerName, playerImageIdx);
    gameInit();
}

function onKeyPressAnswer(e) {
    if(e.key === 'Enter') {
        if(document.getElementById('txtAnswer').value) { 
            let data = document.getElementById('txtAnswer').value;
            sock.emit('keypress', {keyCode: e.keyCode, answer: data});
        }
    }   
}

function handleDrawProfile(gameState) {
    showScoreBoardForMultiMode();
    updateProfileForMultiMode(gameState);
}

function handleInit(number) {
    playerNumber = number;
}

function handleDrawBoard(gameState) {
    let playerInd = playerNumber - 1;
    let playerGme = gameState.games[gameState.players[playerInd].index];
    gameboard.drawBoard(playerGme.first, playerGme.operator, playerGme.second);
}

function handleCountdownUpdate(countdown) {    
    document.getElementById("lblCountdown").innerHTML = countdown; 
}

function handleTimerUpdate(gameState) {
    if(gameState.timer === 1) {
        // Remove countdown row.
        let el = document.getElementById("rowCountdown")
        if(el) {
            el.remove();
        }

        handleDrawBoard(gameState);
    }
    document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' 
    + gameState.timer + '</label>';
}

function handleScoreUpdate(state) {
    let playerInd = playerNumber - 1;
    let ind = state.players[playerInd].index - 1;
    if(ind < 0) return;
    let gameResult2Append = state.players[playerInd].results[ind];
    let str = state.players[playerInd].index + ') ' + getQuestionStr(gameResult2Append);
    if(gameResult2Append.isCorrect) {
        str += ' <span>&#10004;</span><br/>';
    } else {
        str += ' <span>&#10060;</span><br/>';
    }

    document.getElementById("lblScore" + playerNumber).innerHTML += str;
}

function handleUpdateScore(playerNum, state) {
    let playerInd = playerNum - 1;
    let ind = state.players[playerInd].index - 1;
    if(ind < 0) return;
    let gameResult2Append = state.players[playerInd].results[ind];
    let str = state.players[playerInd].index + ') ' + getQuestionStr(gameResult2Append);
    if(gameResult2Append.isCorrect) {
        str += ' <span>&#10004;</span><br/>';
    } else {
        str += ' <span>&#10060;</span><br/>';
    }

    document.getElementById("lblScore" + playerNum).innerHTML += str;
}

function getQuestionStr(gameResult2Append) {
    return gameResult2Append.firstVal + ' ' + gameResult2Append.operation + ' ' + gameResult2Append.secondVal + ' = ' + gameResult2Append.answerVal;
}

function handleGameCode(gameCode){
    document.getElementById('gameCodeDisplay').innerText = gameCode;

}

function handleUnknownGame() {
    reset();
    alert("Unknown game code.");
}

function handleTooManyPlayers() {
    reset();
    alert("This game is already in progress.");
}

function handleGameOver(gameState, winner) {
    gameboard.disableAnswerFld();
    showGameoverLabel();
    showRestartBtn();
    showBackBtn();

    let playerOne = gameState.players[playerNumber -1];
    let correctResults = playerOne.results.filter(r => r.isCorrect);
    let numCorrectAnswer = correctResults.length;
    showCorrectLabel(numCorrectAnswer);
    
    if(gameState.mode === 1) { // Multi player mode
        showWinnerLabel(winner);
    }
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
}

function initPage() {
    let name = sessionStorage.getItem("UserName");
    let idx = sessionStorage.getItem("UserImageIndex");
    let level = sessionStorage.getItem("Level");

    if(!name && !idx) {
        location.href = "name.html"; 
        return;
    }

    playerName = name;
    playerImageIdx = idx;

    updateProfile(0);
}

function showScoreBoardForSingleMode() {
    let el = `
    <div class="row">
        <div class="col" style="text-align: center;">
            <div style="height: 80px; width: 80px; display:inline-block;">
                <a href="#">
                    <img id="imgProfile1" src="./img/iconfinder_30.User_290120.png" style="height:100%; width:100%;" >
                </a>
            </div>
            <div style="display:inline-block;">
                <label id="lblName1" style="font-weight: 600; font-size: 24px; line-height: 36px;">
                </label>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col result-height" style="overflow-y: auto; text-align: center;">
            <label id="lblScore1" style="font-weight: 400; font-size: 18px;">
            </label>
        </div>
    </div>`

    document.getElementById("divScore").innerHTML = el;
}

function updateProfile(profileIdx) {
    let profileImage = avatars[playerImageIdx];
    document.getElementById("imgProfile" + profileIdx).src = "./img/" + profileImage;
    document.getElementById("lblName" + profileIdx).innerHTML = playerName;
}

function showScoreBoardForMultiMode() {
    let el = `
    <div class="row">
        <div class="col-sm-6" style="text-align: center;">
            <div style="height: 80px; width: 80px; display:inline-block;">
                <a href="#">
                    <img id="imgProfile1" src="./img/iconfinder_30.User_290120.png" style="height:100%; width:100%;" >
                </a>
            </div>
            <div style="display:inline-block;">
                <label id="lblName1" style="font-weight: 600; font-size: 24px; line-height: 36px;">
                </label>
            </div>
        </div>

        <div class="col-sm-6" style="text-align: center;">
            <div style="height: 80px; width: 80px; display:inline-block;">
                <a href="#">
                    <img id="imgProfile2" src="./img/iconfinder_30.User_290120.png" style="height:100%; width:100%;" >
                </a>
            </div>
            <div style="display:inline-block;">
                <label id="lblName2" style="font-weight: 600; font-size: 24px; line-height: 36px;">
                </label>
            </div>
        </div>
    </div>

    <div class="row">    
        <div class="col-sm-6 result-height" style="overflow-y: auto; text-align: center;">
            <label id="lblScore1" style="font-weight: 400; font-size: 18px;">
            </label>
        </div>
        
        <div class="col-sm-6 result-height" style="overflow-y: auto; text-align: center;">
            <label id="lblScore2" style="font-weight: 400; font-size: 18px;">
            </label>
        </div>
    </div>
    `;

    document.getElementById("divScore").innerHTML = el;
}

function updateProfileForMultiMode(state) {
    state = JSON.parse(state);
    for(let i = 0; i < state.players.length; i++) {
        let profileImage = avatars[state.players[i].playerImageIdx];
        document.getElementById("imgProfile" + (i+1)).src = "./img/" + profileImage;
        document.getElementById("lblName" + (i+1)).innerHTML = state.players[i].playerName;
    }
}

// Information to show after the game is over.
// Show gameover label
function showGameoverLabel() {
	document.getElementById("divGameover").innerHTML = '<label style="font-weight: 700; font-size: 36px; line-height: 72px;">Game Over</label>';
}

function showPercentLabel(gameCount, numCorrectAnswer) {
	document.getElementById("divPercent").innerHTML = '<label style="font-weight: 700; font-size: 48px; line-height: 72px;">' 
		+ Math.round((numCorrectAnswer/gameCount) * 100) + '% Correct</label>';
}

function showCorrectLabel(numCorrectAnswer) {
    document.getElementById("divCorrect").innerHTML = '<label style="font-weight: 700; font-size: 36px; line-height: 72px;">' 
		+ numCorrectAnswer + ' Correct</label>';
}

// Show game summary. No of correct answer, incorrect answer etc. etc.
function showSummaryLabel(gameCount, numCorrectAnswer, numIncorrectAnswer) {
	document.getElementById("divSummary").innerHTML = '<label style="font-weight: 700; font-size: 18px;">Summary</label><br/>'  
			+ '<label style="font-weight:400; font-size:18px;">Total questions: ' + gameCount + '<br/>' 
			+ 'Correct: ' + numCorrectAnswer + '<br/>' 
			+ 'Incorrect: ' + numIncorrectAnswer + '</label><br/>';
}

function showWinnerLabel(winner) {
    let content = "";
    
    if(winner == playerNumber) { 
        content = "You Win";
    } 
    else if(winner == 0) {
        content = "It's a Draw";
    } 
    else {
        content = "You Lose";
    }

	document.getElementById("divWinner").innerHTML = `<label style="font-weight: 700; font-size: 36px; line-height: 72px;">${content}</label>`;
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
//

initPage();