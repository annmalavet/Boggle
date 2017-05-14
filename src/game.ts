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
  export let trie = new gameTrie.Trie();
  export let answerTrie = new gameTrie.Trie();
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
  export let wordsDiscoveredPerPlayer0: string[]=[];
  export let wordsDiscoveredPerPlayer1: string[]=[];
  export let myDictObj: any = {};

  export function score() {
    let s = state.guessList;
    return s.length;
  }
  export function showCurWords() {
    let s = state.guessList.join(', ');;
    return s
  }

  export function showWords() {
    let s = (currentUpdateUI.yourPlayerIndex == 0 ?  state.guessListFirst : state.guessList).join(', ');
    return s;
  }

  export function showWordsOpponents() {
    let s = (currentUpdateUI.yourPlayerIndex == 1 ?  state.guessListFirst : state.guessList).join(', ');
    return s;
  }

  export function makeDic() {
    for (let i: number = 0; i < gameLogic.myDict.length; i++) {
      var res = gameLogic.myDict[i].toLowerCase();
      myDictObj[res] = true;
    }
  }
  export function clearClickToDrag(row: number, col: number) {
    return "";
  }

  export function getPieceContainerClass(row: number, col: number) {
    toClearRC.push({ roww: row, coll: col });
    return "growi";
  }

  export let cachedPieceSrc: string[][] = getEmpty8Arrays();
  function getEmpty8Arrays(): string[][] {
    let res: string[][] = [];
    for (let i = 0; i < 4; i++) res.push([]);
    return res;
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

  //for letters
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
    makeDic();
    $rootScope = $rootScope_;
    $timeout = $timeout_;
    time = document.getElementById("timer");
    gameArea = document.getElementById("gameArea");
    boardArea = document.getElementById("boardArea");
    dragAndDropService.addDragListener("boardArea", handleDragEvent);
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
    isModalShown = false;
    let timerCount = 60;
    let countDown = function () {
      isModalShown = false;
      if (timerCount < 0) {
        let move: IMove;
        if (yourPlayerIndex() == 1) {
          //console.log(oldGuessList.join(', ') + " old guess list");
          isModalShown = true;
         //let guessList2 = state.guessList;
          let scoreDiff = state.guessListFirst.length - state.guessList.length;
          //state.guessList = oldGuessList;
         // state.guessList2 = guessList2;
         let endMatchScores: number[] = [];
         if (scoreDiff ==0){
           endMatchScores = [-1,-1];
         }
         else {
          endMatchScores= scoreDiff > 0 ? [1, 0] : [0, 1];
         }
          move = gameLogic.createEndMove(state, endMatchScores);
        } else {
          move = gameLogic.createMove(game.state.chosenBoard,
          state, yourPlayerIndex(), );
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


    if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
      // drag ended
      dragDone(tempString, row, col);
      tempString = '';
      dragArr = [];
      dragArr.push(4 + '' + 4);
    }
  }

  function isValidWord(word: string) {
    return myDictObj[word];
  }

  function dragDone(tempString: any, row: number, col: number) {
    $rootScope.$apply(function () {
      let dic = gameLogic.myDict;
      var res = tempString.toLowerCase();
        var audio = new Audio();
      if (isValidWord(res) && !(game.answerTrie.contains(tempString)) && tempString.length > 2) {
        state.guessList.push(tempString);
        console.log("yes in dictionary");
        audio = new Audio('sound/chime_up.wav');
        audio.play();
        game.answerTrie.insert(tempString, 0);
        reset();
        tempString = null;
        return;
      } else {
        console.log("not in dictionary " + res);
        reset();
        tempString = null;
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

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    let playerIdToProposal = params.playerIdToProposal;
    // Only one move/proposal per updateUI
    didMakeMove = playerIdToProposal && playerIdToProposal[yourPlayerInfo.playerId] != undefined;
    yourPlayerInfo = params.yourPlayerInfo;
    proposals = null;
    currentUpdateUI = params;
    clearAnimationTimeout();
    state = params.state;
    if (isFirstMove()) {
   
      isModalShown = false;
      let move = gameLogic.createInitialMove();
      state = move.state;
      if (isMyTurn()) makeMove(move);
    }
    if (isMyTurn() && (countDownLeft === 60 || countDownLeft ===0)) {
      isModalShown = false;
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
    // log.info("Computer move: ", move);
    // makeMove(move);
  }

  function makeMove(move: IMove) {
    didMakeMove = true;
    let chat = "Hello."
    let delta = { board: game.state.chosenBoard, guessList0:state.guessListFirst, guessList1: state.guessList };
    let myProposal: IProposal = {
      data: delta,
      chatDescription: chat,
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

