var game;
(function (game) {
    game.isModalShown = false;
    game.modalTitle = "Game Over";
    game.modalBody = "Done";
    game.$rootScope = null;
    game.$timeout = null;
    // Global variables are cleared when getting updateUI.
    // I export all variables to make it easy to debug in the browser by
    // simply typing in the console, e.g.,
    game.board = null;
    game.boardBeforeMove = null;
    game.delta = null;
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.animationEndedTimeout = null;
    game.state = null;
    // For community games.
    game.buttonNums = 16;
    game.proposals = null;
    game.yourPlayerInfo = null;
    game.tempString = '';
    game.arrAnswer = null;
    game.toClearRC = null;
    game.g = '';
    game.buttonBg = false;
    game.counter = 100;
    game.countDownLeft = 100;
    game.moveToConfirm = null;
    var clickToDragPiece;
    game.deadBoard = null;
    game.curRow = 5;
    game.curCol = 5;
    game.hasDim = false;
    game.dim = 4;
    function rowsPercent() {
        return 100 / game.dim;
    }
    game.rowsPercent = rowsPercent;
    function score() {
        return 0; //state.guessList.length;
    }
    game.score = score;
    function clearClickToDrag(row, col) {
        return "";
    }
    game.clearClickToDrag = clearClickToDrag;
    function getAnimationClass(row, col) {
    }
    game.getAnimationClass = getAnimationClass;
    function getPieceContainerClass(row, col) {
        // toClearRC.push([[row][col]]);
        game.toClearRC.push({ roww: row, coll: col });
        return "grow";
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
    function updateCache() {
    }
    game.updateCache = updateCache;
    function reset() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                //cachedPieceSrc[i][j] = clearClickToDrag(i,j);
            }
        }
    }
    game.reset = reset;
    function showModal() {
        // if (!isMyTurn()) return;
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
    /*
    export function getCellStyle(row: number, col: number): Object {
      if (!proposals) return {};
      let count = proposals[row][col].length;
      if (count == 0) return {};
      // proposals[row][col] is > 0
      let countZeroBased = count - 1;
      let maxCount = currentUpdateUI.numberOfPlayersRequiredToMove - 2;
      let ratio = maxCount == 0 ? 1 : countZeroBased / maxCount; // a number between 0 and 1 (inclusive).
      // scale will be between 0.6 and 0.8.
      let scale = 0.6 + 0.2 * ratio;
      // opacity between 0.5 and 0.7
      let opacity = 0.5 + 0.2 * ratio;
      return {
        transform: `scale(${scale}, ${scale})`,
        opacity: "" + opacity,
      };
    }
  */
    /*
      export function getBoardPiece(row: number, col: number): string {
        let piece = game.board[row][col];
        let pieceBefore = game.boardBeforeMove[row][col];
        let isProposal = proposals && proposals[row][col].length > 0;
        //
    
     //   return isProposal ? (currentUpdateUI.turnIndex == 0 ? '1' : '2') :
        //  !piece && !pieceBefore ? '' : (piece == 'A' || pieceBefore == 'B' ? 'B' : 'C');
      }
      */
    // export function shouldSlowlyDrop(rrow: number, ccol: number) {
    // return delta &&
    //    delta.row === rrow &&
    //    delta.col === ccol;
    // }
    //
    ///
    ///
    //
    function init($rootScope_, $timeout_) {
        game.$rootScope = $rootScope_;
        game.$timeout = $timeout_;
        //
        //
        game.gameArea = document.getElementById("gameArea");
        game.boardArea = document.getElementById("boardArea");
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
        game.dragArr = [];
        game.isModalShown = false;
        game.dragArr.push(4 + '' + 4);
        game.toClearRC = [];
        startTimer();
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            updateUI: updateUI,
            getStateForOgImage: getStateForOgImage,
        });
        //window.alert(data);
    }
    game.init = init;
    function checkIf(row, col) {
        for (var i = 0; i < game.dragArr.length; i++) {
            if (game.dragArr.indexOf(row + '' + col) === -1) {
                // let topLeft = getSquareTopLeft(row, col);
                game.tempString = game.tempString.concat(game.state.chosenBoard[row][col]);
                showGuess();
                console.log(game.tempString);
                game.dragArr.push(row + '' + col);
                // console.log(centerXY.y+" and center x: "+centerXY.x);
            }
        }
    }
    function getGrow() {
        return "grow1";
    }
    game.getGrow = getGrow;
    function grow1() {
        return "";
    }
    game.grow1 = grow1;
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
    function startTimer() {
        var timerCount = 10;
        var countDown = function () {
            if (timerCount < 0) {
                var move = gameLogic.createMove(game.state.chosenBoard, game.state, 2);
                makeMove(move);
            }
            else {
                game.countDownLeft = timerCount;
                timerCount--;
                game.$timeout(countDown, 1000);
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
    ///
    ///
    function setDice(board) {
        var s = 'http://annmalavet.com/Boggle/alphabet/img_A.png';
        var a = "A";
        return board;
    }
    game.setDice = setDice;
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
    function handleDragEvent(type, clientX, clientY) {
        //  if (!isHumanTurn() || passes == 2) {
        ///   return; // if the game is over, do not display dragging effect
        //}
        var x = clientX - game.boardArea.offsetLeft - game.gameArea.offsetLeft;
        var y = clientY - game.boardArea.offsetTop - game.gameArea.offsetTop;
        var cellSize = getCellSize();
        var col = Math.floor(x * 4 / game.boardArea.clientWidth);
        var row = Math.floor(y * 4 / game.boardArea.clientHeight);
        if (type === "touchstart" || type === "touchmove") {
        }
        // Center point in boardArea
        if (type === "mousedown") {
            game.tempString = null;
        }
        var button = document.getElementById("img_" + row + "_" + col);
        if (x < 0 || x >= game.boardArea.clientWidth || y < 0 || y >= game.boardArea.clientHeight) {
            var col = Math.floor(x * 4 / game.boardArea.clientWidth);
            var row = Math.floor(y * 4 / game.boardArea.clientHeight);
            //console.log("row=" + row + " col=" + col);
            return;
        }
        //  if (voidAreacol !== 0 || voidAreacol >= 4 || voidAreaRow !== 0 || voidAreaRow >= 4) { 
        var col = Math.floor(x * 4 / game.boardArea.clientWidth);
        var row = Math.floor(y * 4 / game.boardArea.clientHeight);
        var centerXY = getSquareCenterXY(row, col);
        var topLeft = getSquareTopLeft(row, col);
        game.curRow = row;
        game.curCol = col;
        //console.log(centerXY.x+" "+centerXY.y+"get center x y");
        //console.log(cellSize.height + " cell size " + cellSize.width)
        //console.log(gameArea.clientWidth + " clientWidth size ");
        //console.log(gameArea.clientHeight + " clientHeight size ");
        console.log(clientX + " row to height * col -10 " + (cellSize.height * (col + 1) - 10));
        console.log(clientY + " row to width times row" + (cellSize.width * (row + 1) - 10));
        //console.log(row+" row to checkif then col"+col);
        if (clientY < (cellSize.height * (row + 1) - 10) && (clientX < (cellSize.width * (col + 1) - 10))) {
            console.log((cellSize.height * (row + 1) - 10) + " vs " + clientY + " and clientX: " + clientX + " vs " + (clientX < (cellSize.width * (col + 1) - 10)));
            game.cachedPieceSrc[row][col] = getPieceContainerClass(row, col);
            checkIf(row, col);
        }
        game.buttonBg = true;
        // if the cell is not empty, don't preview the piece, but still show the dragging lines
        //  return;
        //  }
        // draggingLines.style.display = "inline";
        //if (type === "touchend") {tempString=null}
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
    function dragDone(tempString, row, col) {
        game.$rootScope.$apply(function () {
            var dic = gameLogic.myDictionary;
            var res = tempString.toLowerCase();
            game.$rootScope.boxClass = false;
            console.log(tempString);
            for (var v = 0; v < dic.length; v++) {
                if (dic[v] === res) {
                    game.state.guessList.push(tempString);
                    //showGuess();
                    console.log("yes in dictionary");
                    reset();
                    return;
                }
                else {
                    console.log("not in dictionary " + res);
                    reset();
                }
            }
            if (game.dragArr.length === 0) {
                game.dragArr.push(4 + '' + 4);
            }
            console.log(game.state.guessList);
            // if (deadBoard == null) {
            ///window.alert("something deadboard")
            //  moveToConfirm = {row: row, col: col};
            // alert(board[row][col]);
            // } else {
            //window.alert("something deadboard")
            //game.tempString = game.tempString.concat(game.state.board[row][col]);
            //}
        });
    }
    function showGuess() {
        game.g = game.tempString;
        return game.g;
    }
    game.showGuess = showGuess;
    function getProposalsBoard(playerIdToProposal) {
        var proposals = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            proposals[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                proposals[i][j] = game.state.chosenBoard[i][j];
            }
        }
        for (var playerId in playerIdToProposal) {
            var proposal = playerIdToProposal[playerId];
            var delta_1 = proposal.data;
            //proposals[delta.board][delta.guessList]++;?????????????????????????
        }
        return proposals;
    }
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        var playerIdToProposal = params.playerIdToProposal;
        // Only one move/proposal per updateUI
        game.didMakeMove = playerIdToProposal && playerIdToProposal[game.yourPlayerInfo.playerId] != undefined;
        game.yourPlayerInfo = params.yourPlayerInfo;
        game.proposals = playerIdToProposal ? getProposalsBoard(playerIdToProposal) : null;
        if (playerIdToProposal) {
            console.log("player id" + playerIdToProposal);
            // If only proposals changed, then return.
            // I don't want to disrupt the player if he's in the middle of a move.
            // I delete playerIdToProposal field from params (and so it's also not in currentUpdateUI),
            // and compare whether the objects are now deep-equal.
            params.playerIdToProposal = null;
            if (game.currentUpdateUI && angular.equals(game.currentUpdateUI, params))
                return;
        }
        game.currentUpdateUI = params;
        score();
        showGuess();
        updateCache();
        clearAnimationTimeout();
        if (isFirstMove()) {
            game.state = gameLogic.getInitialState();
            game.delta = null;
            game.board = game.state.chosenBoard;
        }
        game.animationEndedTimeout = game.$timeout(animationEndedCallback, 500);
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
        if (!game.proposals) {
            gameService.makeMove(move, null);
        }
        else {
            var delta_2 = { board: game.state.chosenBoard, guessList: game.state.guessList };
            var myProposal = {
                data: delta_2,
                chatDescription: 'player guessed ' + game.state.guessList.length,
                playerInfo: game.yourPlayerInfo,
            };
            // Decide whether we make a move or not
            gameService.makeMove(move, myProposal);
        }
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
        var board = state.chosenBoard;
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
    // export function shouldShowImage(row: number, col: number): boolean {
    //  return state.board[row][col] !== "" || isProposal(row, col);
    // }
    // export function isPieceX(row: number, col: number): boolean {
    //  return isPiece(row, col, 0, 'X');
    //}
    // export function isPieceO(row: number, col: number): boolean {
    //   return isPiece(row, col, 1, 'O');
    //}
    //  export function shouldSlowlyAppear(row: number, col: number): boolean {
    //   return state.delta &&
    //    state.delta.row === row && state.delta.col === col;
    // }
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