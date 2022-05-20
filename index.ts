import Prompt from 'prompt-sync';

enum Player {
    X = 'X',
    O = 'O',
}

type Board = Array<Array<string | null>>;
type Score = number;
type Move = number | undefined;

class TicTacToe {
    private turn: number;
    private gameOver: boolean;
    private gameBoard: Board;

    constructor() {
        this.turn = 0;
        this.gameOver = false;
        this.gameBoard = new Array(3).fill(null).map(x => new Array(3).fill(null));
    }

    public resetGame() {
        this.turn = 0;
        this.gameOver = false;
        this.gameBoard = new Array(3).fill(null).map(x => new Array(3).fill(null));
    }

    public printBoard() {
        console.log("\n   TURN ", this.turn);
        console.log("┌───────────┐");
        console.log(`│ ${this.gameBoard[0][0] ?? '⓵'} │ ${this.gameBoard[0][1] ?? '⓶'} │ ${this.gameBoard[0][2] ?? '⓷'} │`);
        console.log(`│ ${this.gameBoard[1][0] ?? '⓸'} │ ${this.gameBoard[1][1] ?? '⓹'} │ ${this.gameBoard[1][2] ?? '⓺'} │`);
        console.log(`│ ${this.gameBoard[2][0] ?? '⓻'} │ ${this.gameBoard[2][1] ?? '⓼'} │ ${this.gameBoard[2][2] ?? '⓽'} │`);
        console.log("└───────────┘");
    }

    public mapRowColToSquare(row: number, col: number): number {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            throw Error('Error mapping row and column!');
        }
        if (row == 0 && col == 0) return 1;
        if (row == 0 && col == 1) return 2;
        if (row == 0 && col == 2) return 3;
        if (row == 1 && col == 0) return 4;
        if (row == 1 && col == 1) return 5;
        if (row == 1 && col == 2) return 6;
        if (row == 2 && col == 0) return 7;
        if (row == 2 && col == 1) return 8;
        if (row == 2 && col == 2) return 9;
    }

    public isSquareEmpty(square: number): boolean {
        switch (square) {
            case 1:
                return this.gameBoard[0][0] === null;
            case 2:
                return this.gameBoard[0][1] === null;
            case 3:
                return this.gameBoard[0][2] === null;
            case 4:
                return this.gameBoard[1][0] === null;
            case 5:
                return this.gameBoard[1][1] === null;
            case 6:
                return this.gameBoard[1][2] === null;
            case 7:
                return this.gameBoard[2][0] === null;
            case 8:
                return this.gameBoard[2][1] === null;
            case 9:
                return this.gameBoard[2][2] === null;
            default:
                throw Error('Square input should be between 1-9');
        }
    }

    public isWinning(player: Player, board: Board = this.gameBoard) {
        if (board[0][0] === player) {
            if (board[0][1] === player) {
                if (board[0][2] === player) return true;
            }
            if (board[1][0] === player) {
                if (board[2][0] === player) return true;
            }
            if (board[1][1] === player) {
                if (board[2][2] === player) return true;
            }
        }

        if (board[0][1] === player) {
            if (board[1][1] === player) {
                if (board[2][1] === player) return true;
            }
        }

        if (board[0][2] === player) {
            if (board[1][1] === player) {
                if (board[2][0] === player) return true;
            }
            if (board[1][2] === player) {
                if (board[2][2] === player) return true;
            }
        }

        if (board[1][0] === player) {
            if (board[1][1] === player) {
                if (board[1][2] === player) return true;
            }
        }

        if (board[2][0] === player) {
            if (board[2][1] === player) {
                if (board[2][2] === player) return true;
            }
        }

        return false;
    }

    public isFinalMove(board: Board): boolean {
        if (this.isWinning(Player.X, board) || this.isWinning(Player.O, board)) {
            return true;
        }
        return false;
    }

    public writeBoard(square: number, player: Player, board: Board) {
        switch (square) {
            case 1:
                board[0][0] = player === Player.X ? 'X' : 'O';
                break;
            case 2:
                board[0][1] = player === Player.X ? 'X' : 'O';
                break;
            case 3:
                board[0][2] = player === Player.X ? 'X' : 'O';
                break;
            case 4:
                board[1][0] = player === Player.X ? 'X' : 'O';
                break;
            case 5:
                board[1][1] = player === Player.X ? 'X' : 'O';
                break;
            case 6:
                board[1][2] = player === Player.X ? 'X' : 'O';
                break;
            case 7:
                board[2][0] = player === Player.X ? 'X' : 'O';
                break;
            case 8:
                board[2][1] = player === Player.X ? 'X' : 'O';
                break;
            case 9:
                board[2][2] = player === Player.X ? 'X' : 'O';
                break;
            default:
                return;
        }
    }

    // player is the player that will take the next move
    // move is the next move that player will take
    public miniMax(player: Player, board: Board, move: Move): [Score, Move] {
        if (this.isFinalMove(board)) {
            return [this.miniMaxScore(player, board), move];
        }

        let scores: Score[] = [];
        let moves: Move[] = [];

        board.forEach((r, row) => {
            r.forEach((c, col) => {
                if (board[row][col] === null) {
                    // Clone the gameboard
                    let newBoard = board.map(x => x.slice());
                    let newMove = this.mapRowColToSquare(row, col);
                    newBoard[row][col] = player as string;
                    let newPlayer = player === Player.X ? Player.O : Player.X;
                    scores.push(this.miniMax(newPlayer, newBoard, newMove)[0]);
                    moves.push(newMove);
                }
            });
        });

        // Min or max calculation
        if (player === Player.O) {
            let maxScoreIndex = scores.indexOf(Math.max(...scores));
            return [scores[maxScoreIndex] ?? 0, moves[maxScoreIndex]];
        } else {
            let minScoreIndex = scores.indexOf(Math.min(...scores));
            return [scores[minScoreIndex] ?? 0, moves[minScoreIndex]];
        }
    }

    // Get minimax score for the AI Player for the given board position.
    // player is the Player that will take the next move.
    private miniMaxScore(player: Player, board: Board): Score {
        if (this.isWinning(Player.O, board)) {
            return 10;
        }
        if (this.isWinning(Player.X, board)) {
            return -10;
        }
        return 0;
    }

    public moveAI() {
        console.log('￪-- AI Turn\n')
        this.turn++;
        let nextMove = this.miniMax(Player.O, this.gameBoard, undefined)[1];
        console.log('NEXT MOVE BY AI:', nextMove)
        this.writeBoard(nextMove, Player.O, this.gameBoard);
        this.printBoard();
        if (this.isWinning(Player.O, this.gameBoard)) {
            console.log("  YOU LOSE")
            this.gameOver = true;
            return;
        }
    }

    public movePlayer() {
        const prompt = Prompt();
        let isValid = false;
        let square: number;
        while (!isValid) {
            let input = prompt('Press 1-9 to pick the next move, 0 to minimax, x to quit\n');
            if (input === 'x') this.gameOver = true;
            square = parseInt(input);
            if (this.isSquareEmpty(square)) {
                isValid = true;
            } else {
                console.log('Choose another empty square!')
            }
        }
        
        this.writeBoard(square, Player.X, this.gameBoard);
        this.turn++;
        this.printBoard();
    }

    // Start the game
    public async start() {
        console.log(" --- GAME START --- ");
        this.printBoard();
        while(!this.gameOver) {
            this.movePlayer();
            if (this.isWinning(Player.X, this.gameBoard)) {
                console.log('**** YOU WIN ****');
                this.gameOver = true;
                break;
            }
            // AI turn
            this.moveAI();
        }
        console.log("\n --- GAME OVER --- ");
    }
}

let ttt = new TicTacToe();
ttt.start();
// let board = [
//     ['O', 'X', 'X'],
//     ['X', 'O', null],
//     ['O', null, null],
//  ];

//  console.log(ttt.miniMax(Player.O, board, undefined));