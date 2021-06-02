const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { createGameState, gameLoop, checkAnswer, levelZero, findWinner } = require('./game');
const { makeId } = require('./utils');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);

const io = socketio(server);

const state = {};
const clientRooms = {};

io.on('connection', (client) => {
    client.on('keypress', handleKeypress);
    client.on('singlePlayer', handleSinglePlayer);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);

    function handleJoinGame(gameCode, playerName, playerImageIdx) {
        console.log("handleJoinGame");
        const room = io.sockets.adapter.rooms[gameCode];
        
        let allUsers;
        if(room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if(allUsers) {
            numClients = Object.keys(allUsers).length;
        }

        if(numClients === 0) {
            client.emit('unknownGame');
            return;
        } else if(numClients > 1) {
            client.emit('tooManyPlayers');
            return;
        }

        clientRooms[client.id] = gameCode;
        
        state[gameCode].players[1].playerName = playerName;
        state[gameCode].players[1].playerImageIdx = playerImageIdx;
       

        client.join(gameCode);
        client.number = 2;
        client.emit('init', 2, state[gameCode]);

        emitDrawProfile(gameCode, state);
        startGameInterval(gameCode);
    }

    function handleNewGame(playerName, playerImageIdx) {
        console.log('Handle new game. playerName: ' + playerName + ', playerImageIdx: ' + playerImageIdx);

        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
        
        state[roomName] = createGameState();
        state[roomName].players[0].playerName = playerName;
        state[roomName].players[0].playerImageIdx = playerImageIdx;

       
        //client.emit('drawProfile', state[roomName]);
        client.join(roomName);
        client.number = 1;
        client.emit('init', 1, state[roomName]);
        emitDrawProfile(roomName, state);
    }

    function handleSinglePlayer() {
        console.log('handle new game');
        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
        
        state[roomName] = createGameState();

        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);

        startGameInterval(roomName);
    }
    
    function handleKeypress(keyCode) {
        const roomName = clientRooms[client.id];
        if(!roomName) return;

        console.log(keyCode);
        let answer;
        try {
            answer = parseInt(keyCode.answer);
        } catch(e) {
            console.error(e);
            return;
        } 
        
        let currGameIndex = state[roomName].players[client.number - 1].index;
        console.log("currentGameIndex: " + currGameIndex);
        let currGame = state[roomName].games[currGameIndex];
        console.log(currGame);




        let ret = checkAnswer(currGame, answer);
        let result = {
            firstVal: currGame.first,
            secondVal: currGame.second,
            operation: currGame.operator,
            answerVal: answer,
            isCorrect: ret
        }
        state[roomName].players[client.number - 1].results.push(result);
        console.log('check: ' + ret);
        state[roomName].players[client.number - 1].index++;


        if(state[roomName].players[client.number - 1].index >= state[roomName].games.length) {
            console.log("hellooooooooo");
            for(let i = 0; i< 10; i++) {
                console.log("hhh");
                state[roomName].games.push(levelZero());
            }
        }

        
        client.emit('drawBoard', JSON.stringify(state[roomName])); 
        emitScore(client.number, roomName);
    }
});

server.on('error', (err) => {
    console.error(err);
});

server.listen(8080, () => {
    console.log('server is ready');
});

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        if(state[roomName].countdown < 0) {
            state[roomName].timer++;
            if(state[roomName].timer === 1) {
                // emitGameState(roomName, state[roomName]);
                emitDrawBoard(roomName, state);
                
                // client.emit('drawBoard', JSON.stringify(state)); 
            }
            const end = gameLoop(state[roomName]);
            if(end) {
                console.log("Game over");
                clearInterval(intervalId);
                findWinner(state[roomName]);
                emitGameOver(roomName);
            }
            
            emitTimer(roomName, state);
            
        } else {
            console.log("Countdown: " + state[roomName].countdown);
            io.sockets.in(roomName)
        .emit('updateCountdown', JSON.stringify(state[roomName].countdown));
            // client.emit('updateCountdown', state.countdown);
            state[roomName].countdown--;
        }
    }, 1000);
}

function emitTimer(roomName, state) {
    io.sockets.in(roomName)
        .emit('timer', JSON.stringify(state[roomName]));
}

function emitDrawBoard(roomName, state) {
    io.sockets.in(roomName)
        .emit('drawBoard', JSON.stringify(state[roomName]));
}

function emitDrawProfile(roomName, state) {
    console.log("emitDrawProfile............");
    io.sockets.in(roomName)
        .emit('drawProfile', JSON.stringify(state[roomName]));
}

function emitScore(playerNumber, roomName) {
    io.sockets.in(roomName)
        .emit('updateScore', playerNumber, state[roomName]);
}

function emitGameOver(roomName) {
    io.sockets.in(roomName)
        .emit('gameOver', JSON.stringify(state[roomName]));
}