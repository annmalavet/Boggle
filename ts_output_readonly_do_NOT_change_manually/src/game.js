;
var game;
(function (game) {
    game.$rootScope = null;
    game.$timeout = null;
    // Global variables are cleared when getting updateUI.
    // I export all variables to make it easy to debug in the browser by
    // simply typing in the console, e.g.,
    // game.currentUpdateUI
    game.board = null;
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
    //
    ///
    //
    //
    game.counter = 100;
    game.countDownLeft = 100;
    game.moveToConfirm = null;
    var clickToDragPiece;
    game.deadBoard = null;
    //
    ///
    ///
    //
    function init($rootScope_, $timeout_) {
        game.$rootScope = $rootScope_;
        game.$timeout = $timeout_;
        //
        ///
        clickToDragPiece = document.getElementById("clickToDragPiece");
        game.gameArea = document.getElementById("gameArea");
        game.boardArea = document.getElementById("boardArea");
        dragAndDropService.addDragListener("boardArea", handleDragEvent);
        //
        //
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            updateUI: updateUI,
            getStateForOgImage: null,
        });
        // window.alert("init in game");
    }
    game.init = init;
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
        var timerCount = 60;
        var countDown = function () {
            if (timerCount < 0) {
                window.alert("done");
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
        game.tempString = game.tempString.concat(game.state.board[row][col]);
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
    function addText() {
        //window.alert(tempString);
        var s = game.tempString;
        var a = 'A';
        return s;
    }
    game.addText = addText;
    function onClick(row, col) {
        var oka = 'alphabet/img_' + game.state.board[row][col] + '.png';
        return oka;
    }
    game.onClick = onClick;
    function handleDragEvent(type, clientX, clientY) {
        //  if (!isHumanTurn() || passes == 2) {
        ///   return; // if the game is over, do not display dragging effect
        //}
        if (type === "touchstart" && game.moveToConfirm != null && game.deadBoard == null) {
            game.moveToConfirm = null;
            game.$rootScope.$apply();
        }
        // Center point in boardArea
        var x = clientX - game.boardArea.offsetLeft - game.gameArea.offsetLeft;
        var y = clientY - game.boardArea.offsetTop - game.gameArea.offsetTop;
        // Is outside boardArea?
        var button = document.getElementById("img0");
        if (x < 0 || x >= game.boardArea.clientWidth || y < 0 || y >= game.boardArea.clientHeight) {
            // clearClickToDrag();
            return;
        }
        // Inside boardArea. Let's find the containing square's row and col
        var col = Math.floor(4 * x / game.boardArea.clientWidth);
        var row = Math.floor(4 * y / game.boardArea.clientHeight);
        game.tempString = game.tempString.concat(game.state.board[row][col]);
        // if the cell is not empty, don't preview the piece, but still show the dragging lines
        // if ((board[row][col] !== '' && deadBoard == null) ||
        //     (board[row][col] == '' && deadBoard != null)) {
        // clearClickToDrag();
        //  return;
        //  }
        //  clickToDragPiece.style.display = deadBoard == null ? "inline" : "none";
        // draggingLines.style.display = "inline";
        var centerXY = getSquareCenterXY(row, col);
        // show the piece
        //let cell = document.getElementById('board' + row + 'x' + col).className = $scope.turnIndex === 0 ? 'black' : 'white';
        var topLeft = getSquareTopLeft(row, col);
        // clickToDragPiece.style.left = topLeft.left + "px";
        //  clickToDragPiece.style.top = topLeft.top + "px";
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            dragDone(row, col);
        }
    }
    ///******** *
    ///******** *
    ///******** *
    ///******** *
    ///******** *
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return { top: row * size.height, left: col * size.width };
    }
    function getSquareWidthHeight() {
        var boardArea = document.getElementById("boardArea");
        return {
            width: boardArea.clientWidth / (9),
            height: boardArea.clientHeight / (9)
        };
    }
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col,
            y: row //* size.height + size.height / 2
        };
    }
    function dragDone(row, col) {
        game.$rootScope.$apply(function () {
            if (game.deadBoard == null) {
                // moveToConfirm = {row: row, col: col};
                alert(game.board[row][col]);
            }
            else {
                game.tempString = game.tempString.concat(game.board[row][col]);
                // clearClickToDrag();
            }
        });
    }
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
            var delta = proposal.data;
            proposals[delta.row][delta.col]++;
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
        addText();
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
            var delta = move.state.delta;
            var myProposal = {
                data: delta,
                chatDescription: '' + (delta.row + 1) + 'x' + (delta.col + 1),
                playerInfo: game.yourPlayerInfo,
            };
            // Decide whether we make a move or not (if we have <currentCommunityUI.numberOfPlayersRequiredToMove-1> other proposals supporting the same thing).
            if (game.proposals[delta.row][delta.col] < game.currentUpdateUI.numberOfPlayersRequiredToMove - 1) {
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