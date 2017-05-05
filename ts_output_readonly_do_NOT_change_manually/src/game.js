var game;
(function (game) {
    game.trie = new gameTrie.Trie();
    game.answerTrie = new gameTrie.Trie();
    game.isModalShown = false;
    game.modalTitle = "Your turn is over";
    game.modalBody = "Time is up";
    game.$rootScope = null;
    game.$timeout = null;
    // Global variables are cleared when getting updateUI.
    // I export all variables to make it easy to debug in the browser by
    // simply typing in the console, e.g.,
    game.board = null;
    game.boardBeforeMove = null;
    game.currentUpdateUI = null;
    game.oldGuessList = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.animationEndedTimeout = null;
    game.state = null;
    // For community games.
    game.buttonNums = 16;
    game.proposals = null;
    game.yourPlayerInfo = null;
    game.tempString = '';
    game.toClearRC = null;
    game.g = '';
    game.buttonBg = false;
    game.counter = 100;
    game.countDownLeft = 60;
    game.dim = 4;
    game.wordsDiscoveredPerPlayer0 = [];
    game.wordsDiscoveredPerPlayer1 = [];
    game.myDictObj = {};
    function score() {
        var s = game.state.guessList;
        return s.length;
    }
    game.score = score;
    function showCurWords() {
        var s = game.state.guessList.join(', ');
        ;
        return s;
    }
    game.showCurWords = showCurWords;
    function showWords() {
        var s = (game.currentUpdateUI.yourPlayerIndex == 0 ? game.state.guessListFirst : game.state.guessList).join(', ');
        // let s = wordsDiscoveredPerPlayer[currentUpdateUI.yourPlayerIndex];
        return s;
    }
    game.showWords = showWords;
    function showWordsOpponents() {
        var s = (game.currentUpdateUI.yourPlayerIndex == 1 ? game.state.guessListFirst : game.state.guessList).join(', ');
        //let s = state.guessListFirst;
        return s;
    }
    game.showWordsOpponents = showWordsOpponents;
    function makeDic() {
        for (var i = 0; i < gameLogic.myDict.length; i++) {
            var res = gameLogic.myDict[i].toLowerCase();
            game.myDictObj[res] = true;
        }
    }
    game.makeDic = makeDic;
    function clearClickToDrag(row, col) {
        return "";
    }
    game.clearClickToDrag = clearClickToDrag;
    function getAnimationClass(row, col) {
    }
    game.getAnimationClass = getAnimationClass;
    function getPieceContainerClass(row, col) {
        game.toClearRC.push({ roww: row, coll: col });
        return "growi";
    }
    game.getPieceContainerClass = getPieceContainerClass;
    game.cachedPieceClass = getEmpty8Arrays();
    game.cachedPieceSrc = getEmpty8Arrays();
    game.cachedAvatarPieceCrown = getEmpty8Arrays();
    function getEmpty8Arrays() {
        var res = [];
        for (var i = 0; i < 4; i++)
            res.push([]);
        return res;
    }
    function reset() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                game.cachedPieceSrc[i][j] = clearClickToDrag(i, j);
            }
        }
    }
    game.reset = reset;
    function showModal() {
        game.isModalShown = true;
    }
    var cacheIntegersTill = [];
    function getIntegersTill(number) {
        if (cacheIntegersTill[number])
            return cacheIntegersTill[number];
        var res = [];
        for (var i = 0; i < number; i++) {
            res.push(i);
        }
        cacheIntegersTill[number] = res;
        return res;
    }
    game.getIntegersTill = getIntegersTill;
    function init($rootScope_, $timeout_) {
        makeDic();
        game.$rootScope = $rootScope_;
        game.$timeout = $timeout_;
        game.time = document.getElementById("timer");
        game.gameArea = document.getElementById("gameArea");
        game.boardArea = document.getElementById("boardArea");
        dragAndDropService.addDragListener("boardArea", handleDragEvent);
        game.dragArr = [];
        game.isModalShown = false;
        game.dragArr.push(4 + '' + 4);
        game.toClearRC = [];
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            updateUI: updateUI,
            getStateForOgImage: getStateForOgImage,
        });
    }
    game.init = init;
    function checkIf(row, col) {
        for (var i = 0; i < game.dragArr.length; i++) {
            if (game.dragArr.indexOf(row + '' + col) === -1) {
                game.cachedPieceSrc[row][col] = getPieceContainerClass(row, col);
                game.tempString = game.tempString.concat(game.state.chosenBoard[row][col]);
                showGuess();
                console.log(game.tempString);
                game.dragArr.push(row + '' + col);
            }
        }
    }
    function registerServiceWorker() {
        // I prefer to use appCache over serviceWorker
        // (because iOS doesn't support serviceWorker, so we have to use appCache)
        // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
        if (!window.applicationCache && 'serviceWorker' in navigator) {
            var n = navigator;
            log.log('Calling serviceWorker.register');
            n.serviceWorker.register('service-worker.js').then(function (registration) {
                log.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                log.log('ServiceWorker registration failed: ', err);
            });
        }
    }
    function getTranslations() {
        return {};
    }
    function isProposal(row, col) {
        return game.proposals && game.proposals[row][col].length > 0;
    }
    game.isProposal = isProposal;
    ///
    var timeoutId = null;
    function isTimerRunning() {
        return timeoutId;
    }
    game.isTimerRunning = isTimerRunning;
    function stopTimer() {
        if (!timeoutId)
            return;
        game.$timeout.cancel(timeoutId);
    }
    function startTimer() {
        stopTimer();
        game.isModalShown = false;
        var timerCount = 60;
        var countDown = function () {
            game.isModalShown = false;
            if (timerCount < 0) {
                var move = void 0;
                if (yourPlayerIndex() == 1) {
                    //console.log(oldGuessList.join(', ') + " old guess list");
                    game.isModalShown = true;
                    //let guessList2 = state.guessList;
                    var scoreDiff = game.state.guessListFirst.length - game.state.guessList.length;
                    //state.guessList = oldGuessList;
                    // state.guessList2 = guessList2;
                    var endMatchScores = scoreDiff > 0 ? [1, 0] : [0, 1];
                    move = gameLogic.createEndMove(game.state, endMatchScores);
                }
                else {
                    move = gameLogic.createMove(game.state.chosenBoard, game.state, yourPlayerIndex());
                    game.isModalShown = true;
                }
                makeMove(move);
            }
            else {
                game.countDownLeft = timerCount;
                timerCount--;
                timeoutId = game.$timeout(countDown, 1000);
            }
        };
        game.countDownLeft = timerCount;
        countDown();
    }
    game.startTimer = startTimer;
    function listOf(row, col) {
        var arr = [];
        arr.push(game.state.chosenBoard[row][col]);
        console.log(game.tempString);
        return game.tempString;
    }
    game.listOf = listOf;
    function addText(guessList) {
        //window.alert(tempString);
        var s = game.state.guessList;
        var a = 'A';
        return s;
    }
    game.addText = addText;
    function getCellSize() {
        return {
            width: game.gameArea.clientWidth / gameLogic.COLS,
            height: game.gameArea.clientHeight / gameLogic.ROWS
        };
    }
    function getBgImg(row, col) {
        var oka = 'alphabet/img_' + game.state.chosenBoard[row][col] + '.png';
        return oka;
    }
    game.getBgImg = getBgImg;
    function getID(row, col) {
        var id = game.state.chosenBoard[row][col];
        return id;
    }
    game.getID = getID;
    function handleDragEvent(type, clientX, clientY) {
        //  if (!isHumanTurn() || passes == 2) {
        ///   return; // if the game is over, do not display dragging effect
        //}
        if (!isMyTurn())
            return;
        var x = clientX - game.boardArea.offsetLeft - game.gameArea.offsetLeft;
        var y = clientY - game.boardArea.offsetTop - game.gameArea.offsetTop;
        var som = document.elementFromPoint(clientX, clientY);
        if (!som || !som.id || som.id.indexOf('_') == -1)
            return;
        var arrId = som.id.split("_");
        var a = parseInt(arrId[0]);
        var b = parseInt(arrId[1]);
        checkIf(a, b);
        if (x < 0 || x >= game.boardArea.clientWidth || y < 0 || y >= game.boardArea.clientHeight) {
            var col = Math.floor(x * 4 / game.boardArea.clientWidth);
            var row = Math.floor(y * 4 / game.boardArea.clientHeight);
            return;
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            dragDone(game.tempString, row, col);
            game.tempString = '';
            game.dragArr = [];
            game.dragArr.push(4 + '' + 4);
        }
    }
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return { top: row * size.height, left: col * size.width };
    }
    function getSquareWidthHeight() {
        var boardArea = document.getElementById("boardArea");
        return {
            width: boardArea.clientWidth / (4),
            height: boardArea.clientHeight / (4)
        };
    }
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col,
            y: row // * size.height + size.height / 2
        };
    }
    function isValidWord(word) {
        return game.myDictObj[word];
    }
    function dragDone(tempString, row, col) {
        game.$rootScope.$apply(function () {
            var dic = gameLogic.myDict;
            var res = tempString.toLowerCase();
            //$rootScope.boxClass = false;
            console.log(tempString);
            console.log("trie contains? " + isValidWord(res));
            //trie.insert(tempString, 0);
            //for (var v = 0; v < dic.length; v++) {
            //  if (dic[v] === res) {
            if (isValidWord(res) && !(game.answerTrie.contains(tempString)) && tempString.length > 2) {
                game.state.guessList.push(tempString);
                console.log("yes in dictionary");
                game.answerTrie.insert(tempString, 0);
                reset();
                tempString = null;
                return;
            }
            else {
                console.log("not in dictionary " + res);
                reset();
                tempString = null;
            }
            //}
            if (game.dragArr.length === 0) {
                game.dragArr.push(4 + '' + 4);
            }
            console.log(game.state.guessList);
        });
    }
    function showGuess() {
        game.g = game.tempString;
        return game.g;
    }
    game.showGuess = showGuess;
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        var playerIdToProposal = params.playerIdToProposal;
        // Only one move/proposal per updateUI
        game.didMakeMove = playerIdToProposal && playerIdToProposal[game.yourPlayerInfo.playerId] != undefined;
        game.yourPlayerInfo = params.yourPlayerInfo;
        game.proposals = null;
        game.currentUpdateUI = params;
        clearAnimationTimeout();
        game.state = params.state;
        if (isFirstMove()) {
            game.isModalShown = false;
            var move = gameLogic.createInitialMove();
            game.state = move.state;
            if (isMyTurn())
                makeMove(move);
        }
        if (isMyTurn() && game.countDownLeft === 60) {
            game.isModalShown = false;
            startTimer();
        }
    }
    game.updateUI = updateUI;
    function animationEndedCallback() {
        log.info("Animation ended");
        maybeSendComputerMove();
    }
    function clearAnimationTimeout() {
        if (game.animationEndedTimeout) {
            game.$timeout.cancel(game.animationEndedTimeout);
            game.animationEndedTimeout = null;
        }
    }
    function maybeSendComputerMove() {
        if (!isComputerTurn())
            return;
        var currentMove = {
            endMatchScores: game.currentUpdateUI.endMatchScores,
            state: game.currentUpdateUI.state,
            turnIndex: game.currentUpdateUI.turnIndex,
        };
        //let move = aiService.findComputerMove(currentMove);
        //   log.info("Computer move: ", move);
        // makeMove(move);
    }
    function makeMove(move) {
        game.didMakeMove = true;
        var chat = "Hello.";
        var delta = { board: game.state.chosenBoard, guessList0: game.state.guessListFirst, guessList1: game.state.guessList };
        var myProposal = {
            data: delta,
            chatDescription: chat,
            playerInfo: game.yourPlayerInfo,
        };
        // Decide whether we make a move or not
        gameService.makeMove(move, myProposal);
    }
    function isFirstMove() {
        console.log("first move ");
        return !game.currentUpdateUI.state;
    }
    function yourPlayerIndex() {
        return game.currentUpdateUI.yourPlayerIndex;
    }
    function isComputer() {
        var playerInfo = game.currentUpdateUI.playersInfo[game.currentUpdateUI.yourPlayerIndex];
        // In community games, playersInfo is [].
        return playerInfo && playerInfo.playerId === '';
    }
    function isComputerTurn() {
        return isMyTurn() && isComputer();
    }
    function isHumanTurn() {
        return isMyTurn() && !isComputer();
    }
    function isMyTurn() {
        return !game.didMakeMove &&
            game.currentUpdateUI.turnIndex >= 0 &&
            game.currentUpdateUI.yourPlayerIndex === game.currentUpdateUI.turnIndex; // it's my turn
    }
    function getStateForOgImage() {
        if (!game.currentUpdateUI || !game.currentUpdateUI.state) {
            log.warn("Got stateForOgImage without currentUpdateUI!");
            return '';
        }
        var state = game.currentUpdateUI.state;
        var board = game.state.chosenBoard;
        if (!board)
            return '';
        var boardStr = '';
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                boardStr += board[row][col];
            }
        }
        return boardStr;
    }
    game.getStateForOgImage = getStateForOgImage;
})(game || (game = {}));
var app = angular.module('myApp', ['gameServices']);
app.run(['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        $rootScope['game'] = game;
        game.init($rootScope, $timeout);
    }]);
app.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.animateToggle = false;
    }]);
//# sourceMappingURL=game.js.map