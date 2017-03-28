var gameService = gamingPlatform.gameService;
var alphaBetaService = gamingPlatform.alphaBetaService;
var translate = gamingPlatform.translate;
var resizeGameAreaService = gamingPlatform.resizeGameAreaService;
var log = gamingPlatform.log;
var dragAndDropService = gamingPlatform.dragAndDropService;
var gameLogic;
(function (gameLogic) {
    gameLogic.ROWS = 4;
    gameLogic.COLS = 4;
    /** Returns the initial board, which is a 4x4 matrix containing letters.
     *
     *    *  [['E', 'A', 'B', 'C'],
     *      ['D', 'A', 'B', 'C'],
     *      ['E', 'A', 'B', 'C']]
     */
    function getInitialBoard() {
        // window.alert("get initial board");
        var board = [];
        var diceArr = [
            [
                ['A', 'A', 'C', 'I', 'O', 'T'],
                ['A', 'H', 'M', 'O', 'R', 'S'],
                ['E', 'G', 'K', 'L', 'U', 'Y'],
                ['A', 'B', 'I', 'L', 'T', 'Y']
            ],
            [
                ['A', 'C', 'D', 'E', 'M', 'P'],
                ['E', 'G', 'I', 'N', 'T', 'V'],
                ['G', 'I', 'L', 'R', 'U', 'W'],
                ['E', 'L', 'P', 'S', 'T', 'U']
            ],
            [
                ['D', 'E', 'N', 'O', 'S', 'W'],
                ['A', 'C', 'E', 'L', 'R', 'S'],
                ['A', 'B', 'J', 'M', 'O', 'Qu'],
                ['E', 'E', 'F', 'H', 'I', 'Y']
            ],
            [
                ['E', 'H', 'I', 'N', 'P', 'S'],
                ['D', 'K', 'N', 'O', 'T', 'U'],
                ['A', 'D', 'E', 'N', 'V', 'Z'],
                ['B', 'I', 'F', 'O', 'R', 'X']
            ]
        ];
        var curArr = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            board[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                var ran = Math.floor((Math.random() * 5));
                board[i][j] = diceArr[i][j][ran];
                //board[i][j] = diceArr[i][ran];
                log.info([ran, i, j, board[i][j]]);
                console.log(diceArr[i][ran]);
            }
        }
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function getInitialState() {
        return { board: getInitialBoard(), delta: null
        };
    }
    gameLogic.getInitialState = getInitialState;
    function createInitialMove() {
        return { endMatchScores: null, turnIndex: 0,
            state: getInitialState() };
    }
    gameLogic.createInitialMove = createInitialMove;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(stateBeforeMove, row, col, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var board = stateBeforeMove.board;
        console.log("this is createMove");
        // if (board[row][col] !== '') {
        //   throw new Error("One can only make a move in an empty position!");
        // }
        // if (getWinner(board) !== '' || isTie(board)) {
        //    throw new Error("Can only make a move if the game is not over!");
        //  }
        var boardAfterMove = angular.copy(board);
        // boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
        // let winner = getWinner(boardAfterMove);
        var endMatchScores;
        var turnIndex;
        var delta = { row: row, col: col };
        var state = { delta: delta, board: boardAfterMove };
        return {
            endMatchScores: endMatchScores,
            turnIndex: turnIndex,
            state: state,
        };
    }
    gameLogic.createMove = createMove;
    // 1) return an array of the 16 char pools and 2) return an int array of 16 chosen indices.
    /**
     * Returns true if the game ended in a tie because there are no empty cells.
     * E.g., isTie returns true for the following board:
     *     [['X', 'O', 'X'],
     *      ['X', 'O', 'O'],
     *      ['O', 'X', 'X']]
     
    function isTie(board: Board): boolean {
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (board[i][j] === '') {
            // If there is an empty cell then we do not have a tie.
            return false;
          }
        }
      }
      // No empty cells, so we have a tie!
      return true;
    }
  */
    /**
     * Return the winner (either 'X' or 'O') or '' if there is no winner.
     * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
     * E.g., getWinner returns 'X' for the following board:
     *     [['X', 'O', ''],
     *      ['X', 'O', ''],
     *      ['X', '', '']]
     */
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map