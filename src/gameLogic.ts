type Board = string[][];



interface BoardDelta {// extends Array<TextOf> {
  row: number;
  col: number;
}

type IProposalData = BoardDelta;
interface IState {
  board: Board;
  delta: BoardDelta;
  //guessList: TextOf;
}

interface IState {
  board: Board;
  delta: BoardDelta;
}

import gameService = gamingPlatform.gameService;
import alphaBetaService = gamingPlatform.alphaBetaService;
import translate = gamingPlatform.translate;
import resizeGameAreaService = gamingPlatform.resizeGameAreaService;
import log = gamingPlatform.log;
import dragAndDropService = gamingPlatform.dragAndDropService;

module gameLogic {
  export const ROWS = 4;
  export const COLS = 4;

  /** Returns the initial board, which is a 4x4 matrix containing letters.
   * 
   *    *  [['E', 'A', 'B', 'C'],
   *      ['D', 'A', 'B', 'C'],
   *      ['E', 'A', 'B', 'C']]
   */



  export function getInitialBoard(): Board {

    // window.alert("get initial board");
    let board: Board = [];


  let diceArr =[
	    [
	    	['A','A','C','I','O','T'],
	   		['A','H','M','O','R','S'],
	    	['E','G','K','L','U','Y'],
	    	['A','B','I','L','T','Y']
	    ],
	    [
	    	['A','C','D','E','M','P'],
	    	['E','G','I','N','T','V'],
	    	['G','I','L','R','U','W'],
	    	['E','L','P','S','T','U']
	    ],
	    [
	    	['D','E','N','O','S','W'],
	    	['A','C','E','L','R','S'],
	    	['A','B','J','M','O','Qu'],
	    	['E','E','F','H','I','Y']
	    ],
	    [
	    	['E','H','I','N','P','S'],
	    	['D','K','N','O','T','U'],
	    	['A','D','E','N','V','Z'],
	    	['B','I','F','O','R','X']
	    ]
	];
    let curArr = [];
    for (let i = 0; i < ROWS; i++) {
  board[i] = [];
      for (let j = 0; j < COLS; j++) {
          let ran: number = Math.floor((Math.random() * 6) + 0);
        board[i][j] = diceArr[i][j][ran];
         console.log (diceArr[i][ran]);

      }
    }
    return board;
  }
  export function getInitialState(): IState {
    return {board: getInitialBoard(), delta: null
    };
  }

    export function createInitialMove(): IMove {
    return {endMatchScores: null, turnIndex: 0, 
        state: getInitialState()};  
  }


  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
      stateBeforeMove: IState, row: number, col: number, turnIndexBeforeMove: number ): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let board: Board = stateBeforeMove.board;
    console.log("this is createMove");
   // if (board[row][col] !== '') {
   //   throw new Error("One can only make a move in an empty position!");
   // }
   // if (getWinner(board) !== '' || isTie(board)) {
  //    throw new Error("Can only make a move if the game is not over!");
  // }
    let boardAfterMove = angular.copy(board);
   // boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
   // let winner = getWinner(boardAfterMove);
    let endMatchScores: number[];
    let turnIndex: number;
    let delta: BoardDelta = {row: row, col: col } ;
    let state: IState = {delta: delta, board: boardAfterMove};
    return {
      endMatchScores: endMatchScores,
      turnIndex: turnIndex,
      state: state,
   
    };
  }
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

}
