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


let playerNumber;

let playerName;
let playerImageIdx;
let selectedLevel;
let selectedMode;

function gameInit() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
}

function singlePlayer() {
    sock.emit('singlePlayer');
    gameInit();
    document.getElementById("rowGamecode").style.display="none";
    showScoreBoardSingle();
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

function handleDrawProfile(gameState) {
    console.log("Handle draw profile.");
    console.log(gameState);
    showScoreBoardMultiple(playerNumber, gameState);
}

function onKeyPressAnswer(e) {
    if(e.key === 'Enter') {
        if(document.getElementById('txtAnswer').value) { 
            let data = document.getElementById('txtAnswer').value;
            sock.emit('keypress', {keyCode: e.keyCode, answer: data});
        }
    }   
}

function handleInit(number, state) {
    console.log('Client handleInit. PlayerNumber: ' + number);
    playerNumber = number;
    // console.log("Handle draw profile.");
    // console.log(state);
    // showScoreBoardMultiple(number, state);
}

function handleDrawBoard(gameState) {
    console.log("Client handleDrawBoard");
    gameState = JSON.parse(gameState);
    // handleScoreUpdate(gameState);
    
    let playerInd = playerNumber - 1;
    
    console.log(gameState);
    console.log(playerInd);
    const yourGame = gameState.games[gameState.players[playerInd].index];
    gameboard.drawBoard(yourGame.first, yourGame.operator, yourGame.second);
}

function handleCountdownUpdate(countdown) {    
    console.log("Client handleCoutdownUpdate. Countdown: " + countdown);
 	document.getElementById("lblCountdown").innerText = JSON.parse(countdown); 
}

function handleTimerUpdate(state) {
    state = JSON.parse(state);
    if(parseInt(state.timer) === 1) {
        // Remove countdown row.
        let el = document.getElementById("rowCountdown")
        if(el) {
            el.remove();
        }
    }
    document.getElementById("divTimer").innerHTML = '<label id="lblTimer" style="font-weight: 700; font-size: 60px; line-height: 72px;">' 
    + state.timer + '</label>';
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

    document.getElementById("lblYourScore" + playerNumber).innerHTML += str;
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

    document.getElementById("lblYourScore" + playerNum).innerHTML += str;
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

function handleGameOver(gameState) {
    gameState = JSON.parse(gameState);
    if(gameState.mode === 0) {
        let playerOne = gameState.players[playerNumber -1];
        let correctResults = playerOne.results.filter(r => r.isCorrect);
        let numCorrectAnswer = correctResults.length;
        let numQuestions = playerOne.results.length;
        showPercentLabel(numCorrectAnswer, numQuestions);
    }

    gameboard.disableAnswerFld();
    showGameoverLabel();
    // showPercentLabel();
    showRestartBtn();
    showBackBtn();
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
}

// Show percent correct answer
function showPercentLabel(numCorrectAnswer, gameCount) {
	document.getElementById("divPercent").innerHTML = '<label style="font-weight: 700; font-size: 48px; line-height: 72px;">' 
		+ Math.round((numCorrectAnswer/gameCount) * 100) + '% Correct</label>';
}

function updateProfile(profileIdx) {
    let profileImage = avatars[playerImageIdx];
    document.getElementById("imgProfile" + profileIdx).src = "./img/" + profileImage;
    document.getElementById("lblName" + profileIdx).innerHTML = playerName;
}

function init() {
    let name = localStorage.getItem("UserName");
    let idx = localStorage.getItem("UserImageIndex");
    let level = localStorage.getItem("Level");
    let mode = localStorage.getItem("Mode");

    if(!name && !idx) {
        location.href = "name.html"; 
        return;
    }

    playerName = name;
    playerImageIdx = idx;

    updateProfile(0);
}

function showScoreBoardSingle() {
    let el = `<div class="row">
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
            <label id="lblYourScore" style="font-weight: 400; font-size: 18px;">
            </label>
    </div>
</div>`

    document.getElementById("divScore").innerHTML = el;

    updateProfile(1);
}

function updateProfileMulti(profileIdx, state) {
    debugger;
    state = JSON.parse(state);
    console.log('update profile multi');
    console.log(state);
    let profileImage = avatars[state.players[profileIdx].playerImageIdx];
    document.getElementById("imgProfile" + (profileIdx +1)).src = "./img/" + profileImage;
    document.getElementById("lblName" + (profileIdx+1)).innerHTML = state.players[profileIdx].playerName;
}

function showScoreBoardMultiple(number, state) {
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
                <label id="lblYourScore1" style="font-weight: 400; font-size: 18px;">
                </label>
            </div>
            <div class="col-sm-6 result-height" style="overflow-y: auto; text-align: center;">
                <label id="lblYourScore2" style="font-weight: 400; font-size: 18px;">
                </label>
            </div>
        </div>
    `;

    document.getElementById("divScore").innerHTML = el;
    updateProfileMulti(0, state);
    updateProfileMulti(1, state);
}

init();