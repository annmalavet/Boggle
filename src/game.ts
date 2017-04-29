interface SupportedLanguages {
  en: string, iw: string,
  pt: string, zh: string,
  el: string, fr: string,
  hi: string, es: string,
}

interface CellSize {
  width: number;
  height: number;
}
interface RowCol {
  roww: number;
  coll: number;
}

interface Score {
  first: number, second: number;
}

module game {
 export let  trie = new gameTrie.Trie();
  export let isModalShown = false;
  export let modalTitle = "Your turn is over";
  export let modalBody = "Time is up";
  export let $rootScope: angular.IScope = null;
  export let $timeout: angular.ITimeoutService = null;
  // Global variables are cleared when getting updateUI.
  // I export all variables to make it easy to debug in the browser by
  // simply typing in the console, e.g.,
  export let board: Board = null;
  export let boardBeforeMove: Board = null;
  export let currentUpdateUI: IUpdateUI = null;
  export let oldGuessList: GuessList = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let state: IState = null;
  // For community games.
  export let buttonNums = 16;
  export let proposals: string[][] = null;
  export let yourPlayerInfo: IPlayerInfo = null;
  export let tempString: string = '';
  export let dragArr: string[];
  export let toClearRC: RowCol[] = null;
  export let g: string = '';
  export let buttonBg = false;
  export let counter = 100;
  export let countDownLeft = 60;
  export let clickToDragPiece: HTMLElement;
  export let time: HTMLElement;
  export let gameArea: HTMLElement;
  export let boardArea: HTMLElement;
  export let dim = 4;
  export let scoreObj: Score = { first: 0, second: 0 };
  export function score() {
   let s = state.guessList;
  return s.length;
}
  export function makeDic() {
    for (let i: number = 0; i < 100; i++) {
        var res = gameLogic.myDict[i].toLowerCase();
    console.log("trie inserted? "+trie.contains(res));
      trie.insert( gameLogic.myDict[i], i)
    }
  }
  export function clearClickToDrag(row: number, col: number) {
    return "";
  }
  export function getAnimationClass(row: number, col: number) {

  }
  export function getPieceContainerClass(row: number, col: number) {
    toClearRC.push({ roww: row, coll: col });
    return "growi";
  }
  export let cachedPieceClass: string[][] = getEmpty8Arrays();
  export let cachedPieceSrc: string[][] = getEmpty8Arrays();
  export let cachedAvatarPieceCrown: string[][] = getEmpty8Arrays();
  function getEmpty8Arrays(): string[][] {
    let res: string[][] = [];
    for (let i = 0; i < 4; i++) res.push([]);
    return res;
  }
  export function updateCache() {

  }
  export function reset() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        cachedPieceSrc[i][j] = clearClickToDrag(i, j);
      }
    }
  }
  function showModal() {
    isModalShown = true;

  }

  let cacheIntegersTill: number[][] = [];
  export function getIntegersTill(number: any): number[] {
    if (cacheIntegersTill[number]) return cacheIntegersTill[number];
    let res: number[] = [];
    for (let i = 0; i < number; i++) {
      res.push(i);
    }
    cacheIntegersTill[number] = res;
    return res;
  }

  export function init($rootScope_: angular.IScope, $timeout_: angular.ITimeoutService) {
    $rootScope = $rootScope_;
    $timeout = $timeout_;
    time = document.getElementById("timer");
    gameArea = document.getElementById("gameArea");
    boardArea = document.getElementById("boardArea");
    dragAndDropService.addDragListener("boardArea", handleDragEvent);
    makeDic();
    dragArr = [];
    isModalShown = false;
    dragArr.push(4 + '' + 4);
    toClearRC = [];
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    translate.setLanguage('en');
    resizeGameAreaService.setWidthToHeight(1);
    gameService.setGame({
      updateUI: updateUI,
      getStateForOgImage: getStateForOgImage,
    });

  }

  function checkIf(row: number, col: number) {
    
    for (let i = 0; i < dragArr.length; i++) {
      if (dragArr.indexOf(row + '' + col) === -1) {
         cachedPieceSrc[row][col] = getPieceContainerClass(row, col);
        game.tempString = tempString.concat(state.chosenBoard[row][col]);
        showGuess();
        console.log(game.tempString);
        dragArr.push(row + '' + col);
      }
    }
  }


  function registerServiceWorker() {
    // I prefer to use appCache over serviceWorker
    // (because iOS doesn't support serviceWorker, so we have to use appCache)
    // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
    if (!window.applicationCache && 'serviceWorker' in navigator) {
      let n: any = navigator;
      log.log('Calling serviceWorker.register');
      n.serviceWorker.register('service-worker.js').then(function (registration: any) {
        log.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err: any) {
        log.log('ServiceWorker registration failed: ', err);
      });
    }
  }

  function getTranslations(): Translations {
    return {};
  }

  export function isProposal(row: number, col: number) {
    return proposals && proposals[row][col].length > 0;
  }
  ///


  let timeoutId: any = null;
  export function isTimerRunning(): boolean {
    return timeoutId;
  }
  function stopTimer() {
    if (!timeoutId) return;
    $timeout.cancel(timeoutId);
  }
  export function startTimer() {
    stopTimer();
    let timerCount = 60;
    let countDown = function () {
      isModalShown = false;
      if (timerCount < 0) {
        let move: IMove;
        if (yourPlayerIndex() == 1) {
          isModalShown = true;
          let scoreDiff = oldGuessList.length - state.guessList.length;
          let endMatchScores: number[] = scoreDiff > 0 ? [1, 0] : [0, 1];
          move = gameLogic.createEndMove(state, endMatchScores);
        } else {
          move = gameLogic.createMove(game.state.chosenBoard,
          state, yourPlayerIndex());
          isModalShown = true;
        }
        makeMove(move);

      } else {
        countDownLeft = timerCount;
        timerCount--;
        timeoutId = $timeout(countDown, 1000);
      }
    };
    countDownLeft = timerCount;
    countDown();
  }

  export function listOf(row: number, col: number) {
    let arr = [];
    arr.push(game.state.chosenBoard[row][col]);
    console.log(tempString);
    return tempString;
  }

  export function addText(guessList: string[]) {
    //window.alert(tempString);
    let s = state.guessList;
    let a = 'A';
    return s;
  }
  function getCellSize(): CellSize {
    return {
      width: gameArea.clientWidth / gameLogic.COLS,
      height: gameArea.clientHeight / gameLogic.ROWS
    };
  }
  export function getBgImg(row: number, col: number) {
    let oka = 'alphabet/img_' + game.state.chosenBoard[row][col] + '.png';
    return oka;
  }
  export function getID(row: number, col: number) {
    let id = game.state.chosenBoard[row][col];
    return id;
  }

  function handleDragEvent(type: any, clientX: any, clientY: any) {
    //  if (!isHumanTurn() || passes == 2) {
    ///   return; // if the game is over, do not display dragging effect
    //}
    if (!isMyTurn()) return;
    let x = clientX - boardArea.offsetLeft - gameArea.offsetLeft;
    let y = clientY - boardArea.offsetTop - gameArea.offsetTop;
    var som = document.elementFromPoint(clientX, clientY);
    if (!som || !som.id || som.id.indexOf('_') == -1) return;
    let arrId = som.id.split("_");
    let a = parseInt(arrId[0]);
    let b = parseInt(arrId[1]);
   
    checkIf(a, b);

    if (x < 0 || x >= boardArea.clientWidth || y < 0 || y >= boardArea.clientHeight) {
      var col = Math.floor(x * 4 / game.boardArea.clientWidth);
      var row = Math.floor(y * 4 / game.boardArea.clientHeight);
      return;
    }


    if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
      // drag ended
      dragDone(tempString, row, col);
      tempString = '';
      dragArr = [];
      dragArr.push(4 + '' + 4);
    }
  }

  function getSquareTopLeft(row: number, col: number) {
    let size = getSquareWidthHeight();
    return { top: row * size.height, left: col * size.width }
  }
  function getSquareWidthHeight() {
    let boardArea = document.getElementById("boardArea");
    return {
      width: boardArea.clientWidth / (4), ///******** * TODO: 9 is hardcoded
      height: boardArea.clientHeight / (4)
    };
  }
  function getSquareCenterXY(row: number, col: number) {
    let size = getSquareWidthHeight();
    return {
      x: col, // * size.width + size.width / 2,
      y: row // * size.height + size.height / 2
    };
  }

  function dragDone(tempString: any, row: number, col: number) {
    $rootScope.$apply(function () {
      let dic = gameLogic.myDict;
      var res = tempString.toLowerCase();
      //$rootScope.boxClass = false;
      console.log(tempString);
      //for (var v = 0; v < dic.length; v++) {
      //  if (dic[v] === res) {
        if (trie.contains(tempString)) {
          state.guessList.push(tempString);
          console.log("trie trying out "+trie.contains(tempString));
          console.log("yes in dictionary");
          reset();
          tempString = null;
          return;
        } else {
          console.log("not in dictionary " + res);
          reset();
        }
      //}
      if (dragArr.length === 0) {
        dragArr.push(4 + '' + 4);
      }
      console.log(state.guessList);
    });
  }
  export function showGuess() {
    g = tempString;
    return g;
  }

  function getProposalsBoard(playerIdToProposal: IProposals): string[][] {
    let proposals: string[][] = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      proposals[i] = [];
      for (let j = 0; j < gameLogic.COLS; j++) {
        proposals[i][j] = game.state.chosenBoard[i][j];
      }
    }
    for (let playerId in playerIdToProposal) {
      let proposal = playerIdToProposal[playerId];
      let delta = proposal.data;
    }
    return proposals;
  }


  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    let playerIdToProposal = params.playerIdToProposal;
    // Only one move/proposal per updateUI
    didMakeMove = playerIdToProposal && playerIdToProposal[yourPlayerInfo.playerId] != undefined;
    yourPlayerInfo = params.yourPlayerInfo;
    proposals = null;

    currentUpdateUI = params;
    oldGuessList = params.state ? angular.copy(params.state.guessList) : null;
    updateCache();
    
    clearAnimationTimeout();
    state = params.state;
    if (isFirstMove()) {
      isModalShown = false;
      let move = gameLogic.createInitialMove();
      state = move.state;
      if (isMyTurn()) makeMove(move);
    }

    if (isMyTurn()) {
      startTimer();
    }

  }

  function animationEndedCallback() {
    log.info("Animation ended");
    maybeSendComputerMove();
  }

  function clearAnimationTimeout() {
    if (animationEndedTimeout) {
      $timeout.cancel(animationEndedTimeout);
      animationEndedTimeout = null;
    }
  }

  function maybeSendComputerMove() {
    if (!isComputerTurn()) return;
    let currentMove: IMove = {
      endMatchScores: currentUpdateUI.endMatchScores,
      state: currentUpdateUI.state,
      turnIndex: currentUpdateUI.turnIndex,
    }
    //let move = aiService.findComputerMove(currentMove);
    //   log.info("Computer move: ", move);
    // makeMove(move);
  }

  function makeMove(move: IMove) {

    didMakeMove = true;
    let delta = { board: game.state.chosenBoard, guessList: state.guessList };
    let myProposal: IProposal = {
      data: delta,
      chatDescription: 'player guessed ' + game.state.guessList.length,
      playerInfo: yourPlayerInfo,
    };
    // Decide whether we make a move or not
      gameService.makeMove(move, myProposal);
    
  }

  function isFirstMove() {
    console.log("first move ");
    return !currentUpdateUI.state;
  }

  function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  function isComputer() {
    let playerInfo = currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex];
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
    return !didMakeMove && // you can only make one move per updateUI.
      currentUpdateUI.turnIndex >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.turnIndex; // it's my turn
  }


  export function getStateForOgImage(): string {
    if (!currentUpdateUI || !currentUpdateUI.state) {
      log.warn("Got stateForOgImage without currentUpdateUI!");
      return '';
    }
    let state: IState = currentUpdateUI.state;
    let board: string[][] = game.state.chosenBoard;
    if (!board) return '';
    let boardStr: string = '';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        boardStr += board[row][col];
      }
    }
    return boardStr;
  }

}



var app = angular.module('myApp', ['gameServices']);
app.run(['$rootScope', '$timeout',
  function ($rootScope: angular.IScope, $timeout: angular.ITimeoutService) {
    $rootScope['game'] = game;
    game.init($rootScope, $timeout);
  }]);



app.controller('MainController', ['$scope', '$rootScope', function ($scope: any, $rootScope: any) {


  $scope.animateToggle = false;
}]);

