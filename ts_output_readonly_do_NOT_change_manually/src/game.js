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
    // game.currentUpdateUI
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
    game.guessList = [];
    game.arrAnswer = null;
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
    function clearClickToDrag(row, col) {
        return "";
    }
    game.clearClickToDrag = clearClickToDrag;
    function getAnimationClass(row, col) {
    }
    game.getAnimationClass = getAnimationClass;
    function getPieceContainerClass(row, col) {
        return "explodePiece";
    }
    game.getPieceContainerClass = getPieceContainerClass;
    game.cachedPieceClass = getEmpty8Arrays();
    game.cachedPieceSrc = getEmpty8Arrays();
    game.cachedAvatarPieceCrown = getEmpty8Arrays();
    function getEmpty8Arrays() {
        var res = [];
        for (var i = 0; i < 8; i++)
            res.push([]);
        return res;
    }
    function updateCache() {
    }
    game.updateCache = updateCache;
    function showModal(titleId, bodyId) {
        // if (!isMyTurn()) return;
        log.info("showModal: ", titleId);
        game.isModalShown = true;
        game.modalTitle = translate(titleId);
        game.modalBody = translate(bodyId);
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
    function getCellStyle(row, col) {
        if (!game.proposals)
            return {};
        var count = game.proposals[row][col];
        if (count == 0)
            return {};
        // proposals[row][col] is > 0
        var countZeroBased = count - 1;
        var maxCount = game.currentUpdateUI.numberOfPlayersRequiredToMove - 2;
        var ratio = maxCount == 0 ? 1 : countZeroBased / maxCount; // a number between 0 and 1 (inclusive).
        // scale will be between 0.6 and 0.8.
        var scale = 0.6 + 0.2 * ratio;
        // opacity between 0.5 and 0.7
        var opacity = 0.5 + 0.2 * ratio;
        return {
            transform: "scale(" + scale + ", " + scale + ")",
            opacity: "" + opacity,
        };
    }
    game.getCellStyle = getCellStyle;
    function getBoardPiece(row, col) {
        var piece = game.board[row][col];
        var pieceBefore = game.boardBeforeMove[row][col];
        var isProposal = game.proposals && game.proposals[row][col] > 0;
        //
        return isProposal ? (game.currentUpdateUI.turnIndex == 0 ? '1' : '2') :
            !piece && !pieceBefore ? '' : (piece == 'A' || pieceBefore == 'B' ? 'B' : 'C');
    }
    game.getBoardPiece = getBoardPiece;
    function shouldSlowlyDrop(rrow, ccol) {
        return game.delta &&
            game.delta.row === rrow &&
            game.delta.col === ccol;
    }
    game.shouldSlowlyDrop = shouldSlowlyDrop;
    //
    ///
    ///
    //
    function init($rootScope_, $timeout_) {
        game.$rootScope = $rootScope_;
        game.$timeout = $timeout_;
        //
        ///
        game.gameArea = document.getElementById("gameArea");
        game.boardArea = document.getElementById("boardArea");
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
        game.dragArr = [];
        game.dragArr.push(4 + '' + 4);
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            updateUI: updateUI,
            getStateForOgImage: null,
        });
        //window.alert(data);
    }
    game.init = init;
    function checkIf(row, col) {
        for (var i = 0; i < game.dragArr.length; i++) {
            if (game.dragArr.indexOf(row + '' + col) === -1) {
                game.tempString = game.tempString.concat(game.state.board[row][col]);
                game.dragArr.push(row + '' + col);
                game.cachedPieceSrc[game.curRow][game.curCol] = clearClickToDrag(game.curRow, game.curCol);
                updateCache();
                //if( tempString in data1)  {
                // console.log("match match match match match match match");
                //}
            }
        }
        console.log(game.dragArr.length);
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
        return game.proposals && game.proposals[row][col] > 0;
    }
    game.isProposal = isProposal;
    ///
    function startTimer() {
        var timerCount = 5; //60;
        game.isModalShown = true;
        var countDown = function () {
            if (timerCount < 0) {
                showModal(game.modalTitle, game.modalBody);
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
        //tempString = tempString.concat(state.board[row][col]);
        arr.push(game.state.board[row][col]);
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
        var s = guessList;
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
        var oka = 'alphabet/img_' + game.state.board[row][col] + '.png';
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
        game.cachedPieceSrc[game.curRow][game.curCol] = getPieceContainerClass(game.curRow, game.curCol);
        if (type === "touchstart") {
            //clickToDragPiece = document.getElementById("img_" + row + "_" + col);//"img_" + row + "_" + col);
            console.log(clickToDragPiece.id);
            var style = clickToDragPiece.style;
            clickToDragPiece.style.visibility = 'visible';
            style['transform'] = 1.3;
            updateUI(game.currentUpdateUI);
        }
        // Center point in boardArea
        var button = document.getElementById("img_" + row + "_" + col);
        if (x < 0 || x >= game.boardArea.clientWidth || y < 0 || y >= game.boardArea.clientHeight) {
            // clearClickToDrag();
            var col = Math.floor(x * 4 / game.boardArea.clientWidth);
            var row = Math.floor(y * 4 / game.boardArea.clientHeight);
            console.log("row=" + row + " col=" + col);
            return;
        }
        // Inside boardArea. Let's find the containing square's row and col
        //(coord.x * tileSize) + (tileSize / 2)
        var voidAreacol = Math.floor(x * 8 / game.boardArea.clientWidth);
        var voidAreaRow = Math.floor(y * 8 / game.boardArea.clientHeight);
        //  if (voidAreacol !== 0 || voidAreacol >= 4 || voidAreaRow !== 0 || voidAreaRow >= 4) { 
        var col = Math.floor(x * 4 / game.boardArea.clientWidth);
        var row = Math.floor(y * 4 / game.boardArea.clientHeight);
        // cachedPieceSrc[row][col] = getPieceContainerClass(row, col);
        game.curRow = row;
        game.curCol = col;
        console.log("row of =" + row + "cur row" + game.curRow + " colof =" + col);
        console.log(cellSize.height + " cell size " + cellSize.width);
        console.log(game.gameArea.clientWidth + " clientWidth size ");
        console.log(game.gameArea.clientHeight + " clientHeight size ");
        console.log("voidAreaRow of =" + voidAreaRow + " voidAreacol =" + voidAreacol);
        checkIf(row, col);
        //   }
        game.buttonBg = true;
        var centerXY = getSquareCenterXY(row, col);
        var topLeft = getSquareTopLeft(row, col);
        console.log(game.tempString);
        // if the cell is not empty, don't preview the piece, but still show the dragging lines
        // clearClickToDrag();
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
            // window.alert("touchEnd");
        }
    }
    ///******** *
    ///******** *
    ///******** *
    ///******** *
    ///******** *
    function grow(rrow, ccol) {
        return game.delta &&
            game.delta.row === rrow &&
            game.delta.col === ccol;
    }
    game.grow = grow;
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
            for (var v = 0; v < dic.length; v++) {
                if (dic[v] === res) {
                    game.guessList.push(tempString);
                    showGuess();
                    console.log("yes in dictionary");
                    return;
                }
                else {
                    console.log("not in dictionary " + res);
                }
            }
            tempString = null;
            if (game.dragArr.length === 0) {
                game.dragArr.push(4 + '' + 4);
            }
            console.log(game.guessList);
            // if (deadBoard == null) {
            ///window.alert("something deadboard")
            // game.tempString = game.tempString.concat(game.state.board[row][col]);
            //  moveToConfirm = {row: row, col: col};
            // alert(board[row][col]);
            // } else {
            //window.alert("something deadboard")
            //game.tempString = game.tempString.concat(game.state.board[row][col]);
            // clearClickToDrag();
            //}
        });
    }
    function showGuess() {
        game.g = game.guessList.join(", ");
        return game.g;
    }
    game.showGuess = showGuess;
    //********* *
    ///******** *
    ///******** *
    ///******** *
    function getProposalsBoard(playerIdToProposal) {
        var proposals = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            proposals[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                proposals[i][j] = 0;
            }
        }
        for (var playerId in playerIdToProposal) {
            var proposal = playerIdToProposal[playerId];
            var delta_1 = proposal.data;
            proposals[delta_1.row][delta_1.col]++;
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
            // If only proposals changed, then return.
            // I don't want to disrupt the player if he's in the middle of a move.
            // I delete playerIdToProposal field from params (and so it's also not in currentUpdateUI),
            // and compare whether the objects are now deep-equal.
            params.playerIdToProposal = null;
            if (game.currentUpdateUI && angular.equals(game.currentUpdateUI, params))
                return;
        }
        game.currentUpdateUI = params;
        startTimer();
        showGuess();
        updateCache();
        clearAnimationTimeout();
        game.state = params.state;
        if (isFirstMove()) {
            game.state = gameLogic.getInitialState();
            //window.alert(state);
        }
        // We calculate the AI move only after the animation finishes,
        // because if we call aiService now
        // then the animation will be paused until the javascript finishes.
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
        var move = aiService.findComputerMove(currentMove);
        log.info("Computer move: ", move);
        makeMove(move);
    }
    function makeMove(move) {
        if (game.didMakeMove) {
            return;
        }
        game.didMakeMove = true;
        if (!game.proposals) {
            gameService.makeMove(move, null);
        }
        else {
            var delta_2 = move.state.delta;
            var myProposal = {
                data: delta_2,
                chatDescription: '' + (delta_2.row + 1) + 'x' + (delta_2.col + 1),
                playerInfo: game.yourPlayerInfo,
            };
            // Decide whether we make a move or not (if we have <currentCommunityUI.numberOfPlayersRequiredToMove-1> other proposals supporting the same thing).
            if (game.proposals[delta_2.row][delta_2.col] < game.currentUpdateUI.numberOfPlayersRequiredToMove - 1) {
                move = null;
            }
            gameService.makeMove(move, myProposal);
        }
    }
    function isFirstMove() {
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
    function shouldShowImage(row, col) {
        return game.state.board[row][col] !== "" || isProposal(row, col);
    }
    game.shouldShowImage = shouldShowImage;
    function isPiece(row, col, turnIndex, pieceKind) {
        return game.state.board[row][col] === pieceKind || (isProposal(row, col) && game.currentUpdateUI.turnIndex == turnIndex);
    }
    function isPieceX(row, col) {
        return isPiece(row, col, 0, 'X');
    }
    game.isPieceX = isPieceX;
    function isPieceO(row, col) {
        return isPiece(row, col, 1, 'O');
    }
    game.isPieceO = isPieceO;
    function shouldSlowlyAppear(row, col) {
        return game.state.delta &&
            game.state.delta.row === row && game.state.delta.col === col;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
})(game || (game = {}));
angular.module('myApp', ['gameServices'])
    .run(['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        $rootScope['game'] = game;
        game.init($rootScope, $timeout);
    }]);
//# sourceMappingURL=game.js.map