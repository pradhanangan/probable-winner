var gameboard = (function() {

    var elFirst = "divFirst";
    var elOperator = "divOperator";
    var elSecond = "divSecond";
    var elEquals = "divEquals";
    var elAnswer = "divAnswer";

    var idAnswerFld = "txtAnswer";

    var valOperator = "+";
    var valEquals = "="
    var valAnswer = `<input id="${idAnswerFld}" 
                                        type="text" 
                                        size="1px" 
                                        maxlength="2" 
                                        style="font-size: 60px; line-height: 72px; font-weight: 700; text-align: center;" 
                                        onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
                                        placeholder="Type your answer"
                                        autocomplete="off">`;

    var level = 0;

    var operators = ['+', '-', '*', '/']; 

    function draw(lvl) {
        level = lvl;
        switch(level) {
            case 0:
                levelZero();
                break;
            case 1:
                levelOne();
                break;
        }
    }

    function levelZero() {
        let first = genRandomNum(0, 5);
        let second = genRandomNum(0, 5);
        let operator = "+";

        drawBoard(first, operator, second);
    }

    function levelOne() {
        let first = genRandomNum(0, 19);
        let second = genRandomNum(0, 19);
        let op = genRandomNum(0, 1);

        if(op === 1 && second > first) {
            // swap
            let temp = first;
            first = second;
            second = temp;
        }
        drawBoard(first, operators[op], second);
    }

    function drawBoard(valFirst, valOperator, valSecond) {
        document.getElementById(elFirst).innerHTML = valFirst;
        document.getElementById(elOperator).innerHTML = valOperator;
        document.getElementById(elSecond).innerHTML = valSecond;
        document.getElementById(elEquals).innerHTML = valEquals;
        document.getElementById(elAnswer).innerHTML = valAnswer;
        
        let elTxtAnswer = document.getElementById(idAnswerFld);
        elTxtAnswer.addEventListener("keypress", onKeyPressAnswer);
        elTxtAnswer.value = '';
        elTxtAnswer.focus();
    }

    // function onKeyPressAnswer(e) {
    //     if(e.key === 'Enter') {
    //         if(document.getElementById(idAnswerFld).value) {
    //             var ret = checkAnswer();
    //             if(ret) {
    //                 numCorrectAnswer++;
    //                 document.getElementById("lblYourScore").innerHTML += gameCount + ') ' + getQuestionStr() + ' <span>&#10004;</span><br/>';;
    //             } else {
    //                 numIncorrectAnswer++;
    //                 document.getElementById("lblYourScore").innerHTML += gameCount + ') ' + getQuestionStr() + ' <span>&#10060;</span><br/>';
    //             }
    //             if((GAMETIME - timer) <= 1) return;
    //             gameCount++;
    //             draw(level);
    //         }
    //     }
    // }

    function getQuestionStr() {
        let fst = parseInt(document.getElementById(elFirst).innerHTML);
        let ops = document.getElementById(elOperator).innerHTML;
        let sec = parseInt(document.getElementById(elSecond).innerHTML);
        let ans = parseInt(document.getElementById(idAnswerFld).value);
        return fst + ops + sec + valEquals + ans;
    }

    function checkAnswer() {
        let fst = parseInt(document.getElementById(elFirst).innerHTML);
        let ops = document.getElementById(elOperator).innerHTML;
        let sec = parseInt(document.getElementById(elSecond).innerHTML);
        let ans = parseInt(document.getElementById(idAnswerFld).value);
        return ans === math_it_up[ops](fst, sec);
    }

    function disableAnswerFld() {
        document.getElementById(idAnswerFld).disabled = true;
    }

    function genRandomNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    // https://stackoverflow.com/questions/13077923/how-can-i-convert-a-string-into-a-math-operator-in-javascript
    var math_it_up = {
        '+': function (x, y) { return x + y },
        '-': function (x, y) { return x - y }
    };

    return {
        draw: draw,
        drawBoard: drawBoard,
        disableAnswerFld: disableAnswerFld
    };
})();