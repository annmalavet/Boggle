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


module game {
  export let $rootScope: angular.IScope = null;
  export let $timeout: angular.ITimeoutService = null;
  // Global variables are cleared when getting updateUI.
  // I export all variables to make it easy to debug in the browser by
  // simply typing in the console, e.g.,
  // game.currentUpdateUI
  export let board: Board = null;
  export let boardBeforeMove: Board = null;
  export let delta: BoardDelta = null;
  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let state: IState = null;
  // For community games.
  export let buttonNums = 16;
  export let proposals: number[][] = null;
  export let yourPlayerInfo: IPlayerInfo = null;
  export let tempString: string = '';
  export let guessList: string[] = [];
  export let arrAnswer: string[] = null;
  export let dragArr:string[];
  export let g:string ='';
  export let buttonBg = false;
  export let counter = 100;
  export let countDownLeft = 100;
  export let moveToConfirm: BoardDelta = null;
  let clickToDragPiece: HTMLElement;
  export let gameArea: HTMLElement;
  export let boardArea: HTMLElement;
  export let deadBoard: boolean[][] = null;

  export let hasDim = false;
  export let dim = 4;
  export function rowsPercent() {
    return 100 / dim;
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
  export function getCellStyle(row: number, col: number): Object {
    if (!proposals) return {};
    let count = proposals[row][col];
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



  export function getBoardPiece(row: number, col: number): string {
    let piece = game.board[row][col];
    let pieceBefore = game.boardBeforeMove[row][col];
    let isProposal = proposals && proposals[row][col] > 0;
    //

    return isProposal ? (currentUpdateUI.turnIndex == 0 ? '1' : '2') :
      !piece && !pieceBefore ? '' : (piece == 'A' || pieceBefore == 'B' ? 'B' : 'C');
  }
  export function shouldSlowlyDrop(rrow: number, ccol: number) {
    return delta &&
      delta.row === rrow &&
      delta.col === ccol;
  }

  //
  ///
  ///
  //
  export function init($rootScope_: angular.IScope, $timeout_: angular.ITimeoutService) {
    $rootScope = $rootScope_;
    $timeout = $timeout_;
    //
    ///
    gameArea = document.getElementById("gameArea");
    boardArea = document.getElementById("boardArea");
    dragAndDropService.addDragListener("gameArea", handleDragEvent);
    dragArr=[];
    dragArr.push(4+''+4);
 
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
  function checkIf(row:number, col:number){
    for(let i=0; i<dragArr.length; i++) {
        if(dragArr.indexOf(row+''+col)===-1) {
           game.tempString = game.tempString.concat(game.state.board[row][col]);
            dragArr.push(row+''+col);

//if( tempString in data1)  {
// console.log("match match match match match match match");
//}

        }    
}
 console.log(dragArr.length);
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
    return proposals && proposals[row][col] > 0;
  }
  ///
  export function startTimer() {
    let timerCount = 60;

    let countDown = function () {
      if (timerCount < 0) {
        // window.alert("done");
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
    //tempString = tempString.concat(state.board[row][col]);
    arr.push(state.board[row][col]);
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

  export function addText(guessList:string[]) {
    //window.alert(tempString);
    let s = guessList;
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
    let oka = 'alphabet/img_' + state.board[row][col] + '.png'
    return oka;
  }

  function handleDragEvent(type: any, clientX: any, clientY: any) {

    //  if (!isHumanTurn() || passes == 2) {
    ///   return; // if the game is over, do not display dragging effect
    //}
    let cellSize: CellSize = getCellSize();

     if (type === "touchstart" ) {
       clickToDragPiece = document.getElementById("img_" + row + "_" + col);//"img_" + row + "_" + col);
       console.log(clickToDragPiece.id);
        let style: any = clickToDragPiece.style;
        clickToDragPiece.style.visibility='visible';
        style['transform']=1.3;
        updateUI(currentUpdateUI);
    }
    // Center point in boardArea
    let x = clientX - boardArea.offsetLeft - gameArea.offsetLeft;
    let y = clientY - boardArea.offsetTop - gameArea.offsetTop;
    // Is outside boardArea?
//center x = 
//x + 1/2 of width 
//Center y = 
//y + 1/2 of height 

    let button = document.getElementById("img_" + row + "_" + col);


    if (x < 0 || x >= boardArea.clientWidth || y < 0 || y >= boardArea.clientHeight) {
      // clearClickToDrag();
      var col = Math.floor(x * 4 / boardArea.clientWidth);
      var row = Math.floor(y * 4 / boardArea.clientHeight);
      console.log("row=" + row + " col=" + col);
     // game.tempString = game.tempString.concat(game.state.board[col][row]);
      return;
    }

    

    // Inside boardArea. Let's find the containing square's row and col
    var col = Math.floor(x * 4 / game.boardArea.clientWidth);
    var row = Math.floor(y * 4 / game.boardArea.clientHeight);
    // window.alert(col+" "+row);

    //game.tempString = game.tempString.concat(game.state.board[row][col]);
    console.log("row of =" + row + " colof =" + col);
//if (dragArr.indexOf(row+''+col) === 1){
     checkIf(row, col);


    buttonBg = true;
    let centerXY = getSquareCenterXY(row, col);
    let topLeft = getSquareTopLeft(row, col);
    console.log(tempString);
    // if the cell is not empty, don't preview the piece, but still show the dragging lines
    // clearClickToDrag();
    //  return;
    //  }
    // clickToDragPiece.style.display = deadBoard == null ?  tempString = tempString.concat(state.board[row][col]) : "none";
    // draggingLines.style.display = "inline";

    //if (type === "touchend") {tempString=null}
    if (type === "touchend"|| type === "touchcancel" || type === "touchleave" || type === "mouseup") {
      // drag ended
      // tempString = tempString.concat(state.board[x][y]);  
      dragDone(tempString);
       tempString='';
       dragArr=[];
      dragArr.push(4+''+4);
      // window.alert("touchEnd");
    }
  }
  ///******** *
  ///******** *
  ///******** *
  ///******** *
  ///******** *

export function grow(row: number, col: number) {

    // scale will be between 0.6 and 0.8.
    let scale = 0.6 + 0.2 ;
    // opacity between 0.5 and 0.7
    let opacity = 0.5 + 0.2 ;

    return {
      transform: 'scale(${scale}, ${scale})'
    };
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

  function dragDone(tempString:any) {
    $rootScope.$apply(function () {
      let dic = gameLogic.myDictionary;
      var res = tempString.toLowerCase();
for (var v=0;v<dic.length;v++) {
    if (dic[v]===res) {
      guessList.push(tempString);
      showGuess();
      console.log("yes in dictionary");
      return;
    }else {
      console.log("not in dictionary "+res);
}
}
      tempString=null;
      if (dragArr.length===0){
      dragArr.push(4+''+4);
      }
      console.log(guessList);
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
 export function  showGuess(){
   g = guessList.join(", "); 
  return g; 
}

  //********* *
  ///******** *
  ///******** *
  ///******** *
  function getProposalsBoard(playerIdToProposal: IProposals): number[][] {
    let proposals: number[][] = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      proposals[i] = [];
      for (let j = 0; j < gameLogic.COLS; j++) {
        proposals[i][j] = 0;
      }
    }
    for (let playerId in playerIdToProposal) {
      let proposal = playerIdToProposal[playerId];
      let delta = proposal.data;
      proposals[delta.row][delta.col]++;
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
      // If only proposals changed, then return.
      // I don't want to disrupt the player if he's in the middle of a move.
      // I delete playerIdToProposal field from params (and so it's also not in currentUpdateUI),
      // and compare whether the objects are now deep-equal.
      params.playerIdToProposal = null;
      if (currentUpdateUI && angular.equals(currentUpdateUI, params)) return;
    }

    currentUpdateUI = params;
    startTimer();
    showGuess();
    clearAnimationTimeout();
    state = params.state;
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
      //window.alert(state);
    }
    // We calculate the AI move only after the animation finishes,
    // because if we call aiService now
    // then the animation will be paused until the javascript finishes.
    animationEndedTimeout = $timeout(animationEndedCallback, 500);
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
    let move = aiService.findComputerMove(currentMove);
    log.info("Computer move: ", move);
    makeMove(move);
  }

  function makeMove(move: IMove) {
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;

    if (!proposals) {
      gameService.makeMove(move, null);
    } else {
      let delta = move.state.delta;
      let myProposal: IProposal = {
        data: delta,
        chatDescription: '' + (delta.row + 1) + 'x' + (delta.col + 1),
        playerInfo: yourPlayerInfo,
      };
      // Decide whether we make a move or not (if we have <currentCommunityUI.numberOfPlayersRequiredToMove-1> other proposals supporting the same thing).
      if (proposals[delta.row][delta.col] < currentUpdateUI.numberOfPlayersRequiredToMove - 1) {
        move = null;
      }
      gameService.makeMove(move, myProposal);
    }
  }

  function isFirstMove() {
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





  export function shouldShowImage(row: number, col: number): boolean {
    return state.board[row][col] !== "" || isProposal(row, col);
  }

  function isPiece(row: number, col: number, turnIndex: number, pieceKind: string): boolean {
    return state.board[row][col] === pieceKind || (isProposal(row, col) && currentUpdateUI.turnIndex == turnIndex);
  }

  export function isPieceX(row: number, col: number): boolean {
    return isPiece(row, col, 0, 'X');
  }

  export function isPieceO(row: number, col: number): boolean {
    return isPiece(row, col, 1, 'O');
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return state.delta &&
      state.delta.row === row && state.delta.col === col;

  }
}
angular.module('myApp', ['gameServices'])
  .run(['$rootScope', '$timeout',
    function ($rootScope: angular.IScope, $timeout: angular.ITimeoutService) {
      $rootScope['game'] = game;
      game.init($rootScope, $timeout);
    }]);
