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



module game {

  export let isModalShown = false;
  export let modalTitle = "Game Over";
  export let modalBody = "Done";
  export let $rootScope: angular.IScope = null;
  export let $timeout: angular.ITimeoutService = null;
  // Global variables are cleared when getting updateUI.
  // I export all variables to make it easy to debug in the browser by
  // simply typing in the console, e.g.,
  export let board: Board = null;
  export let boardBeforeMove: Board = null;
  export let delta: BoardDelta = null;
  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let state: IState = null;
  // For community games.
  export let buttonNums = 16;
  export let proposals: string[][] = null;
  export let yourPlayerInfo: IPlayerInfo = null;
  export let tempString: string = '';

  export let arrAnswer: string[] = null;
  export let dragArr: string[];
  export let toClearRC: RowCol[] = null;
  export let g: string = '';
  export let buttonBg = false;
  export let counter = 100;
  export let countDownLeft = 100;
  export let moveToConfirm: BoardDelta = null;
  export let clickToDragPiece: HTMLElement;
  export let time: HTMLElement;
  export let gameArea: HTMLElement;
  export let boardArea: HTMLElement;
  export let deadBoard: boolean[][] = null;
  export let curRow: number = 5;
  export let curCol: number = 5;
  export let hasDim = false;
  export let dim = 4;
  export function rowsPercent() {
    return 100 / dim;
  }
  export function score(){
  return 0;//state.guessList.length;
}
  export function clearClickToDrag(row: number, col: number) {
  return "";
  }
  export function getAnimationClass(row: number, col: number) {

  }
  export function getPieceContainerClass(row: number, col: number) {
    // toClearRC.push([[row][col]]);
    toClearRC.push({ roww: row, coll: col });
    return "grow";
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
export function reset(){
      for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        //cachedPieceSrc[i][j] = clearClickToDrag(i,j);
      }}
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
    dragAndDropService.addDragListener("gameArea", handleDragEvent);
    dragArr = [];
    isModalShown=false;
    dragArr.push(4 + '' + 4);
    toClearRC = [];
    startTimer();
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
       // let topLeft = getSquareTopLeft(row, col);
        game.tempString = game.tempString.concat(game.state.chosenBoard[row][col]);
        showGuess();
        console.log(game.tempString);
        dragArr.push(row + '' + col);
        // console.log(centerXY.y+" and center x: "+centerXY.x);
      }
    }
  }

export function getGrow(){
  return "grow1";
}
export function grow1(){
  return "";
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



  export function startTimer() {
    let timerCount = 60;
    let countDown = function () {
      if (timerCount < 0) {
          didMakeMove = true;
          isModalShown = true;
          let move = gameLogic.createMove(state.chosenBoard,
          state, yourPlayerIndex() );
          makeMove(move);
      } else {
        countDownLeft = timerCount;
        timerCount--;
        $timeout(countDown, 1000);
      }
    };
    countDownLeft = timerCount;
    countDown();
  }
  export function listOf(row: number, col: number) {
    let arr = [];
    arr.push(state.chosenBoard[row][col]);
    console.log(tempString);
    return tempString;
  }
  ///
  ///
  export function setDice(board: Board) {

    let s = 'http://annmalavet.com/Boggle/alphabet/img_A.png';
    let a = "A";
    return board;
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
    let oka = 'alphabet/img_' + state.chosenBoard[row][col] + '.png'
    return oka;
  }

  function handleDragEvent(type: any, clientX: any, clientY: any) {
    //  if (!isHumanTurn() || passes == 2) {
    ///   return; // if the game is over, do not display dragging effect
    //}
    let x = clientX - boardArea.offsetLeft - gameArea.offsetLeft;
    let y = clientY - boardArea.offsetTop - gameArea.offsetTop;
    let cellSize: CellSize = getCellSize();
    var col = Math.floor(x * 4 / boardArea.clientWidth);
    var row = Math.floor(y * 4 / boardArea.clientHeight);
    if (type === "touchstart" || type === "touchmove" ) {
 
    }
    // Center point in boardArea
 if (type === "mouseup"){
  tempString = null;
  }
    let button = document.getElementById("img_" + row + "_" + col);
    if (x < 0 || x >= boardArea.clientWidth || y < 0 || y >= boardArea.clientHeight) {
      var col = Math.floor(x * 4 / game.boardArea.clientWidth);
      var row = Math.floor(y * 4 / game.boardArea.clientHeight);
      //console.log("row=" + row + " col=" + col);
      return;
    }
    //  if (voidAreacol !== 0 || voidAreacol >= 4 || voidAreaRow !== 0 || voidAreaRow >= 4) { 
    var col = Math.floor(x * 4 / game.boardArea.clientWidth);
    var row = Math.floor(y * 4 / game.boardArea.clientHeight);
    let centerXY = getSquareCenterXY(row, col);
    let topLeft = getSquareTopLeft(row, col);
    curRow = row; curCol = col;
    //console.log(centerXY.x+" "+centerXY.y+"get center x y");
    //console.log(cellSize.height + " cell size " + cellSize.width)
    //console.log(gameArea.clientWidth + " clientWidth size ");
    //console.log(gameArea.clientHeight + " clientHeight size ");


    console.log(clientX+" row to height * col -10 "+(cellSize.height * (col+1) -10));
    console.log(clientY+" row to width times row"+(cellSize.width * (row+1) -10 ));
    //console.log(row+" row to checkif then col"+col);
    if (clientY < (cellSize.height * (row+1) -10 )&& (clientX > (cellSize.width * (col+1) -10 ))) {
    console.log((cellSize.height * (row+1) -10 )+" vs " + clientY+" and clientX: "+clientX+" vs "+(clientX < (cellSize.width * (col+1) -10 )));
   cachedPieceSrc[row][col] = getPieceContainerClass(row, col);
   checkIf(row, col);
    }
    buttonBg = true;

   
    // if the cell is not empty, don't preview the piece, but still show the dragging lines
    //  return;
    //  }
    // draggingLines.style.display = "inline";
    //if (type === "touchend") {tempString=null}
    if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
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
      let dic = gameLogic.myDictionary;
      var res = tempString.toLowerCase();
        $rootScope.boxClass = false;
        console.log (tempString);
      for (var v = 0; v < dic.length; v++) {
        if (dic[v] === res) {
          state.guessList.push(tempString);
          //showGuess();
          console.log("yes in dictionary");
          reset();
          return;
        } else {
          console.log("not in dictionary " + res);
          reset();
        }
      }
      
      
      if (dragArr.length === 0) {
        dragArr.push(4 + '' + 4);
      }
      console.log(state.guessList);

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
  export function showGuess() {
    g = tempString;
    return g;
  
  
  }

  function getProposalsBoard(playerIdToProposal: IProposals): string[][] {
    let proposals: string[][] = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      proposals[i] = [];
      for (let j = 0; j < gameLogic.COLS; j++) {
        proposals[i][j] = state.chosenBoard[i][j];
      }
    }
    for (let playerId in playerIdToProposal) {
      let proposal = playerIdToProposal[playerId];
      let delta = proposal.data;
      //proposals[delta.board][delta.guessList]++;?????????????????????????
    }
    return proposals;
  }




  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    let playerIdToProposal = params.playerIdToProposal;
    // Only one move/proposal per updateUI
    didMakeMove = playerIdToProposal && playerIdToProposal[yourPlayerInfo.playerId] != undefined;
    yourPlayerInfo = params.yourPlayerInfo;
    proposals = playerIdToProposal ? getProposalsBoard(playerIdToProposal) : null;
    if (playerIdToProposal) {
      console.log("player id"+ playerIdToProposal);
      // If only proposals changed, then return.
      // I don't want to disrupt the player if he's in the middle of a move.
      // I delete playerIdToProposal field from params (and so it's also not in currentUpdateUI),
      // and compare whether the objects are now deep-equal.
      params.playerIdToProposal = null;
      if (currentUpdateUI && angular.equals(currentUpdateUI, params)) return;
    }
    currentUpdateUI = params;
    score();
    showGuess();
    updateCache();
    clearAnimationTimeout();
    
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
      delta = null;
      board = state.chosenBoard;
    } 
    else{
      state = params.state;
      board =state.chosenBoard; 
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
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
     else {
      let delta = {board: state.chosenBoard, guessList: state.guessList};
      let myProposal: IProposal = {
      data: delta,
      chatDescription: 'player guessed '+state.guessList.length,
      playerInfo: yourPlayerInfo,
      };
      // Decide whether we make a move or not
     gameService.makeMove(move, myProposal);
    }
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
    let board: string[][] = state.chosenBoard;
    if (!board) return '';
    let boardStr: string = '';
    for (let row = 0 ; row < 4; row++) {
      for (let col = 0 ; col < 4; col++) {
        boardStr += board[row][col];
      }
    }
    return boardStr;
  }  


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
}


var app =  angular.module('myApp', ['gameServices']);
  app.run(['$rootScope', '$timeout',
    function ($rootScope: angular.IScope, $timeout: angular.ITimeoutService) {
      $rootScope['game'] = game;
      game.init($rootScope, $timeout);
    }]);

   

app.controller('MainController', ['$scope', '$rootScope', function($scope: any, $rootScope: any) {


    $scope.animateToggle = false;

  }]);

