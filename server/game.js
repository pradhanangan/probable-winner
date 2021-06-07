const { GAMETIME, LEADTIME, NUMBER_OF_GAMES, SINGLE_MODE, MULTIPLE_MODE } = require('./constants');

module.exports = {
    createGameState,
    gameLoop,
    checkAnswer,
    levelZero,
    findWinner
}

function createGameState() {
    let gameState = {
        players: [{
            playerName: "",
            playerImageIdx: 0,
            index: 0,
            results:[]
        },
        {
            playerName: "",
            playerImageIdx: 0,
            index: 0,
            results:[]
        }],
        games: [],
        level: 0,
        mode: SINGLE_MODE,

        timer: 0,
        countdown: LEADTIME,
        gametime: GAMETIME,
    };
    
    for ( let i = 0; i < NUMBER_OF_GAMES; i++ ) {
        gameState.games.push(levelZero());
    }
    return gameState;
}

function gameLoop(state) {
    if(!state) return;
    const timer = state.timer;
    if(GAMETIME  === timer) {
        return true;
    }

    return false;
}

function levelZero() {
    return {
        first: genRandomNum(0, 5),
        second: genRandomNum(0, 5),
        operator: '+'
    }
}

function genRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function checkAnswer(currGame, ans) {
    console.log("checkAnswer");
    let fst = currGame.first;
    let ops = currGame.operator;
    let sec = currGame.second;
    
    return ans === math_it_up[ops](fst, sec);
}

function findWinner(state) {
    let correctRes1 = state.players[0].results.filter(x => x.isCorrect == true).length;
    let correctRes2 = state.players[1].results.filter(x => x.isCorrect == true).length;
    if(correctRes1 > correctRes2) {
        return 1;
    } else if(correctRes1 < correctRes2) {
        return 2;
    } 
    return 0;
}

// https://stackoverflow.com/questions/13077923/how-can-i-convert-a-string-into-a-math-operator-in-javascript
 var math_it_up = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y }
};